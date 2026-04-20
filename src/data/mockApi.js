const hoje = '2026-04-20';
const statusSalaValidos = ['disponivel', 'ocupada', 'em reforma'];

const usuarios = [
  {
    id: 1,
    nome: 'Ana Admin',
    email: 'admin@clinica.com',
    senha: '123456',
    tipo: 'admin',
  },
  {
    id: 2,
    nome: 'Bruno Estagiario',
    email: 'estagiario@clinica.com',
    senha: '123456',
    tipo: 'estagiario',
  },
  {
    id: 3,
    nome: 'Carla Paciente',
    email: 'paciente@clinica.com',
    senha: '123456',
    tipo: 'paciente',
    responsavelEstagiarioId: 2,
  },
  {
    id: 4,
    nome: 'Diego Paciente',
    email: 'diego@clinica.com',
    senha: '123456',
    tipo: 'paciente',
    responsavelEstagiarioId: 2,
  },
  {
    id: 5,
    nome: 'Elisa Paciente',
    email: 'elisa@clinica.com',
    senha: '123456',
    tipo: 'paciente',
    responsavelEstagiarioId: 2,
  },
];

let salas = [
  { id: 1, nome: 'Sala 01', status: 'disponivel' },
  { id: 2, nome: 'Sala 02', status: 'ocupada' },
  { id: 3, nome: 'Sala 03', status: 'em reforma' },
  { id: 4, nome: 'Sala 04', status: 'disponivel' },
  { id: 5, nome: 'Sala 05', status: 'ocupada' },
  { id: 6, nome: 'Sala 06', status: 'disponivel' },
];

let consultas = [
  {
    id: 1,
    pacienteId: 3,
    estagiarioId: 2,
    salaId: 1,
    data: hoje,
    horario: '09:00',
    status: 'pendente',
  },
  {
    id: 2,
    pacienteId: 4,
    estagiarioId: 2,
    salaId: 2,
    data: hoje,
    horario: '11:00',
    status: 'confirmado',
  },
  {
    id: 3,
    pacienteId: 5,
    estagiarioId: 2,
    salaId: 3,
    data: hoje,
    horario: '14:00',
    status: 'cancelado',
  },
];

let statusPacientes = [
  { pacienteId: 3, status: 'aguardando check-in' },
  { pacienteId: 4, status: 'exame pendente' },
  { pacienteId: 5, status: 'cancelado' },
];

let solicitacoesExame = [
  {
    id: 1,
    consultaId: 1,
    titulo: 'Hemograma completo',
    descricao: 'Paciente deve realizar hemograma antes da próxima sessão.',
    solicitadoPorId: 2,
    anexado: false,
    arquivoNome: '',
  },
];

function simularResposta(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 350);
  });
}

function getProximoId(lista) {
  return Math.max(...lista.map((item) => item.id), 0) + 1;
}

function statusPacientePorConsultaStatus(statusConsulta) {
  if (statusConsulta === 'confirmado') {
    return 'exame pendente';
  }
  if (statusConsulta === 'cancelado') {
    return 'cancelado';
  }
  return 'aguardando check-in';
}

function atualizarStatusPaciente(pacienteId, statusConsulta) {
  const novoStatus = statusPacientePorConsultaStatus(statusConsulta);
  const index = statusPacientes.findIndex((item) => item.pacienteId === pacienteId);

  if (index >= 0) {
    statusPacientes[index] = { ...statusPacientes[index], status: novoStatus };
  } else {
    statusPacientes.push({ pacienteId, status: novoStatus });
  }
}

function getResponsavelPacienteId(pacienteId) {
  const paciente = usuarios.find((usuario) => usuario.id === Number(pacienteId) && usuario.tipo === 'paciente');
  return paciente?.responsavelEstagiarioId || null;
}

function enriquecerConsulta(consulta) {
  const paciente = usuarios.find((usuario) => usuario.id === consulta.pacienteId);
  const estagiario = usuarios.find((usuario) => usuario.id === consulta.estagiarioId);
  const sala = salas.find((item) => item.id === consulta.salaId);

  return {
    ...consulta,
    pacienteNome: paciente?.nome || 'Paciente não encontrado',
    estagiarioNome: estagiario?.nome || 'Estagiário não encontrado',
    salaNome: sala?.nome || 'Sala não encontrada',
    salaStatus: sala?.status || 'indefinido',
  };
}

export async function login(email, senha) {
  const usuario = usuarios.find(
    (item) => item.email.toLowerCase() === email.toLowerCase().trim() && item.senha === senha
  );

  if (!usuario) {
    throw new Error('Email ou senha inválidos.');
  }

  return simularResposta(usuario);
}

export async function cadastrarUsuario(novoUsuario, contexto = {}) {
  const atorTipo = contexto.atorTipo;
  const atorId = Number(contexto.atorId);
  const tipoNovoUsuario = novoUsuario.tipo;

  if (!atorTipo) {
    throw new Error('Cadastro público não é permitido.');
  }

  if (tipoNovoUsuario === 'admin') {
    throw new Error('Não é permitido cadastrar administrador por esta tela.');
  }

  if (atorTipo === 'estagiario' && tipoNovoUsuario !== 'paciente') {
    throw new Error('Estagiário só pode cadastrar pacientes.');
  }

  if (atorTipo !== 'admin' && atorTipo !== 'estagiario') {
    throw new Error('Sem permissão para cadastro.');
  }

  const emailExistente = usuarios.some(
    (usuario) => usuario.email.toLowerCase() === novoUsuario.email.toLowerCase().trim()
  );

  if (emailExistente) {
    throw new Error('Esse email já está cadastrado.');
  }

  const estagiarioPadrao = usuarios.find((usuario) => usuario.tipo === 'estagiario');
  const responsavelPacienteId =
    tipoNovoUsuario === 'paciente'
      ? atorTipo === 'estagiario'
        ? atorId
        : Number(novoUsuario.responsavelEstagiarioId) || estagiarioPadrao?.id || null
      : undefined;

  if (tipoNovoUsuario === 'paciente' && !responsavelPacienteId) {
    throw new Error('Paciente precisa de um estagiário responsável.');
  }

  const usuarioCriado = {
    id: usuarios.length + 1,
    nome: novoUsuario.nome,
    email: novoUsuario.email.toLowerCase().trim(),
    senha: novoUsuario.senha,
    tipo: tipoNovoUsuario,
    responsavelEstagiarioId: responsavelPacienteId,
  };

  usuarios.push(usuarioCriado);
  return simularResposta(usuarioCriado);
}

export async function getEstagiarios(filtroNome = '') {
  const filtro = filtroNome.trim().toLowerCase();
  const estagiarios = usuarios.filter(
    (usuario) => usuario.tipo === 'estagiario' && usuario.nome.toLowerCase().includes(filtro)
  );

  return simularResposta(estagiarios);
}

export async function getPacientes(estagiarioId = null) {
  const pacientes = usuarios.filter((usuario) => usuario.tipo === 'paciente');
  const filtrados = estagiarioId
    ? pacientes.filter((paciente) => paciente.responsavelEstagiarioId === Number(estagiarioId))
    : pacientes;

  return simularResposta(filtrados);
}

export async function getPacientesComStatus(estagiarioId = null) {
  const pacientes = await getPacientes(estagiarioId);
  const resultado = pacientes.map((paciente) => {
    const statusAtual = statusPacientes.find((item) => item.pacienteId === paciente.id);
    const responsavel = usuarios.find(
      (usuario) => usuario.id === paciente.responsavelEstagiarioId && usuario.tipo === 'estagiario'
    );

    return {
      ...paciente,
      statusPaciente: statusAtual?.status || 'aguardando check-in',
      estagiarioResponsavelNome: responsavel?.nome || 'Sem responsável',
    };
  });

  return simularResposta(resultado);
}

export async function getConsultasByUsuario(userId) {
  const usuario = usuarios.find((item) => item.id === userId);

  if (!usuario) {
    return simularResposta([]);
  }

  let resultado = [];

  if (usuario.tipo === 'admin') {
    resultado = consultas;
  } else if (usuario.tipo === 'estagiario') {
    resultado = consultas.filter((consulta) => consulta.estagiarioId === userId);
  } else {
    resultado = consultas.filter((consulta) => consulta.pacienteId === userId);
  }

  return simularResposta(resultado.map(enriquecerConsulta));
}

export async function getConsultaById(consultaId) {
  const consulta = consultas.find((item) => item.id === Number(consultaId));
  if (!consulta) {
    throw new Error('Consulta não encontrada.');
  }

  return simularResposta(enriquecerConsulta(consulta));
}

export async function getConsultasDisponiveis() {
  const consultasDoDia = consultas
    .filter((consulta) => consulta.data === hoje && consulta.status === 'pendente')
    .map(enriquecerConsulta);

  return simularResposta(consultasDoDia);
}

export async function fazerCheckIn(consultaId) {
  consultas = consultas.map((consulta) =>
    consulta.id === consultaId ? { ...consulta, status: 'confirmado' } : consulta
  );

  const consultaAtualizada = consultas.find((consulta) => consulta.id === consultaId);
  if (consultaAtualizada) {
    atualizarStatusPaciente(consultaAtualizada.pacienteId, consultaAtualizada.status);
  }
  return simularResposta(enriquecerConsulta(consultaAtualizada));
}

export async function atualizarStatusConsulta(consultaId, novoStatus) {
  consultas = consultas.map((consulta) =>
    consulta.id === consultaId ? { ...consulta, status: novoStatus } : consulta
  );

  const consultaAtualizada = consultas.find((consulta) => consulta.id === consultaId);
  if (consultaAtualizada) {
    atualizarStatusPaciente(consultaAtualizada.pacienteId, consultaAtualizada.status);
  }
  return simularResposta(enriquecerConsulta(consultaAtualizada));
}

export async function getSolicitacoesExameByConsulta(consultaId) {
  const solicitacoes = solicitacoesExame.filter((item) => item.consultaId === Number(consultaId));
  return simularResposta(solicitacoes);
}

export async function solicitarExame({ consultaId, titulo, descricao, solicitadoPorId }) {
  const tituloLimpo = titulo?.trim();
  const descricaoLimpa = descricao?.trim();

  if (!tituloLimpo || !descricaoLimpa) {
    throw new Error('Preencha título e descrição do exame.');
  }

  const consultaExiste = consultas.some((consulta) => consulta.id === Number(consultaId));
  if (!consultaExiste) {
    throw new Error('Consulta não encontrada para solicitar exame.');
  }

  const novaSolicitacao = {
    id: getProximoId(solicitacoesExame),
    consultaId: Number(consultaId),
    titulo: tituloLimpo,
    descricao: descricaoLimpa,
    solicitadoPorId: Number(solicitadoPorId),
    anexado: false,
    arquivoNome: '',
  };

  solicitacoesExame = [novaSolicitacao, ...solicitacoesExame];
  return simularResposta(novaSolicitacao);
}

export async function anexarExame(solicitacaoId, arquivoNome = 'exame-anexado.pdf') {
  const existe = solicitacoesExame.some((item) => item.id === Number(solicitacaoId));
  if (!existe) {
    throw new Error('Solicitação de exame não encontrada.');
  }

  solicitacoesExame = solicitacoesExame.map((item) =>
    item.id === Number(solicitacaoId)
      ? {
          ...item,
          anexado: true,
          arquivoNome,
        }
      : item
  );

  const solicitacaoAtualizada = solicitacoesExame.find((item) => item.id === Number(solicitacaoId));
  return simularResposta(solicitacaoAtualizada);
}

export async function getSalas() {
  return simularResposta([...salas]);
}

export async function criarSala(nome, status) {
  const nomeLimpo = nome.trim();
  const statusLimpo = status.trim().toLowerCase();

  if (!nomeLimpo) {
    throw new Error('Informe um nome para a sala.');
  }

  if (!statusSalaValidos.includes(statusLimpo)) {
    throw new Error('Status inválido para a sala.');
  }

  const salaExiste = salas.some((sala) => sala.nome.toLowerCase() === nomeLimpo.toLowerCase());
  if (salaExiste) {
    throw new Error('Essa sala já existe.');
  }

  const novaSala = {
    id: getProximoId(salas),
    nome: nomeLimpo,
    status: statusLimpo,
  };

  salas = [novaSala, ...salas];
  return simularResposta(novaSala);
}

export async function atualizarStatusSala(salaId, novoStatus) {
  const statusLimpo = novoStatus.trim().toLowerCase();

  if (!statusSalaValidos.includes(statusLimpo)) {
    throw new Error('Status inválido para a sala.');
  }

  const salaExiste = salas.some((sala) => sala.id === Number(salaId));
  if (!salaExiste) {
    throw new Error('Sala não encontrada.');
  }

  salas = salas.map((sala) => (sala.id === Number(salaId) ? { ...sala, status: statusLimpo } : sala));
  const salaAtualizada = salas.find((sala) => sala.id === Number(salaId));

  return simularResposta(salaAtualizada);
}

export async function criarConsulta({ pacienteId, estagiarioId, salaId, data, horario, status = 'pendente' }) {
  const paciente = usuarios.find((usuario) => usuario.id === Number(pacienteId) && usuario.tipo === 'paciente');
  if (!paciente) {
    throw new Error('Paciente não encontrado.');
  }

  const responsavelEstagiarioId = getResponsavelPacienteId(pacienteId);
  if (!responsavelEstagiarioId) {
    throw new Error('Paciente sem estagiário responsável.');
  }

  if (Number(estagiarioId) !== responsavelEstagiarioId) {
    throw new Error('Esse paciente pertence a outro estagiário responsável.');
  }

  const novaConsulta = {
    id: getProximoId(consultas),
    pacienteId: Number(pacienteId),
    estagiarioId: responsavelEstagiarioId,
    salaId: Number(salaId),
    data: data?.trim() || hoje,
    horario: horario?.trim() || '08:00',
    status,
  };

  consultas = [novaConsulta, ...consultas];
  atualizarStatusPaciente(novaConsulta.pacienteId, novaConsulta.status);
  return simularResposta(enriquecerConsulta(novaConsulta));
}

export async function getUsuarios() {
  return simularResposta([...usuarios]);
}
