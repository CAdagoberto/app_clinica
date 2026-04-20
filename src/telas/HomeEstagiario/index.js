import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import ConsultaCard from '../../components/ConsultaCard';
import { getConsultasByUsuario } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function HomeEstagiario({ user }) {
  const [consultas, setConsultas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarConsultas = useCallback(async () => {
    setRefreshing(true);
    const dados = await getConsultasByUsuario(user.id);
    setConsultas(dados);
    setRefreshing(false);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [carregarConsultas])
  );

  const examesPendentes = consultas.filter((consulta) => consulta.status === 'pendente').length;
  const examesConfirmados = consultas.filter((consulta) => consulta.status === 'confirmado').length;
  const totalPacientes = new Set(consultas.map((consulta) => consulta.pacienteId)).size;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Consultas de Hoje</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{examesPendentes}</Text>
          <Text style={styles.statLabel}>Exames pendentes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{examesConfirmados}</Text>
          <Text style={styles.statLabel}>Exames confirmados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalPacientes}</Text>
          <Text style={styles.statLabel}>Pacientes</Text>
        </View>
      </View>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarConsultas} />}
        renderItem={({ item }) => (
          <ConsultaCard consulta={item}>
            <View style={styles.row}>
              <Text style={styles.detail}>Paciente: {item.pacienteNome}</Text>
              <Text style={styles.detail}>Horário: {item.horario}</Text>
            </View>
          </ConsultaCard>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma consulta encontrada.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    width: '31.5%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  row: {
    marginTop: 8,
  },
  detail: {
    color: colors.text,
  },
  empty: {
    color: colors.muted,
    marginTop: 20,
    textAlign: 'center',
  },
});
