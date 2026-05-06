import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { getAlertasAdmin, getEstagiariosComConsultas, getStatsAdmin } from '../../data/mockApi';
import { colors } from '../../services/theme';

const CARGA_CONFIG = {
  sem_consultas: { label: 'Sem consultas', bg: '#fef9c3', text: '#854d0e' },
  equilibrado: { label: 'Regular', bg: '#d1fae5', text: '#065f46' },
  sobrecarregado: { label: 'Agenda cheia', bg: '#fee2e2', text: '#b91c1c' },
};

function EstagiarioCard({ item, onPress }) {
  const carga = CARGA_CONFIG[item.carga];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardNome}>{item.nome}</Text>
        <Text style={styles.cardConsultas}>
          {item.totalConsultas} consulta{item.totalConsultas !== 1 ? 's' : ''}
        </Text>
      </View>
      <View style={styles.cardRight}>
        <View style={[styles.badge, { backgroundColor: carga.bg }]}>
          <Text style={[styles.badgeText, { color: carga.text }]}>{carga.label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} style={styles.chevron} />
      </View>
    </Pressable>
  );
}

export default function HomeAdmin({ navigation }) {
  const [estagiarios, setEstagiarios] = useState([]);
  const [stats, setStats] = useState({ pendentes: 0, confirmados: 0, totalEstagiarios: 0 });
  const [alertas, setAlertas] = useState({ pendentesHoje: 0, estagiariosSemConsultas: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async () => {
    setRefreshing(true);
    const [dadosEstagiarios, dadosStats, dadosAlertas] = await Promise.all([
      getEstagiariosComConsultas(),
      getStatsAdmin(),
      getAlertasAdmin(),
    ]);
    setEstagiarios(dadosEstagiarios);
    setStats(dadosStats);
    setAlertas(dadosAlertas);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const temAlertas = alertas.pendentesHoje > 0 || alertas.estagiariosSemConsultas > 0;

  const kpis = [
    {
      key: 'pendentes',
      label: 'Pendentes',
      value: stats.pendentes,
      onPress: () => navigation.navigate('Estagiarios'),
    },
    {
      key: 'confirmados',
      label: 'Confirmados',
      value: stats.confirmados,
      onPress: () => navigation.navigate('Estagiarios'),
    },
    {
      key: 'estagiarios',
      label: 'Estagiários',
      value: stats.totalEstagiarios,
      onPress: () => navigation.navigate('Estagiarios'),
    },
  ];

  return (
    <ScreenContainer>
      <FlatList
        data={estagiarios}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarDados} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <EstagiarioCard
            item={item}
            onPress={() =>
              navigation.navigate('AgendaEstagiario', {
                estagiarioId: item.id,
                estagiarioNome: item.nome,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum estagiário cadastrado.</Text>
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Painel Admin</Text>

            {temAlertas && (
              <View style={styles.alertBox}>
                {alertas.pendentesHoje > 0 && (
                  <View style={styles.alertRow}>
                    <Ionicons name="alert-circle" size={16} color="#92400e" />
                    <Text style={styles.alertText}>
                      {alertas.pendentesHoje} consulta{alertas.pendentesHoje > 1 ? 's' : ''} pendente
                      {alertas.pendentesHoje > 1 ? 's' : ''} hoje
                    </Text>
                  </View>
                )}
                {alertas.estagiariosSemConsultas > 0 && (
                  <View style={styles.alertRow}>
                    <Ionicons name="person-remove-outline" size={16} color="#92400e" />
                    <Text style={styles.alertText}>
                      {alertas.estagiariosSemConsultas} estagiário
                      {alertas.estagiariosSemConsultas > 1 ? 's' : ''} sem consultas
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.kpiRow}>
              {kpis.map((kpi) => (
                <Pressable
                  key={kpi.key}
                  style={({ pressed }) => [styles.kpiCard, pressed && styles.kpiCardPressed]}
                  onPress={kpi.onPress}
                >
                  <Text style={styles.kpiValue}>{kpi.value}</Text>
                  <Text style={styles.kpiLabel}>{kpi.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Estagiários</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  alertBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertText: {
    color: '#92400e',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  kpiCardPressed: {
    opacity: 0.8,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  kpiLabel: {
    marginTop: 4,
    fontSize: 11,
    color: colors.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardLeft: {
    flex: 1,
    marginRight: 10,
  },
  cardNome: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  cardConsultas: {
    fontSize: 13,
    color: colors.muted,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 2,
  },
  vazio: {
    marginTop: 24,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
  },
});
