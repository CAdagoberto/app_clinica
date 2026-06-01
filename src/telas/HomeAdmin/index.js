import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SectionTitle from '../../components/SectionTitle';
import ScreenContainer from '../../components/ScreenContainer';
import { getAlertasAdmin, getEstagiariosComConsultas, getStatsAdmin } from '../../data/clinicaApi';
import { colors, typography } from '../../services/theme';
import { themeStyles } from '../../services/themeStyles';

const CARGA_CONFIG = {
  sem_consultas: { label: 'Sem consultas', bg: colors.warningBg, text: colors.warningText },
  equilibrado: { label: 'Regular', bg: colors.successBg, text: colors.successText },
  sobrecarregado: { label: 'Agenda cheia', bg: colors.dangerBg, text: colors.dangerText },
};

const KPI_STYLES = [
  { icon: 'time-outline', bg: colors.admin.kpiBlueBg, color: colors.admin.kpiBlueText },
  { icon: 'checkmark-circle-outline', bg: colors.admin.kpiGreenBg, color: colors.admin.kpiGreenText },
  { icon: 'people-outline', bg: colors.admin.kpiPurpleBg, color: colors.admin.kpiPurpleText },
];

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
    { key: 'pendentes', label: 'Pendentes', value: stats.pendentes },
    { key: 'confirmados', label: 'Confirmados', value: stats.confirmados },
    { key: 'estagiarios', label: 'Estagiários', value: stats.totalEstagiarios },
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
        ListEmptyComponent={<Text style={themeStyles.empty}>Nenhum estagiário cadastrado.</Text>}
        ListHeaderComponent={
          <View>
            <Text style={styles.pageTitle}>Visão Geral</Text>
            <Text style={themeStyles.sub}>Painel administrativo — Clínica Psiquiátrica</Text>

            {temAlertas && (
              <View style={themeStyles.alertSupervisor}>
                {alertas.pendentesHoje > 0 && (
                  <View style={styles.alertRow}>
                    <Ionicons name="alert-circle" size={16} color={colors.warningText} />
                    <Text style={themeStyles.alertText}>
                      {alertas.pendentesHoje} consulta{alertas.pendentesHoje > 1 ? 's' : ''} pendente
                      {alertas.pendentesHoje > 1 ? 's' : ''} hoje
                    </Text>
                  </View>
                )}
                {alertas.estagiariosSemConsultas > 0 && (
                  <View style={styles.alertRow}>
                    <Ionicons name="person-remove-outline" size={16} color={colors.warningText} />
                    <Text style={themeStyles.alertText}>
                      {alertas.estagiariosSemConsultas} estagiário
                      {alertas.estagiariosSemConsultas > 1 ? 's' : ''} sem consultas
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={themeStyles.kpiRow}>
              {kpis.map((kpi, index) => {
                const style = KPI_STYLES[index];
                return (
                  <Pressable
                    key={kpi.key}
                    style={({ pressed }) => [themeStyles.kpiCard, pressed && styles.kpiPressed]}
                    onPress={() => navigation.navigate('Estagiarios')}
                  >
                    <View style={[styles.kpiIcon, { backgroundColor: style.bg }]}>
                      <Ionicons name={style.icon} size={20} color={style.color} />
                    </View>
                    <Text style={themeStyles.kpiValue}>{kpi.value}</Text>
                    <Text style={themeStyles.kpiLabel}>{kpi.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <SectionTitle variant="primary">Estagiários</SectionTitle>
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
  pageTitle: {
    fontSize: 26,
    fontFamily: typography.fontBold,
    color: colors.text,
    marginBottom: 4,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiPressed: {
    opacity: 0.85,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ translateY: -2 }],
  },
  cardLeft: {
    flex: 1,
    marginRight: 10,
  },
  cardNome: {
    fontSize: 15,
    fontFamily: typography.fontBold,
    color: colors.text,
    marginBottom: 2,
  },
  cardConsultas: {
    fontSize: 13,
    fontFamily: typography.fontRegular,
    color: colors.muted,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: typography.fontBold,
  },
  chevron: {
    marginLeft: 2,
  },
});
