import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ActionButton from '../../components/ActionButton';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import {
  agendarPacoteDeSessoes,
  criarConsulta,
  DATA_REFERENCIA,
  DURACAO_SESSAO_MINUTOS,
  getEstagiarios,
  getPacientes,
  getSalasAtendimento,
} from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function NovaConsulta({ user }) {
  const [pacientes, setPacientes] = useState([]);
  const [estagiarios, setEstagiarios] = useState([]);
  const [salas, setSalas] = useState([]);

  const [modo, setModo] = useState('pacote');
  const [pacienteId, setPacienteId] = useState(null);
  const [estagiarioId, setEstagiarioId] = useState(user.tipo === 'estagiario' ? user.id : null);
  const [salaId, setSalaId] = useState(null);
  const [data, setData] = useState(DATA_REFERENCIA);
  const [horario, setHorario] = useState('14:00');
  const [loading, setLoading] = useState(false);

  const salasDisponiveis = useMemo(() => salas.filter((sala) => sala.status === 'disponivel'), [salas]);
  const pacienteSelecionado = pacientes.find((p) => p.id === pacienteId) || null;
  const carregarDados = useCallback(async () => {
    const filtroEstagiario = user.tipo === 'estagiario' ? user.id : null;
    const [pacientesData, salasData, estData] = await Promise.all([
      getPacientes(filtroEstagiario),
      getSalasAtendimento(),
      getEstagiarios(),
    ]);

    setPacientes(pacientesData);
    setSalas(salasData);
    setEstagiarios(estData);
  }, [user.id, user.tipo]);

  const estagiarioSelecionado = estagiarios.find((e) => e.id === estagiarioId) || null;

  const selecionarPaciente = useCallback(
    (novoPacienteId) => {
      const paciente = pacientes.find((item) => item.id === novoPacienteId);
      setPacienteId(novoPacienteId);

      if (paciente?.responsavelEstagiarioId) {
        setEstagiarioId(paciente.responsavelEstagiarioId);
      } else if (user.tipo === 'estagiario') {
        setEstagiarioId(user.id);
      } else {
        setEstagiarioId(paciente?.responsavelEstagiarioId || null);
      }
    },
    [pacientes, user.id, user.tipo]
  );

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  async function handleAgendarPacote() {
    if (!pacienteId || !estagiarioId || !salaId || !data || !horario) {
      Alert.alert('Atenção', 'Preencha paciente, consultório, data da 1ª sessão e horário.');
      return;
    }

    try {
      setLoading(true);
      const criadas = await agendarPacoteDeSessoes({
        pacienteId,
        estagiarioId,
        salaId,
        dataPrimeiraSessao: data,
        horario,
      });
      Alert.alert(
        'Pacote agendado',
        `Foram criadas ${criadas.length} sessões de ${DURACAO_SESSAO_MINUTOS} min, semanalmente no mesmo dia e horário.`
      );
      setPacienteId(null);
      setSalaId(null);
      setData(DATA_REFERENCIA);
      setHorario('14:00');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSessaoExtra() {
    if (!pacienteId || !estagiarioId || !salaId || !data || !horario) {
      Alert.alert('Atenção', 'Preencha todos os dados.');
      return;
    }

    try {
      setLoading(true);
      await criarConsulta({
        pacienteId,
        estagiarioId,
        salaId,
        data,
        horario,
        status: 'pendente',
      });
      Alert.alert('Sucesso', 'Sessão extraordinária registrada.');
      setSalaId(null);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <FadeInView style={styles.wrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Agendamento</Text>
          <Text style={styles.escopo}>
            Modelo da clínica: 10 sessões consecutivas, mesmo estagiário, mesmo dia da semana e horário, com duração
            padrão de {DURACAO_SESSAO_MINUTOS} minutos por sessão.
          </Text>

          <View style={styles.tabRow}>
            {[
              { key: 'pacote', label: 'Pacote (10 sessões)' },
              { key: 'extra', label: 'Sessão extraordinária' },
            ].map((t) => (
              <Pressable
                key={t.key}
                style={[styles.tab, modo === t.key && styles.tabAtiva]}
                onPress={() => setModo(t.key)}
              >
                <Text style={[styles.tabText, modo === t.key && styles.tabTextAtiva]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Paciente</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={pacienteId ?? ''}
                onValueChange={(itemValue) => selecionarPaciente(itemValue || null)}
              >
                <Picker.Item label="Selecione um paciente" value="" />
                {pacientes.map((paciente) => (
                  <Picker.Item key={paciente.id} label={paciente.nome} value={paciente.id} />
                ))}
              </Picker>
            </View>
            {pacientes.length === 0 ? (
              <Text style={styles.helperText}>Nenhum paciente vinculado a este perfil.</Text>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Estagiário responsável</Text>
            <Text style={styles.readOnlyText}>
              {pacienteSelecionado
                ? estagiarioSelecionado?.nome || 'Carregando...'
                : 'Selecione um paciente para ver o responsável'}
            </Text>
            <Text style={styles.helperText}>
              O agendamento respeita o estagiário vinculado ao paciente no cadastro (§9 do regulamento interno).
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Consultório (atendimento)</Text>
            <Text style={styles.helperText}>
              Consultórios 1 e 2: terça 13h–16h; quarta e sexta 13h–18h (conforme regulamento da clínica).
            </Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={salaId ?? ''} onValueChange={(itemValue) => setSalaId(itemValue || null)}>
                <Picker.Item label="Selecione um consultório" value="" />
                {salasDisponiveis.map((sala) => (
                  <Picker.Item
                    key={sala.id}
                    label={`${sala.nome}${sala.restricaoConsultorio ? ' (horário restrito)' : ''}`}
                    value={sala.id}
                  />
                ))}
              </Picker>
            </View>
            {salasDisponiveis.length === 0 ? (
              <Text style={styles.helperText}>Não há consultórios disponíveis no momento.</Text>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{modo === 'pacote' ? 'Data da 1ª sessão (AAAA-MM-DD)' : 'Data (AAAA-MM-DD)'}</Text>
            <TextInput value={data} onChangeText={setData} style={styles.input} placeholderTextColor={colors.muted} />

            <Text style={[styles.label, styles.marginTop]}>Horário (HH:MM)</Text>
            <TextInput value={horario} onChangeText={setHorario} style={styles.input} placeholderTextColor={colors.muted} />
          </View>

          {modo === 'pacote' ? (
            <ActionButton
              title={loading ? 'Agendando...' : 'Gerar 10 sessões semanais'}
              onPress={handleAgendarPacote}
              disabled={loading}
            />
          ) : (
            <ActionButton
              title={loading ? 'Salvando...' : 'Registrar sessão extraordinária'}
              onPress={handleSessaoExtra}
              disabled={loading}
            />
          )}
        </ScrollView>
      </FadeInView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  escopo: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 12,
    lineHeight: 18,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabAtiva: {
    backgroundColor: '#fff',
    elevation: 1,
  },
  tabText: {
    fontWeight: '600',
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  tabTextAtiva: {
    color: colors.primary,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 10,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  marginTop: {
    marginTop: 10,
  },
  readOnlyText: {
    color: colors.primary,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.muted,
  },
});
