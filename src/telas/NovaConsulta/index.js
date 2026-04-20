import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ActionButton from '../../components/ActionButton';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import { criarConsulta, getEstagiarios, getPacientes, getSalas } from '../../data/mockApi';
import { colors } from '../../services/theme';

const hoje = '2026-04-20';

export default function NovaConsulta({ user }) {
  const [pacientes, setPacientes] = useState([]);
  const [estagiarios, setEstagiarios] = useState([]);
  const [salas, setSalas] = useState([]);

  const [pacienteId, setPacienteId] = useState(null);
  const [estagiarioId, setEstagiarioId] = useState(user.tipo === 'estagiario' ? user.id : null);
  const [salaId, setSalaId] = useState(null);
  const [data, setData] = useState(hoje);
  const [horario, setHorario] = useState('10:00');
  const [loading, setLoading] = useState(false);

  const salasDisponiveis = useMemo(() => salas.filter((sala) => sala.status === 'disponivel'), [salas]);
  const pacienteSelecionado = pacientes.find((paciente) => paciente.id === pacienteId) || null;
  const estagiarioSelecionado = estagiarios.find((estagiario) => estagiario.id === estagiarioId) || null;

  const carregarDados = useCallback(async () => {
    const filtroEstagiario = user.tipo === 'estagiario' ? user.id : null;
    const [pacientesData, estagiariosData, salasData] = await Promise.all([
      getPacientes(filtroEstagiario),
      getEstagiarios(),
      getSalas(),
    ]);

    setPacientes(pacientesData);
    setEstagiarios(estagiariosData);
    setSalas(salasData);
  }, [user.id, user.tipo]);

  const selecionarPaciente = useCallback(
    (novoPacienteId) => {
      const paciente = pacientes.find((item) => item.id === novoPacienteId);
      setPacienteId(novoPacienteId);

      if (paciente?.responsavelEstagiarioId) {
        setEstagiarioId(paciente.responsavelEstagiarioId);
      } else if (user.tipo === 'estagiario') {
        setEstagiarioId(user.id);
      } else {
        setEstagiarioId(null);
      }
    },
    [pacientes, user.id, user.tipo]
  );

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  async function handleCriarConsulta() {
    if (!pacienteId || !estagiarioId || !salaId || !data || !horario) {
      Alert.alert('Atenção', 'Preencha todos os dados da consulta.');
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

      Alert.alert('Sucesso', 'Consulta criada com sucesso.');
      setPacienteId(null);
      setSalaId(null);
      setData(hoje);
      setHorario('10:00');
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
          <Text style={styles.title}>Nova Consulta</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Paciente:</Text>
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
              <Text style={styles.helperText}>Nenhum paciente disponível para este estagiário.</Text>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Estagiário responsável:</Text>
            <Text style={styles.readOnlyText}>
              {estagiarioSelecionado?.nome || 'Selecione um paciente para ver o responsável'}
            </Text>
            {pacienteSelecionado ? (
              <Text style={styles.helperText}>
                Cada paciente possui vínculo exclusivo com um estagiário.
              </Text>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Sala disponível:</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={salaId ?? ''} onValueChange={(itemValue) => setSalaId(itemValue || null)}>
                <Picker.Item label="Selecione uma sala" value="" />
                {salasDisponiveis.map((sala) => (
                  <Picker.Item key={sala.id} label={`${sala.nome} (${sala.status})`} value={sala.id} />
                ))}
              </Picker>
            </View>
            {salasDisponiveis.length === 0 ? (
              <Text style={styles.helperText}>Não há salas disponíveis no momento.</Text>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Data (YYYY-MM-DD):</Text>
            <TextInput value={data} onChangeText={setData} style={styles.input} />

            <Text style={[styles.label, styles.marginTop]}>Horário (HH:MM):</Text>
            <TextInput value={horario} onChangeText={setHorario} style={styles.input} />
          </View>

          <ActionButton
            title={loading ? 'Criando...' : 'Criar Consulta'}
            onPress={handleCriarConsulta}
            disabled={loading}
          />
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
    marginBottom: 12,
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
  optionButton: {
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
