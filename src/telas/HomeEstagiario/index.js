import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import { getConsultasByUsuario } from '../../data/clinicaApi';
import { colors } from '../../services/theme';

function agruparPorPaciente(consultas) {
  const mapa = new Map();
  consultas.forEach((consulta) => {
    if (!mapa.has(consulta.pacienteId)) {
      mapa.set(consulta.pacienteId, {
        pacienteId: consulta.pacienteId,
        pacienteNome: consulta.pacienteNome || 'Paciente',
        total: 0,
        pendentes: 0,
        confirmadas: 0,
      });
    }
    const item = mapa.get(consulta.pacienteId);
    item.total += 1;
    if (consulta.status === 'pendente') item.pendentes += 1;
    if (consulta.status === 'confirmado') item.confirmadas += 1;
  });

  return [...mapa.values()]
    .map((item) => ({
      ...item,
      restantes: Math.max(item.total - item.confirmadas, 0),
    }))
    .sort((a, b) => a.pacienteNome.localeCompare(b.pacienteNome, 'pt-BR'));
}

function PacienteConsultasCard({ item, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.cardTop}>
        <Text style={styles.cardNome}>{item.pacienteNome}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricNumber}>{item.restantes}</Text>
          <Text style={styles.metricLabel}>Restantes</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricNumber}>{item.pendentes}</Text>
          <Text style={styles.metricLabel}>Pendentes</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricNumber}>{item.confirmadas}</Text>
          <Text style={styles.metricLabel}>Confirmadas</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeEstagiario({ user, navigation }) {
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

  const consultasPendentes = consultas.filter((consulta) => consulta.status === 'pendente').length;
  const consultasConfirmadas = consultas.filter((consulta) => consulta.status === 'confirmado').length;
  const totalPacientes = new Set(consultas.map((consulta) => consulta.pacienteId)).size;
  const pacientesComConsultas = useMemo(() => agruparPorPaciente(consultas), [consultas]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Consultas por paciente</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{consultasPendentes}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{consultasConfirmadas}</Text>
          <Text style={styles.statLabel}>Confirmadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalPacientes}</Text>
          <Text style={styles.statLabel}>Pacientes</Text>
        </View>
      </View>

      <FlatList
        data={pacientesComConsultas}
        keyExtractor={(item) => String(item.pacienteId)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarConsultas} />}
        renderItem={({ item }) => (
          <PacienteConsultasCard
            item={item}
            onPress={() =>
              navigation.navigate('ConsultasPacienteEstagiario', {
                pacienteId: item.pacienteId,
                pacienteNome: item.pacienteNome,
                estagiarioId: user.id,
              })
            }
          />
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
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.88,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
    marginRight: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  metricLabel: {
    marginTop: 2,
    fontSize: 11,
    color: colors.muted,
  },
  empty: {
    color: colors.muted,
    marginTop: 20,
    textAlign: 'center',
  },
});
