const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    multipleStatements: true,
};

const ESTAGIARIOS = [
    { nome: 'Bruno Estagiário', cpf: '11111111111', email: 'estagiario@clinica.com', matricula: '202604129', estagio_atual: 'Supervisão clínica' },
    { nome: 'Camila Souza', cpf: '22222222221', email: 'camila@clinica.com', matricula: '202604130', estagio_atual: 'Estágio supervisionado' },
    { nome: 'Daniel Lima', cpf: '22222222222', email: 'daniel@clinica.com', matricula: '202604131', estagio_atual: 'Terapia cognitiva' },
    { nome: 'Elena Martins', cpf: '22222222223', email: 'elena@clinica.com', matricula: '202604132', estagio_atual: 'Psicopatologia' },
    { nome: 'Felipe Rocha', cpf: '22222222224', email: 'felipe@clinica.com', matricula: '202604133', estagio_atual: 'Avaliação psicológica' },
    { nome: 'Gabriela Pires', cpf: '22222222225', email: 'gabriela@clinica.com', matricula: '202604134', estagio_atual: 'Intervenção em grupo' },
];

const PACIENTES = [
    { nome: 'Carla Paciente', cpf: '12345678900', email: 'carla@paciente.com', matricula: 'PAC-001', telefone: '(11) 98765-4321' },
    { nome: 'Diego Paciente', cpf: '98765432100', email: 'diego@paciente.com', matricula: 'PAC-002', telefone: '(11) 91234-5678' },
    { nome: 'Elisa Moura', cpf: '33333333331', email: 'elisa@paciente.com', matricula: 'PAC-003', telefone: '(11) 99887-1122' },
    { nome: 'Fernando Costa', cpf: '33333333332', email: 'fernando@paciente.com', matricula: 'PAC-004', telefone: '(11) 99776-3344' },
    { nome: 'Helena Dias', cpf: '33333333333', email: 'helena@paciente.com', matricula: 'PAC-005', telefone: '(11) 99665-5566' },
    { nome: 'Igor Nunes', cpf: '33333333334', email: 'igor@paciente.com', matricula: 'PAC-006', telefone: '(11) 99554-7788' },
    { nome: 'Julia Ribeiro', cpf: '33333333335', email: 'julia@paciente.com', matricula: 'PAC-007', telefone: '(11) 99443-9900' },
    { nome: 'Klaus Teixeira', cpf: '33333333336', email: 'klaus@paciente.com', matricula: 'PAC-008', telefone: '(11) 99332-1212' },
    { nome: 'Laura Fonseca', cpf: '33333333337', email: 'laura@paciente.com', matricula: 'PAC-009', telefone: '(11) 99221-3434' },
    { nome: 'Marcos Vieira', cpf: '33333333338', email: 'marcos@paciente.com', matricula: 'PAC-010', telefone: '(11) 99110-5656' },
];

const HORARIOS = ['08:00:00', '09:30:00', '11:00:00', '14:00:00', '16:30:00'];
const STATUS_CONSULTA = ['pendente', 'confirmado', 'realizada', 'falta', 'cancelado'];

async function ensureSchema(conn) {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await conn.query(schema);
}

async function upsertUsuario(conn, usuario, cargo, senhaHash) {
    const [existentes] = await conn.query(
        'SELECT id FROM login_clinica.usuarios WHERE cpf = ?',
        [usuario.cpf]
    );

    if (existentes.length > 0) {
        await conn.query(
            `UPDATE login_clinica.usuarios
             SET nome = ?, email = ?, senha_hash = ?, matricula = ?, estagio_atual = ?, telefone = ?, cargo = ?
             WHERE cpf = ?`,
            [
                usuario.nome,
                usuario.email,
                senhaHash,
                usuario.matricula || null,
                usuario.estagio_atual || null,
                usuario.telefone || null,
                cargo,
                usuario.cpf,
            ]
        );
        return existentes[0].id;
    }

    const [resultado] = await conn.query(
        `INSERT INTO login_clinica.usuarios (nome, cpf, email, senha_hash, matricula, estagio_atual, cargo, telefone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            usuario.nome,
            usuario.cpf,
            usuario.email,
            senhaHash,
            usuario.matricula || null,
            usuario.estagio_atual || null,
            cargo,
            usuario.telefone || null,
        ]
    );

    return resultado.insertId;
}

async function garantirAdmin(conn, senhaHash) {
    const [existentes] = await conn.query(
        "SELECT id FROM login_clinica.usuarios WHERE cargo = 'admin' LIMIT 1"
    );

    if (existentes.length > 0) return;

    await conn.query(
        `INSERT INTO login_clinica.usuarios (nome, cpf, email, senha_hash, cargo, telefone) VALUES
        ('Ana Admin', '00000000000', 'admin@clinica.com', ?, 'admin', '(11) 90000-0001')`,
        [senhaHash]
    );
}

async function garantirSalas(conn) {
    const [existentes] = await conn.query('SELECT COUNT(*) AS total FROM login_clinica.salas');

    if (existentes[0].total > 0) return;

    await conn.query(
        `INSERT INTO login_clinica.salas (nome, status) VALUES
        ('Sala 01', 'disponivel'),
        ('Sala 02', 'ocupada'),
        ('Sala 03', 'disponivel'),
        ('Sala 04', 'disponivel'),
        ('Sala 05', 'disponivel'),
        ('Sala 06', 'em reforma')`
    );
}

async function inserirConsultasExemplo(conn) {
    const [pacientes] = await conn.query(
        "SELECT id FROM login_clinica.usuarios WHERE cargo = 'paciente' ORDER BY id"
    );
    const [estagiarios] = await conn.query(
        "SELECT id FROM login_clinica.usuarios WHERE cargo = 'estagiario' ORDER BY id"
    );

    if (pacientes.length === 0 || estagiarios.length === 0) return;

    await conn.query('DELETE FROM login_clinica.consultas');

    const linhas = [];
    const params = [];

    pacientes.forEach((paciente, indicePaciente) => {
        const totalConsultas = 3 + (indicePaciente % 2);

        for (let i = 0; i < totalConsultas; i++) {
            const estagiario = estagiarios[(indicePaciente + i) % estagiarios.length];
            const offsetDias = i === 0 ? 0 : (i % 2 === 0 ? -(i * 5) : (i * 4));
            const horario = HORARIOS[(indicePaciente + i) % HORARIOS.length];
            const status = STATUS_CONSULTA[(indicePaciente + i) % STATUS_CONSULTA.length];

            linhas.push('(?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), ?, ?)');
            params.push(estagiario.id, paciente.id, offsetDias, horario, status);
        }
    });

    await conn.query(
        `INSERT INTO login_clinica.consultas (estagiario_id, paciente_id, data_consulta, horario, status)
         VALUES ${linhas.join(', ')}`,
        params
    );

    console.log(`Consultas de exemplo inseridas: ${linhas.length} (${pacientes.length} pacientes).`);
}

async function inserirProntuariosExemplo(conn) {
    const [pacientes] = await conn.query(
        "SELECT id FROM login_clinica.usuarios WHERE cargo = 'paciente' ORDER BY id LIMIT 6"
    );
    const [estagiarios] = await conn.query(
        "SELECT id FROM login_clinica.usuarios WHERE cargo = 'estagiario' ORDER BY id"
    );

    if (pacientes.length === 0 || estagiarios.length === 0) return;

    await conn.query('DELETE FROM login_clinica.prontuarios');

    const statusLista = ['pendente', 'andamento', 'enviado'];
    const linhas = [];
    const params = [];

    pacientes.forEach((paciente, indice) => {
        const estagiario = estagiarios[indice % estagiarios.length];
        linhas.push('(?, ?, ?, CURDATE(), ?, ?)');
        params.push(
            paciente.id,
            estagiario.id,
            `${String(indice + 1).padStart(2, '0')}/10`,
            'Dr. Robson',
            statusLista[indice % statusLista.length]
        );
    });

    await conn.query(
        `INSERT INTO login_clinica.prontuarios (paciente_id, estagiario_id, sessao, ultimo, supervisor, status)
         VALUES ${linhas.join(', ')}`,
        params
    );
}

async function inserirExamesExemplo(conn) {
    const [pacientes] = await conn.query(
        "SELECT id, nome FROM login_clinica.usuarios WHERE cargo = 'paciente' ORDER BY id LIMIT 5"
    );

    if (pacientes.length === 0) return;

    await conn.query('DELETE FROM login_clinica.exames');

    const examesModelo = [
        { titulo: 'Hemograma completo', descricao: 'Realizar antes da próxima sessão.', dias: 0, status: 'pendente', arquivo: null },
        { titulo: 'Escala de ansiedade', descricao: 'Questionário aplicado na clínica.', dias: -5, status: 'anexado', arquivo: 'escala-ansiedade.pdf' },
        { titulo: 'Ressonância magnética', descricao: 'Exame de rotina solicitado.', dias: -12, status: 'anexado', arquivo: 'ressonancia.pdf' },
        { titulo: 'Teste de atenção', descricao: 'Avaliação neuropsicológica.', dias: -3, status: 'pendente', arquivo: null },
        { titulo: 'Termo de consentimento', descricao: 'Documento assinado na recepção.', dias: -20, status: 'anexado', arquivo: 'consentimento.pdf' },
    ];

    const linhas = [];
    const params = [];

    pacientes.forEach((paciente, indice) => {
        const exame = examesModelo[indice % examesModelo.length];
        linhas.push('(?, ?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), ?, ?)');
        params.push(paciente.id, exame.titulo, exame.descricao, exame.dias, exame.status, exame.arquivo);
    });

    await conn.query(
        `INSERT INTO login_clinica.exames (paciente_id, titulo, descricao, data_solicitacao, status, arquivo_nome)
         VALUES ${linhas.join(', ')}`,
        params
    );
}

async function popularDadosExemplo(conn, { senhaHash }) {
    await garantirAdmin(conn, senhaHash);

    for (const estagiario of ESTAGIARIOS) {
        await upsertUsuario(conn, estagiario, 'estagiario', senhaHash);
    }

    for (const paciente of PACIENTES) {
        await upsertUsuario(conn, paciente, 'paciente', senhaHash);
    }

    await garantirSalas(conn);
    await inserirConsultasExemplo(conn);
    await inserirProntuariosExemplo(conn);
    await inserirExamesExemplo(conn);
}

async function seedDadosIniciais(conn) {
    const senhaHash = await bcrypt.hash('123456', 10);
    await popularDadosExemplo(conn, { senhaHash });

    console.log('Dados iniciais criados com sucesso!');
    console.log('');
    console.log('6 estagiários e 10 pacientes cadastrados (senha: 123456).');
    console.log('');
    console.log('Logins de exemplo:');
    console.log('  admin@clinica.com');
    ESTAGIARIOS.slice(0, 3).forEach((e) => console.log(`  ${e.email}`));
    PACIENTES.slice(0, 3).forEach((p) => console.log(`  ${p.email}`));
    console.log('  ...');
}

async function sincronizarDadosExistentes(conn) {
    const senhaHash = await bcrypt.hash('123456', 10);
    await popularDadosExemplo(conn, { senhaHash });
    console.log('Dados de exemplo sincronizados (6 estagiários, 10 pacientes e consultas).');
}

async function inicializarBanco({ sincronizar = false } = {}) {
    const conn = await mysql.createConnection(DB_CONFIG);

    console.log('Verificando banco de dados...');
    await ensureSchema(conn);

    const [rows] = await conn.query('SELECT COUNT(*) AS total FROM login_clinica.usuarios');

    if (rows[0].total === 0) {
        console.log('Primeira execução detectada — populando dados de exemplo...');
        await seedDadosIniciais(conn);
    } else if (sincronizar) {
        console.log('Sincronizando dados de exemplo...');
        await sincronizarDadosExistentes(conn);
    } else {
        console.log('Banco já inicializado.');
    }

    await conn.end();
}

module.exports = { inicializarBanco };

if (require.main === module) {
    const sincronizar = process.argv.includes('--sync');

    inicializarBanco({ sincronizar })
        .then(() => console.log('Setup concluído.'))
        .catch((err) => {
            console.error('Erro no setup:', err.message);
            process.exit(1);
        });
}
