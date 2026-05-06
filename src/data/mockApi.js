/** Referência de "hoje" e datas no mock (alinhado ao fluxo da clínica). */
export const DATA_REFERENCIA = '2026-04-20';

export const DURACAO_SESSAO_MINUTOS = 50;

const statusSalaValidos = ['disponivel', 'ocupada', 'em reforma'];

/** §1 — 6 salas de atendimento + recepção + sala de descanso. Consultórios 1 e 2 com restrição de horário. */
let salas = [
  { id: 1, nome: 'Consultório 1', status: 'disponivel', tipo: 'atendimento', restricaoConsultorio: true },
  { id: 2, nome: 'Consultório 2', status: 'disponivel', tipo: 'atendimento', restricaoConsultorio: true },
  { id: 3, nome: 'Consultório 3', status: 'disponivel', tipo: 'atendimento', restricaoConsultorio: false },
  { id: 4, nome: 'Consultório 4', status: 'disponivel', tipo: 'atendimento', restricaoConsultorio: false },
  { id: 5, nome: 'Consultório 5', status: 'ocupada', tipo: 'atendimento', restricaoConsultorio: false },
  { id: 6, nome: 'Consultório 6', status: 'disponivel', tipo: 'atendimento', restricaoConsultorio: false },
  { id: 7, nome: 'Recepção', status: 'disponivel', tipo: 'recepcao', restricaoConsultorio: false },
  { id: 8, nome: 'Sala de descanso', status: 'disponivel', tipo: 'descanso', restricaoConsultorio: false },
];

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
    nome: 'Bruno Estagiário',
    email: 'estagiario@clinica.com',
    senha: '123456',
    tipo: 'estagiario',
    matricula: '2024001',
    nivelEstagio: 2,
    ativo: true,
  },
  {
    id: 3,
    nome: 'Carla Paciente',
    email: 'paciente@clinica.com',
    senha: '123456',
    tipo: 'paciente',
    responsavelEstagiarioId: 2,
    telefone: '(11) 98888-0001',
    regiao: 'Zona Sul',
    prontuario: 'PRT-2026-0003',
    menorDeIdade: false,
    responsavelLegalNome: '',
    responsavelLegalTelefone: '',
  },
  {
    id: 4,
    nome: 'Diego Paciente',
    email: 'diego@clinica.com',
    senha: '123456',
    tipo: 'paciente',
    responsavelEstagiarioId: 2,
    telefone: '(11) 97777-0002',
    regiao: 'Zona Leste',
    prontuario: 'PRT-2026-0004',
    menorDeIdade: false,
    responsavelLegalNome: '',
    responsavelLegalTelefone: '',
  },
  {
    id: 5,
    nome: 'Elisa Paciente',
    email: 'elisa@clinica.com',
    senha: '123456',
    tipo: 'paciente',
    responsavelEstagiarioId: 2,
    telefone: '(11) 96666-0003',
    regiao: 'Centro',
    prontuario: 'PRT-2026-0005',
    menorDeIdade: true,
    responsavelLegalNome: 'Fernanda Souza',
    responsavelLegalTelefone: '(11) 95555-0000',
  },
];

let consultas = [
  {
    id: 1,
    pacienteId: 3,
    estagiarioId: 2,
    salaId: 3,
    data: DATA_REFERENCIA,
    horario: '09:00',
    status: 'pendente',
    pacoteId: 501,
    sessaoNumero: 1,
    duracaoMinutos: DURACAO_SESSAO_MINUTOS,
  },
  {
    id: 2,
    pacienteId: 4,
    estagiarioId: 2,
    salaId: 4,
    data: DATA_REFERENCIA,
    horario: '11:00',
    status: 'confirmado',
    pacoteId: 502,
    sessaoNumero: 3,
    duracaoMinutos: DURACAO_SESSAO_MINUTOS,
  },
  {
    id: 3,
    pacienteId: 5,
    estagiarioId: 2,
    salaId: 5,
    data: DATA_REFERENCIA,
    horario: '14:00',
    status: 'cancelado',
    pacoteId: null,
    sessaoNumero: null,
    duracaoMinutos: DURACAO_SESSAO_MINUTOS,
  },
];

let statusPacientes = [
  { pacienteId: 3, status: 'aguardando atendimento' },
  { pacienteId: 4, status: 'sessão confirmada' },
  { pacienteId: 5, status: 'cancelado' },
];

/** Relatório de atendimento por sessão (§3, §6 estagiário). */
let relatorioPorConsultaId = {};

let notificacoes = [
  {
    id: 1,
    usuarioId: 3,
    titulo: 'Lembrete de consulta',
    corpo: `Sua próxima sessão está agendada para ${DATA_REFERENCIA} às 09:00.`,
    criadaEm: DATA_REFERENCIA,
    lida: false,
  },
];

let encaminhamentos = [];

let avaliacoes = [];

function simularResposta(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 280);
  });
}

function getProximoId(lista) {
  if (!lista.length) return 1;
  return Math.max(...lista.map((item) => item.id)) + 1;
}

function getProximoIdNotificacoes() {
  if (!notificacoes.length) return 1;
  return Math.max(...notificacoes.map((n) => n.id)) + 1;
}

function parseYmd(dataStr) {
  const [y, m, d] = dataStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatYmd(date) {
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function addSemanasYmd(dataStr, semanas) {
  const dt = parseYmd(dataStr);
  dt.setDate(dt.getDate() + semanas * 7);
  return formatYmd(dt);
}

/** 0=dom … 6=sáb */
function diaSemana(dataStr) {
  return parseYmd(dataStr).getDay();
}

function horaMinutos(horario) {
  const [h, m = 0] = horario.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Consultórios 1 e 2: terça 13–16h, quarta e sexta 13–18h (§1).
 */
function validarHorarioConsultorioRestrito(sala, dataStr, horario) {
  if (!sala?.restricaoConsultorio) return null;
  const dow = diaSemana(dataStr);
  const minutos = horaMinutos(horario);

  if (dow !== 2 && dow !== 3 && dow !== 5) {
    return 'Consultórios 1 e 2: agendamento apenas às terças, quartas ou sextas-feiras.';
  }

  if (dow === 2) {
    if (minutos < 13 * 60 || minutos >= 16 * 60) {
      return 'Consultórios 1 e 2: às terças-feiras, horário permitido das 13h às 16h.';
    }
  }
  if (dow === 3 || dow === 5) {
    if (minutos < 13 * 60 || minutos >= 18 * 60) {
      return 'Consultórios 1 e 2: às quartas e sextas-feiras, horário permitido das 13h às 18h.';
    }
  }
  return null;
}

function maxPacientesPorNivel(nivel) {
  if (nivel === 1) return 2;
  return 3;
}

function contarPacientesVinculados(estagiarioId) {
  return usuarios.filter(
    (u) => u.tipo === 'paciente' && u.responsavelEstagiarioId === Number(estagiarioId)
  ).length;
}

function statusPacientePorConsultaStatus(statusConsulta) {
  if (statusConsulta === 'confirmado') return 'sessão confirmada';
  if (statusConsulta === 'cancelado') return 'cancelado';
  return 'aguardando atendimento';
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

function notificarPaciente(pacienteId, titulo, corpo) {
  notificacoes.unshift({
    id: getProximoIdNotificacoes(),
    usuarioId: Number(pacienteId),
    titulo,
    corpo,
    criadaEm: DATA_REFERENCIA,
    lida: false,
  });
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

  if (tipoNovoUsuario === 'paciente') {
    const est = usuarios.find((u) => u.id === responsavelPacienteId && u.tipo === 'estagiario');
    if (est) {
      const limite = maxPacientesPorNivel(est.nivelEstagio || 1);
      const atual = contarPacientesVinculados(est.id);
      if (atual >= limite) {
        throw new Error(
          `Este estagiário já atingiu o limite de pacientes para o estágio ${est.nivelEstagio || 1} (máx. ${limite}).`
        );
      }
    }
  }

  if (tipoNovoUsuario === 'paciente') {
    if (!novoUsuario.telefone?.trim()) throw new Error('Telefone do paciente é obrigatório.');
    if (!novoUsuario.regiao?.trim()) throw new Error('Região / localização do paciente é obrigatória.');
    if (!novoUsuario.prontuario?.trim()) throw new Error('Número de prontuário é obrigatório.');
    const menor = Boolean(novoUsuario.menorDeIdade);
    if (menor) {
      if (!novoUsuario.responsavelLegalNome?.trim() || !novoUsuario.responsavelLegalTelefone?.trim()) {
        throw new Error('Paciente menor de idade: cadastre nome e telefone do responsável legal.');
      }
    }
  }

  if (tipoNovoUsuario === 'estagiario') {
    if (!novoUsuario.matricula?.trim()) throw new Error('Matrícula do estagiário é obrigatória.');
    if (![1, 2, 3].includes(Number(novoUsuario.nivelEstagio))) {
      throw new Error('Informe o estágio atual (1, 2 ou 3).');
    }
  }

  const usuarioCriado = {
    id: usuarios.length + 1,
    nome: novoUsuario.nome,
    email: novoUsuario.email.toLowerCase().trim(),
    senha: novoUsuario.senha,
    tipo: tipoNovoUsuario,
    responsavelEstagiarioId: responsavelPacienteId,
    telefone: novoUsuario.telefone?.trim() || '',
    regiao: novoUsuario.regiao?.trim() || '',
    prontuario: novoUsuario.prontuario?.trim() || '',
    menorDeIdade: Boolean(novoUsuario.menorDeIdade),
    responsavelLegalNome: novoUsuario.responsavelLegalNome?.trim() || '',
    responsavelLegalTelefone: novoUsuario.responsavelLegalTelefone?.trim() || '',
    matricula: novoUsuario.matricula?.trim() || '',
    nivelEstagio: tipoNovoUsuario === 'estagiario' ? Number(novoUsuario.nivelEstagio) : undefined,
    ativo: tipoNovoUsuario === 'estagiario' ? novoUsuario.ativo !== false : undefined,
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
      statusPaciente: statusAtual?.status || 'aguardando atendimento',
      estagiarioResponsavelNome: responsavel?.nome || 'Sem responsável',
    };
  });

  return simularResposta(resultado);
}

export async function getProntuarioPaciente(pacienteId) {
  const paciente = usuarios.find((u) => u.id === Number(pacienteId) && u.tipo === 'paciente');
  if (!paciente) throw new Error('Paciente não encontrado.');

  const est = usuarios.find((u) => u.id === paciente.responsavelEstagiarioId && u.tipo === 'estagiario');
  const historico = consultas
    .filter((c) => c.pacienteId === paciente.id)
    .map(enriquecerConsulta)
    .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));

  const encs = encaminhamentos.filter((e) => e.pacienteId === paciente.id);

  return simularResposta({
    paciente,
    profissionalResponsavel: est ? { nome: est.nome, matricula: est.matricula } : null,
    historicoConsultas: historico,
    encaminhamentos: encs,
  });
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
    .filter((consulta) => consulta.data === DATA_REFERENCIA && consulta.status === 'pendente')
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
    notificarPaciente(
      consultaAtualizada.pacienteId,
      'Presença confirmada',
      'Sua consulta foi registrada na recepção.'
    );
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
    if (novoStatus === 'cancelado') {
      notificarPaciente(consultaAtualizada.pacienteId, 'Consulta cancelada', 'Sua consulta foi cancelada no sistema.');
    }
    if (novoStatus === 'confirmado') {
      notificarPaciente(consultaAtualizada.pacienteId, 'Consulta confirmada', 'Sua consulta foi confirmada.');
    }
  }
  return simularResposta(enriquecerConsulta(consultaAtualizada));
}

export async function getRelatorioConsulta(consultaId) {
  const texto = relatorioPorConsultaId[Number(consultaId)] || '';
  return simularResposta({ texto });
}

export async function salvarRelatorioConsulta({ consultaId, texto, autorId }) {
  const c = consultas.find((x) => x.id === Number(consultaId));
  if (!c) throw new Error('Consulta não encontrada.');
  const limpo = texto?.trim() || '';
  if (!limpo) throw new Error('Informe o relatório de atendimento.');
  relatorioPorConsultaId[Number(consultaId)] = limpo;
  return simularResposta({ consultaId: Number(consultaId), texto: limpo, autorId });
}

export async function getNotificacoes(usuarioId) {
  const lista = notificacoes.filter((n) => n.usuarioId === Number(usuarioId));
  return simularResposta(lista);
}

export async function marcarNotificacaoLida(notificacaoId, usuarioId) {
  notificacoes = notificacoes.map((n) =>
    n.id === Number(notificacaoId) && n.usuarioId === Number(usuarioId) ? { ...n, lida: true } : n
  );
  return simularResposta(true);
}

export async function getEncaminhamentosPorPaciente(pacienteId) {
  return simularResposta(encaminhamentos.filter((e) => e.pacienteId === Number(pacienteId)));
}

export async function getEncaminhamentosDoEstagiario(estagiarioId) {
  const idsPacientes = usuarios
    .filter((u) => u.tipo === 'paciente' && u.responsavelEstagiarioId === Number(estagiarioId))
    .map((u) => u.id);
  return simularResposta(encaminhamentos.filter((e) => idsPacientes.includes(e.pacienteId)));
}

export async function getEncaminhamentosTodos() {
  return simularResposta([...encaminhamentos]);
}

export async function criarEncaminhamento({ pacienteId, tipo, destino, observacao, criadoPorId }) {
  if (!['interno', 'externo'].includes(tipo)) throw new Error('Tipo de encaminhamento inválido.');
  if (!destino?.trim()) throw new Error('Informe o destino do encaminhamento.');
  const item = {
    id: getProximoId(encaminhamentos),
    pacienteId: Number(pacienteId),
    tipo,
    destino: destino.trim(),
    observacao: observacao?.trim() || '',
    criadoPorId: Number(criadoPorId),
    criadoEm: DATA_REFERENCIA,
  };
  encaminhamentos = [item, ...encaminhamentos];
  return simularResposta(item);
}

export async function getAvaliacoes({ usuarioId, papel }) {
  const filtradas = avaliacoes.filter((a) => {
    if (papel === 'admin') return true;
    if (papel === 'estagiario') return a.estagiarioId === usuarioId;
    if (papel === 'paciente') return a.autorId === usuarioId;
    return false;
  });
  return simularResposta(filtradas);
}

export async function registrarAvaliacao({ tipo, nota, comentario, autorId, estagiarioId }) {
  if (nota < 1 || nota > 5) throw new Error('A nota deve ser de 1 a 5.');
  const item = {
    id: getProximoId(avaliacoes),
    tipo,
    nota,
    comentario: comentario?.trim() || '',
    autorId: Number(autorId),
    estagiarioId: estagiarioId ? Number(estagiarioId) : null,
    criadaEm: DATA_REFERENCIA,
  };
  avaliacoes = [item, ...avaliacoes];
  return simularResposta(item);
}

export async function getSalas() {
  return simularResposta([...salas]);
}

/** Apenas ambientes de atendimento (para agendar sessões). */
export async function getSalasAtendimento() {
  return simularResposta(salas.filter((s) => s.tipo === 'atendimento'));
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

  const sala = salas.find((s) => s.id === Number(salaId));
  if (!sala || sala.tipo !== 'atendimento') {
    throw new Error('Selecione um consultório de atendimento válido.');
  }

  const dataLimpa = data?.trim() || DATA_REFERENCIA;
  const horarioLimpo = horario?.trim() || '08:00';
  const errRestrito = validarHorarioConsultorioRestrito(sala, dataLimpa, horarioLimpo);
  if (errRestrito) throw new Error(errRestrito);

  const novaConsulta = {
    id: getProximoId(consultas),
    pacienteId: Number(pacienteId),
    estagiarioId: responsavelEstagiarioId,
    salaId: Number(salaId),
    data: dataLimpa,
    horario: horarioLimpo,
    status,
    pacoteId: null,
    sessaoNumero: null,
    duracaoMinutos: DURACAO_SESSAO_MINUTOS,
  };

  consultas = [novaConsulta, ...consultas];
  atualizarStatusPaciente(novaConsulta.pacienteId, novaConsulta.status);
  notificarPaciente(novaConsulta.pacienteId, 'Nova consulta', `Consulta agendada para ${dataLimpa} às ${horarioLimpo}.`);
  return simularResposta(enriquecerConsulta(novaConsulta));
}

/** §2 — Pacote de 10 sessões semanais (mesmo dia da semana e horário). Duração padrão 50 min. */
export async function agendarPacoteDeSessoes({ pacienteId, estagiarioId, salaId, dataPrimeiraSessao, horario }) {
  const paciente = usuarios.find((u) => u.id === Number(pacienteId) && u.tipo === 'paciente');
  if (!paciente) throw new Error('Paciente não encontrado.');

  const respId = getResponsavelPacienteId(pacienteId);
  if (Number(estagiarioId) !== respId) {
    throw new Error('O paciente só pode ser agendado com o estagiário responsável.');
  }

  const sala = salas.find((s) => s.id === Number(salaId));
  if (!sala || sala.tipo !== 'atendimento') throw new Error('Selecione um consultório de atendimento válido.');

  const dataIni = dataPrimeiraSessao?.trim();
  const horaIni = horario?.trim();
  if (!dataIni || !horaIni) throw new Error('Informe a data da primeira sessão e o horário.');

  const err0 = validarHorarioConsultorioRestrito(sala, dataIni, horaIni);
  if (err0) throw new Error(err0);

  const pacoteId = getProximoId(consultas) + 10000;
  const criadas = [];

  for (let i = 0; i < 10; i++) {
    const dataSessao = i === 0 ? dataIni : addSemanasYmd(dataIni, i);
    const err = validarHorarioConsultorioRestrito(sala, dataSessao, horaIni);
    if (err) {
      throw new Error(`Sessão ${i + 1} (${dataSessao}): ${err}`);
    }

    const nova = {
      id: getProximoId(consultas),
      pacienteId: Number(pacienteId),
      estagiarioId: respId,
      salaId: Number(salaId),
      data: dataSessao,
      horario: horaIni,
      status: 'pendente',
      pacoteId,
      sessaoNumero: i + 1,
      duracaoMinutos: DURACAO_SESSAO_MINUTOS,
    };
    consultas = [nova, ...consultas];
    criadas.push(nova);
    atualizarStatusPaciente(nova.pacienteId, nova.status);
  }

  notificarPaciente(
    pacienteId,
    'Pacote de sessões agendado',
    `Foram criadas 10 sessões consecutivas (${horaIni}, ${DURACAO_SESSAO_MINUTOS} min cada), mantendo o mesmo dia da semana.`
  );

  return simularResposta(criadas.map(enriquecerConsulta));
}

export async function getUsuarios() {
  return simularResposta([...usuarios]);
}

export async function getConsultasAdmin({ status = null } = {}) {
  let resultado = consultas.map(enriquecerConsulta);
  if (status) {
    resultado = resultado.filter((c) => c.status === status);
  }
  return simularResposta(resultado);
}

export async function getStatsAdmin() {
  const pendentes = consultas.filter((c) => c.status === 'pendente').length;
  const confirmados = consultas.filter((c) => c.status === 'confirmado').length;
  const totalEstagiarios = usuarios.filter((u) => u.tipo === 'estagiario').length;
  return simularResposta({ pendentes, confirmados, totalEstagiarios });
}

export async function getAlertasAdmin() {
  const pendentesHoje = consultas.filter((c) => c.data === DATA_REFERENCIA && c.status === 'pendente').length;
  const estagiariosSemConsultas = usuarios.filter(
    (u) => u.tipo === 'estagiario' && !consultas.some((c) => c.estagiarioId === u.id)
  ).length;
  return simularResposta({ pendentesHoje, estagiariosSemConsultas });
}

export async function getEstagiariosComConsultas({ filtroNome = '', filtro = null } = {}) {
  const nomeLimpo = filtroNome.trim().toLowerCase();
  const estagiarios = usuarios.filter(
    (u) => u.tipo === 'estagiario' && u.nome.toLowerCase().includes(nomeLimpo)
  );

  const resultado = estagiarios.map((est) => {
    const totalConsultas = consultas.filter((c) => c.estagiarioId === est.id).length;
    const totalPacientes = contarPacientesVinculados(est.id);
    const limite = maxPacientesPorNivel(est.nivelEstagio || 1);
    let carga;
    if (totalConsultas === 0) carga = 'sem_consultas';
    else if (totalConsultas <= 3) carga = 'equilibrado';
    else carga = 'sobrecarregado';
    return { ...est, totalConsultas, totalPacientes, limitePacientes: limite, carga };
  });

  let filtrados = resultado;
  if (filtro === 'sem_consultas') {
    filtrados = resultado.filter((e) => e.totalConsultas === 0);
  } else if (filtro === 'com_consultas') {
    filtrados = resultado.filter((e) => e.totalConsultas > 0);
  }

  filtrados.sort((a, b) => {
    const ordem = { sem_consultas: 0, equilibrado: 1, sobrecarregado: 2 };
    return ordem[a.carga] - ordem[b.carga];
  });

  return simularResposta(filtrados);
}

/** Registro simples de presença do estagiário na clínica (§4 / §6). */
const presencasEstagiario = [];

export async function getPresencasEstagiario(estagiarioId) {
  const lista = presencasEstagiario.filter((p) => p.estagiarioId === Number(estagiarioId));
  return simularResposta(lista);
}

export async function registrarPresencaEstagiario(estagiarioId) {
  const item = {
    id: getProximoId(presencasEstagiario),
    estagiarioId: Number(estagiarioId),
    data: DATA_REFERENCIA,
    horarioChegada: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
  presencasEstagiario.unshift(item);
  return simularResposta(item);
}
