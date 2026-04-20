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
  },
  {
    id: 4,
    nome: 'Diego Paciente',
    email: 'diego@clinica.com',
    senha: '123456',
    tipo: 'paciente',
  },
  {
    id: 5,
    nome: 'Elisa Paciente',
    email: 'elisa@clinica.com',
    senha: '123456',
    tipo: 'paciente',
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

export async function cadastrarUsuario(novoUsuario) {
  const emailExistente = usuarios.some(
    (usuario) => usuario.email.toLowerCase() === novoUsuario.email.toLowerCase().trim()
  );

  if (emailExistente) {
    throw new Error('Esse email já está cadastrado.');
  }

  const usuarioCriado = {
    id: usuarios.length + 1,
    nome: novoUsuario.nome,
    email: novoUsuario.email.toLowerCase().trim(),
    senha: novoUsuario.senha,
    tipo: novoUsuario.tipo,
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

export async function getPacientes() {
  return simularResposta(usuarios.filter((usuario) => usuario.tipo === 'paciente'));
}

export async function getPacientesComStatus() {
  const pacientes = usuarios.filter((usuario) => usuario.tipo === 'paciente');
  const resultado = pacientes.map((paciente) => {
    const statusAtual = statusPacientes.find((item) => item.pacienteId === paciente.id);

    return {
      ...paciente,
      statusPaciente: statusAtual?.status || 'aguardando check-in',
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

export async function criarConsulta({ pacienteId, estagiarioId, salaId, data, horario, status = 'pendente' }) {
  const novaConsulta = {
    id: getProximoId(consultas),
    pacienteId: Number(pacienteId),
    estagiarioId: Number(estagiarioId),
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
