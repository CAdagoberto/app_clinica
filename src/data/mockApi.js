const hoje = '2026-04-20';

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
];

const salas = [
  { id: 1, nome: 'Sala 01' },
  { id: 2, nome: 'Sala 02' },
  { id: 3, nome: 'Sala 03' },
  { id: 4, nome: 'Sala 04' },
  { id: 5, nome: 'Sala 05' },
  { id: 6, nome: 'Sala 06' },
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
    pacienteId: 3,
    estagiarioId: 2,
    salaId: 2,
    data: hoje,
    horario: '11:00',
    status: 'confirmado',
  },
  {
    id: 3,
    pacienteId: 3,
    estagiarioId: 2,
    salaId: 3,
    data: hoje,
    horario: '14:00',
    status: 'pendente',
  },
];

function simularResposta(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 350);
  });
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
  return simularResposta(enriquecerConsulta(consultaAtualizada));
}

export async function atualizarStatusConsulta(consultaId, novoStatus) {
  consultas = consultas.map((consulta) =>
    consulta.id === consultaId ? { ...consulta, status: novoStatus } : consulta
  );

  const consultaAtualizada = consultas.find((consulta) => consulta.id === consultaId);
  return simularResposta(enriquecerConsulta(consultaAtualizada));
}

export async function getUsuarios() {
  return simularResposta([...usuarios]);
}
