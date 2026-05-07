/**
 * Integração REST com o backend em `server/`.
 * Mantém nomes compatíveis com `mockApi.js` para não alterar telas além do import.
 */
import { DATA_REFERENCIA, DURACAO_SESSAO_MINUTOS } from '../config/clinicaConstants';
import { apiGet, apiPatch, apiPost, apiPut } from '../services/clinicaHttp';

export { DATA_REFERENCIA, DURACAO_SESSAO_MINUTOS };

/** Pequeno atraso visual opcional (mock simulava ~280ms); desliga por padrão. */
async function mockDelay(ms) {
  if (process.env.EXPO_PUBLIC_API_SLOW === 'true') {
    await new Promise((r) => setTimeout(r, ms ?? 280));
  }
}

function qs(params) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `?${s}` : '';
}

export async function login(email, senha) {
  await mockDelay();
  return apiPost('/api/auth/login', { email, senha });
}

export async function cadastrarUsuario(novoUsuario, contexto = {}) {
  await mockDelay();
  return apiPost('/api/cadastro', novoUsuario, {
    headers: {
      'X-Ator-Tipo': contexto.atorTipo || '',
      'X-Ator-Id': String(contexto.atorId ?? ''),
    },
  });
}

export async function getEstagiarios(filtroNome = '') {
  await mockDelay();
  return apiGet(`/api/estagiarios${qs({ filtroNome })}`);
}

export async function getPacientes(estagiarioId = null) {
  await mockDelay();
  const q = estagiarioId != null && estagiarioId !== '' ? qs({ estagiarioId }) : '';
  return apiGet(`/api/pacientes${q}`);
}

export async function getPacientesComStatus(estagiarioId = null) {
  await mockDelay();
  const q = estagiarioId != null && estagiarioId !== '' ? qs({ estagiarioId }) : '';
  return apiGet(`/api/pacientes/com-status${q}`);
}

export async function getProntuarioPaciente(pacienteId) {
  await mockDelay();
  return apiGet(`/api/pacientes/${pacienteId}/prontuario`);
}

export async function getConsultasByUsuario(userId) {
  await mockDelay();
  return apiGet(`/api/consultas/usuario/${userId}`);
}

export async function getConsultaById(consultaId) {
  await mockDelay();
  return apiGet(`/api/consultas/${consultaId}`);
}

export async function getConsultasDisponiveis() {
  await mockDelay();
  return apiGet('/api/consultas/disponiveis');
}

export async function fazerCheckIn(consultaId) {
  await mockDelay();
  return apiPatch(`/api/consultas/${consultaId}/check-in`, {});
}

export async function atualizarStatusConsulta(consultaId, novoStatus) {
  await mockDelay();
  return apiPatch(`/api/consultas/${consultaId}/status`, { novoStatus });
}

export async function getRelatorioConsulta(consultaId) {
  await mockDelay();
  return apiGet(`/api/consultas/${consultaId}/relatorio`);
}

export async function salvarRelatorioConsulta({ consultaId, texto, autorId }) {
  await mockDelay();
  return apiPut(`/api/consultas/${consultaId}/relatorio`, { texto, autorId });
}

export async function getNotificacoes(usuarioId) {
  await mockDelay();
  return apiGet(`/api/notificacoes/${usuarioId}`);
}

export async function marcarNotificacaoLida(notificacaoId, usuarioId) {
  await mockDelay();
  return apiPatch(`/api/notificacoes/${notificacaoId}/lida`, { usuarioId });
}

export async function getEncaminhamentosPorPaciente(pacienteId) {
  await mockDelay();
  return apiGet(`/api/encaminhamentos/paciente/${pacienteId}`);
}

export async function getEncaminhamentosDoEstagiario(estagiarioId) {
  await mockDelay();
  return apiGet(`/api/encaminhamentos/estagiario/${estagiarioId}`);
}

export async function getEncaminhamentosTodos() {
  await mockDelay();
  return apiGet('/api/encaminhamentos');
}

export async function criarEncaminhamento(payload) {
  await mockDelay();
  return apiPost('/api/encaminhamentos', payload);
}

export async function getAvaliacoes({ usuarioId, papel }) {
  await mockDelay();
  return apiGet(`/api/avaliacoes${qs({ usuarioId, papel })}`);
}

export async function registrarAvaliacao(payload) {
  await mockDelay();
  return apiPost('/api/avaliacoes', payload);
}

export async function getSalas() {
  await mockDelay();
  return apiGet('/api/salas');
}

export async function getSalasAtendimento() {
  await mockDelay();
  return apiGet('/api/salas/atendimento');
}

export async function atualizarStatusSala(salaId, novoStatus) {
  await mockDelay();
  return apiPatch(`/api/salas/${salaId}/status`, { novoStatus });
}

export async function criarConsulta(payload) {
  await mockDelay();
  return apiPost('/api/consultas', payload);
}

export async function agendarPacoteDeSessoes(payload) {
  await mockDelay();
  return apiPost('/api/consultas/pacote', payload);
}

export async function getUsuarios() {
  await mockDelay();
  return apiGet('/api/usuarios');
}

export async function getConsultasAdmin({ status = null } = {}) {
  await mockDelay();
  const q = status ? qs({ status }) : '';
  return apiGet(`/api/admin/consultas${q}`);
}

export async function getStatsAdmin() {
  await mockDelay();
  return apiGet('/api/admin/stats');
}

export async function getAlertasAdmin() {
  await mockDelay();
  return apiGet('/api/admin/alertas');
}

export async function getEstagiariosComConsultas({ filtroNome = '', filtro = null } = {}) {
  await mockDelay();
  return apiGet(`/api/admin/estagiarios-carga${qs({ filtroNome, filtro })}`);
}

export async function getPresencasEstagiario(estagiarioId) {
  await mockDelay();
  return apiGet(`/api/presencas/${estagiarioId}`);
}

export async function registrarPresencaEstagiario(estagiarioId) {
  await mockDelay();
  return apiPost(`/api/presencas/${estagiarioId}`, {});
}
