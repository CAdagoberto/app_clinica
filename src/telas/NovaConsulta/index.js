import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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

  const carregarDados = useCallback(async () => {
    const [pacientesData, estagiariosData, salasData] = await Promise.all([
      getPacientes(),
      getEstagiarios(),
      getSalas(),
    ]);

    setPacientes(pacientesData);
    setEstagiarios(estagiariosData);
    setSalas(salasData);
  }, []);

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
            {pacientes.map((paciente) => (
              <View key={paciente.id} style={styles.optionButton}>
                <ActionButton
                  title={paciente.nome}
                  variant={pacienteId === paciente.id ? 'primary' : 'secondary'}
                  onPress={() => setPacienteId(paciente.id)}
                />
              </View>
            ))}
          </View>

          {user.tipo === 'admin' && (
            <View style={styles.card}>
              <Text style={styles.label}>Estagiário:</Text>
              {estagiarios.map((estagiario) => (
                <View key={estagiario.id} style={styles.optionButton}>
                  <ActionButton
                    title={estagiario.nome}
                    variant={estagiarioId === estagiario.id ? 'primary' : 'secondary'}
                    onPress={() => setEstagiarioId(estagiario.id)}
                  />
                </View>
              ))}
            </View>
          )}

          {user.tipo === 'estagiario' && (
            <View style={styles.card}>
              <Text style={styles.label}>Estagiário responsável:</Text>
              <Text style={styles.readOnlyText}>{user.nome}</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.label}>Sala disponível:</Text>
            {salasDisponiveis.map((sala) => (
              <View key={sala.id} style={styles.optionButton}>
                <ActionButton
                  title={sala.nome}
                  variant={salaId === sala.id ? 'primary' : 'secondary'}
                  onPress={() => setSalaId(sala.id)}
                />
              </View>
            ))}
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
});
