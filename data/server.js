const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { inicializarBanco } = require('./setup-db');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'login_clinica'
});

app.post('/api/cadastro', async (req, res) => {
    const { nome, cpf, email, senha } = req.body;

    try {

        const sqlCheck = 'SELECT * FROM usuarios WHERE cpf = ?';
        
        db.query(sqlCheck, [cpf], async (err, results) => {
            if (err) return res.status(500).json({ erro: 'Erro no servidor ao buscar CPF.' });

            if (results.length === 0) {
                return res.status(403).json({ erro: 'CPF não autorizado. Solicite liberação a um administrador.' });
            }

            const usuario = results[0];

            if (usuario.email || usuario.senha_hash) {
                return res.status(400).json({ erro: 'Este CPF já possui um acesso ativo. Vá para a tela de login.' });
            }

            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            // 2. Agora faz o UPDATE na tabela USUARIOS
            const sqlUpdate = 'UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE cpf = ?';
            
            db.query(sqlUpdate, [nome, email, senhaHash, cpf], (errUpdate, result) => {
                if (errUpdate) {
                    if (errUpdate.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ erro: 'Este e-mail já está sendo usado por outra pessoa.' });
                    }
                    return res.status(500).json({ erro: 'Erro ao salvar as credenciais de acesso.' });
                }
                res.status(201).json({ mensagem: 'Senha criada com sucesso! Agora você pode entrar.' });
            });
        });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao processar o cadastro.' });
    }
});


app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;


    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro no servidor.' });

        if (results.length === 0) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const usuario = results[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

        res.json({ 
            mensagem: 'Login aprovado!', 
            usuario: { 
                id: usuario.id, 
                nome: usuario.nome,
                cargo: usuario.cargo 
            } 
        });
    });
});


app.get('/api/usuarios', (req, res) => {
    const { cargo } = req.query;

    const sql = 'SELECT id, nome, email, cpf, cargo FROM usuarios WHERE cargo = ?';
    db.query(sql, [cargo], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar a lista no banco de dados.' });
        res.json(results);
    });
});

app.post('/api/admin/cadastrar', (req, res) => {

    const { nome, cpf, matricula, estagio_atual, cargo } = req.body;
    const sql = "INSERT INTO usuarios (nome, cpf, matricula, estagio_atual, cargo) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nome, cpf, matricula, estagio_atual, cargo], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ erro: 'Este CPF já está cadastrado no sistema.' });
            }
            return res.status(500).json({ erro: 'Erro ao salvar o pré-cadastro no banco de dados.' });
        }
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    });
});


app.post('/api/agendar', (req, res) => {
    const { estagiario_id, paciente_id, data_consulta, horario } = req.body;

    // Verifica se há uma sala ocupada
    const sqlVerificaSala = 'SELECT COUNT(*) as quantidade FROM salas WHERE status = "ocupada"';
    
    db.query(sqlVerificaSala, (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao verificar disponibilidade das salas.' });
        
        if (result[0].quantidade > 0) {
            return res.status(400).json({ erro: 'Não é possível agendar: há uma sala ocupada no momento.' });
        }

        // Se nenhuma sala está ocupada, prossegue com o agendamento
        const sql = 'INSERT INTO consultas (estagiario_id, paciente_id, data_consulta, horario) VALUES (?, ?, ?, ?)';
        
        db.query(sql, [estagiario_id, paciente_id, data_consulta, horario], (err, result) => {
            if (err) return res.status(500).json({ erro: 'Erro ao salvar a consulta no banco de dados.' });
            res.status(201).json({ mensagem: 'Agendamento concluído com sucesso!' });
        });
    });
});


app.get('/api/consultas', (req, res) => {
    const { estagiario_id, status, data } = req.query;

    let sql = `
        SELECT c.id, c.estagiario_id, c.paciente_id,
        DATE_FORMAT(c.data_consulta, '%Y-%m-%d') AS data_consulta,
        c.horario, c.status,
        p.nome AS pacienteNome,
        e.nome AS estagiarioNome
        FROM consultas c
        JOIN usuarios p ON c.paciente_id = p.id
        JOIN usuarios e ON c.estagiario_id = e.id
        WHERE 1=1
    `;
    const params = [];

    if (estagiario_id) {
        sql += ' AND c.estagiario_id = ?';
        params.push(estagiario_id);
    }
    if (status) {
        sql += ' AND c.status = ?';
        params.push(status);
    }
    if (data) {
        sql += ' AND DATE(c.data_consulta) = ?';
        params.push(data);
    }

    sql += ' ORDER BY c.data_consulta DESC, c.horario DESC';

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar consultas.' });
        res.json(results);
    });
});


app.get('/api/consultas/paciente/:paciente_id', (req, res) => {
    const { paciente_id } = req.params;

    const sql = `
        SELECT c.id, DATE_FORMAT(c.data_consulta, '%Y-%m-%d') AS data_consulta, c.horario, c.status, u.nome AS estagiario_nome
        FROM consultas c
        JOIN usuarios u ON c.estagiario_id = u.id
        WHERE c.paciente_id = ?
        ORDER BY c.data_consulta DESC, c.horario DESC
    `;
    
    db.query(sql, [paciente_id], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar as consultas do paciente.' });
        res.json(results);
    });
});


app.get('/api/consultas/:estagiario_id', (req, res) => {
    const { estagiario_id } = req.params;

    const sql = `
        SELECT c.id, DATE_FORMAT(c.data_consulta, '%Y-%m-%d') AS data_consulta, c.horario, c.status, u.nome AS paciente_nome
        FROM consultas c
        JOIN usuarios u ON c.paciente_id = u.id
        WHERE c.estagiario_id = ?
        ORDER BY c.data_consulta ASC, c.horario ASC
    `;
    
    db.query(sql, [estagiario_id], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar a agenda.' });
        res.json(results);
    });
});


app.post('/api/relatorios', (req, res) => {
    const { estagiario_id, paciente_id, resumo, duvidas, status } = req.body;

    if (!estagiario_id || !paciente_id || !resumo) {
        return res.status(400).json({ erro: 'Estagiário, paciente e resumo são obrigatórios.' });
    }

    const sql = 'INSERT INTO relatorios (estagiario_id, paciente_id, resumo, duvidas, status) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [estagiario_id, paciente_id, resumo, duvidas || null, status || 'enviado'], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao salvar o relatório no banco de dados.' });
        res.status(201).json({ mensagem: 'Relatório clínico processado com sucesso!' });
    });
});


app.put('/api/consultas/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = 'UPDATE consultas SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao atualizar o status da consulta.' });
        res.json({ mensagem: 'Status atualizado com sucesso!' });
    });
});


app.get('/api/usuarios/perfil/:id', (req, res) => {
    const { id } = req.params;
    

    const sql = `
        SELECT u.nome, u.email, u.cpf, u.telefone,
        (SELECT u2.nome FROM consultas c JOIN usuarios u2 ON c.estagiario_id = u2.id WHERE c.paciente_id = u.id ORDER BY c.data_consulta DESC LIMIT 1) AS estagiario_nome
        FROM usuarios u
        WHERE u.id = ?
    `;
    
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar dados do perfil.' });
        if (results.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
        res.json(results[0]);
    });
});


app.put('/api/usuarios/:id/senha', (req, res) => {
    const { id } = req.params;
    const { novaSenha } = req.body;

    const sql = 'UPDATE usuarios SET senha = ? WHERE id = ?';
    db.query(sql, [novaSenha, id], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao salvar a nova senha no banco.' });
        res.json({ mensagem: 'Senha atualizada com sucesso!' });
    });
});


app.get('/api/exames/paciente/:paciente_id', (req, res) => {
    const { paciente_id } = req.params;
    const sql = 'SELECT *, DATE_FORMAT(data_solicitacao, "%Y-%m-%d") as data FROM exames WHERE paciente_id = ? ORDER BY data_solicitacao DESC';
    
    db.query(sql, [paciente_id], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar exames.' });
        res.json(results);
    });
});


app.put('/api/exames/:id/anexar', (req, res) => {
    const { id } = req.params;
    const { arquivo_nome } = req.body;
    
    const sql = 'UPDATE exames SET status = "anexado", arquivo_nome = ? WHERE id = ?';
    db.query(sql, [arquivo_nome, id], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao anexar arquivo.' });
        res.json({ mensagem: 'Arquivo anexado com sucesso!' });
    });
});


app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    
    const sql = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';
    db.query(sql, [nome, email, id], (err, result) => {
        if (err) return res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
        res.json({ mensagem: 'Usuário atualizado!' });
    });
});


app.post('/api/consultas', (req, res) => {
    const { data_consulta, horario } = req.body;

    const data = new Date(data_consulta + 'T00:00:00');
    const diaSemana = data.getDay();
    const hora = parseInt(horario.split(':')[0]);

    let horarioValido = false;

    if (diaSemana === 0) { 
        horarioValido = false;
    } else if (diaSemana === 6) { 
        horarioValido = (hora >= 8 && hora < 14);
    } else { 
        horarioValido = (hora >= 8 && hora < 20);
    }

    if (!horarioValido) {
        return res.status(400).json({ erro: "Horário fora do expediente da clínica." });
    }


});


app.get('/api/prontuarios', (req, res) => {
    const estagiarioId = req.query.estagiario_id;
    let sql = `
        SELECT 
            COALESCE(p.id, r.id) as id,
            COALESCE(p.paciente_id, r.paciente_id) as paciente_id,
            COALESCE(p.estagiario_id, r.estagiario_id) as estagiario_id,
            u_pac.nome as paciente,
            u_est.nome as estagiario,
            p.sessao,
            p.supervisor,
            COALESCE(p.status, r.status, 'pendente') as status,
            r.resumo,
            r.criado_em
        FROM relatorios r
        LEFT JOIN prontuarios p ON r.paciente_id = p.paciente_id AND r.estagiario_id = p.estagiario_id
        JOIN usuarios u_pac ON r.paciente_id = u_pac.id
        JOIN usuarios u_est ON r.estagiario_id = u_est.id
    `;
    
    if (estagiarioId) {
        sql += ` WHERE r.estagiario_id = ${db.escape(estagiarioId)}`;
    }
    
    sql += ` ORDER BY r.criado_em DESC`;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar prontuários.' });
        res.json(results);
    });
});


app.get('/api/prontuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            r.id,
            r.paciente_id,
            r.estagiario_id,
            u_pac.nome as paciente,
            u_est.nome as estagiario,
            p.sessao,
            p.supervisor,
            r.status,
            r.resumo,
            r.duvidas,
            r.criado_em,
            c.data_consulta,
            c.horario
        FROM relatorios r
        LEFT JOIN prontuarios p ON r.paciente_id = p.paciente_id AND r.estagiario_id = p.estagiario_id
        JOIN usuarios u_pac ON r.paciente_id = u_pac.id
        JOIN usuarios u_est ON r.estagiario_id = u_est.id
        LEFT JOIN consultas c ON r.paciente_id = c.paciente_id AND r.estagiario_id = c.estagiario_id
        WHERE r.id = ?
        LIMIT 1
    `;
    
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar prontuário.' });
        if (results.length === 0) return res.status(404).json({ erro: 'Prontuário não encontrado.' });
        res.json(results[0]);
    });
});


app.get('/api/dashboard', async (req, res) => {
    try {
        console.log("Iniciando busca do dashboard...");


        const queryPromise = (sql) => {
            return new Promise((resolve, reject) => {
                db.query(sql, (err, rows) => {
                    if (err) {
                        console.error("Erro no SQL:", err.message); 
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        };

        const consultasHoje = await queryPromise(`
            SELECT c.*, p.nome as pacienteNome, e.nome as estagiarioNome 
            FROM consultas c 
            JOIN usuarios p ON c.paciente_id = p.id 
            JOIN usuarios e ON c.estagiario_id = e.id 
            WHERE DATE(c.data_consulta) = CURDATE()
        `);

        const estagiarios = await queryPromise("SELECT * FROM usuarios WHERE cargo = 'estagiario' LIMIT 4");
        const salas = await queryPromise("SELECT * FROM salas");

        const kpis = [
            { titulo: 'Consultas Hoje', valor: consultasHoje.length, icone: 'fa-calendar-day' },
            { titulo: 'Estagiários', valor: estagiarios.length, icone: 'fa-user-graduate' },
            { titulo: 'Salas Ocupadas', valor: salas.filter(s => s.status === 'ocupada').length, icone: 'fa-door-closed' }
        ];

        res.json({ kpis, consultasHoje, estagiarios, salas });
    } catch (err) {
        console.error("Erro crítico na rota /api/dashboard:", err);
        res.status(500).json({ erro: 'Erro no servidor: ' + err.message });
    }
});

async function iniciarServidor() {
    try {
        await inicializarBanco();
    } catch (err) {
        console.error('Não foi possível inicializar o banco de dados:', err.message);
        process.exit(1);
    }

    db.connect((err) => {
        if (err) throw err;
        console.log('Conectado ao MySQL com sucesso!');
    });

    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
        console.log('Rotas principais: /api/login, /api/consultas, /api/dashboard');
    });
}

iniciarServidor();