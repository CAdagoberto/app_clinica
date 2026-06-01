import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import SectionTitle from '../../components/SectionTitle';
import ScreenContainer from '../../components/ScreenContainer';
import { getConsultasByUsuario } from '../../data/clinicaApi';
import { colors, typography } from '../../services/theme';
import { themeStyles } from '../../services/themeStyles';

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

function iniciais(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

function PacienteConsultasCard({ item, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.cardTop}>
        <View style={themeStyles.avatarPatient}>
          <Text style={themeStyles.avatarPatientText}>{iniciais(item.pacienteNome)}</Text>
        </View>
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

  const consultasPendentes = consultas.filter((c) => c.status === 'pendente').length;
  const consultasConfirmadas = consultas.filter((c) => c.status === 'confirmado').length;
  const totalPacientes = new Set(consultas.map((c) => c.pacienteId)).size;
  const pacientesComConsultas = useMemo(() => agruparPorPaciente(consultas), [consultas]);

  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Minha Agenda</Text>
      <Text style={themeStyles.sub}>Consultas por paciente — toque para ver o detalhe</Text>

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
          <Text style={[styles.statNumber, { color: colors.accentDark }]}>{totalPacientes}</Text>
          <Text style={styles.statLabel}>Pacientes</Text>
        </View>
      </View>

      <SectionTitle>Meus pacientes</SectionTitle>

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
        ListEmptyComponent={<Text style={themeStyles.empty}>Nenhuma consulta encontrada.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 26,
    fontFamily: typography.fontBold,
    color: colors.text,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: typography.fontBold,
    color: colors.primary,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    fontFamily: typography.fontMedium,
    color: colors.muted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ translateY: -2 }],
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  cardNome: {
    fontSize: 16,
    fontFamily: typography.fontBold,
    color: colors.text,
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.navActiveBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 20,
    fontFamily: typography.fontBold,
    color: colors.primary,
  },
  metricLabel: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: typography.fontRegular,
    color: colors.muted,
  },
});
