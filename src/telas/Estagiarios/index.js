import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppTextInput from '../../components/AppTextInput';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import { getEstagiariosComConsultas } from '../../data/clinicaApi';
import { colors } from '../../services/theme';

const FILTROS = [
  { key: null, label: 'Todos' },
  { key: 'com_consultas', label: 'Com consultas' },
  { key: 'sem_consultas', label: 'Sem consultas' },
];

const CARGA_CONFIG = {
  sem_consultas: { label: 'Sem consultas', bg: '#fef9c3', text: '#854d0e' },
  equilibrado: { label: 'Regular', bg: '#d1fae5', text: '#065f46' },
  sobrecarregado: { label: 'Agenda cheia', bg: '#fee2e2', text: '#b91c1c' },
};

function EstagiarioItem({ item, onVerAgenda }) {
  const carga = CARGA_CONFIG[item.carga];

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <Text style={styles.cardConsultas}>
            {item.totalConsultas} consulta{item.totalConsultas !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: carga.bg }]}>
          <Text style={[styles.badgeText, { color: carga.text }]}>{carga.label}</Text>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [styles.agendaRow, pressed && styles.agendaRowPressed]}
        onPress={onVerAgenda}
        android_ripple={{ color: 'rgba(17, 125, 108, 0.12)' }}
      >
        <View style={styles.agendaRowLeft}>
          <View style={styles.agendaIconWrap}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.agendaTitle}>Ver agenda</Text>
            <Text style={styles.agendaHint}>Consultas e horários</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </Pressable>
    </View>
  );
}

export default function Estagiarios({ navigation }) {
  const [estagiarios, setEstagiarios] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const carregarEstagiarios = useCallback(
    async (nome = filtroNome, filtro = filtroAtivo) => {
      setRefreshing(true);
      const dados = await getEstagiariosComConsultas({ filtroNome: nome, filtro });
      setEstagiarios(dados);
      setRefreshing(false);
    },
    [filtroNome, filtroAtivo]
  );

  useFocusEffect(
    useCallback(() => {
      carregarEstagiarios();
    }, [carregarEstagiarios])
  );

  function handleBusca(texto) {
    setFiltroNome(texto);
    carregarEstagiarios(texto, filtroAtivo);
  }

  function handleFiltro(chave) {
    const novoFiltro = chave === filtroAtivo ? null : chave;
    setFiltroAtivo(novoFiltro);
    carregarEstagiarios(filtroNome, novoFiltro);
  }

  const semConsultas = estagiarios.filter((e) => e.carga === 'sem_consultas').length;
  const sobrecarregados = estagiarios.filter((e) => e.carga === 'sobrecarregado').length;

  return (
    <ScreenContainer>
      <FadeInView style={styles.wrapper}>
        <FlatList
          data={estagiarios}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => carregarEstagiarios()} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <EstagiarioItem
              item={item}
              onVerAgenda={() =>
                navigation.navigate('AgendaEstagiario', {
                  estagiarioId: item.id,
                  estagiarioNome: item.nome,
                })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum estagiário encontrado.</Text>
          }
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>Estagiários</Text>

              {(semConsultas > 0 || sobrecarregados > 0) && (
                <View style={styles.resumoRow}>
                  {semConsultas > 0 && (
                    <View style={[styles.resumoBadge, { backgroundColor: '#fef9c3' }]}>
                      <Ionicons name="warning-outline" size={13} color="#854d0e" />
                      <Text style={[styles.resumoText, { color: '#854d0e' }]}>
                        {semConsultas} sem consultas
                      </Text>
                    </View>
                  )}
                  {sobrecarregados > 0 && (
                    <View style={[styles.resumoBadge, { backgroundColor: '#fee2e2' }]}>
                      <Ionicons name="alert-circle-outline" size={13} color="#b91c1c" />
                      <Text style={[styles.resumoText, { color: '#b91c1c' }]}>
                        {sobrecarregados} sobrecarregado{sobrecarregados > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <AppTextInput
                style={styles.busca}
                placeholder="Pesquisar por nome"
                placeholderTextColor={colors.muted}
                value={filtroNome}
                onChangeText={handleBusca}
              />

              <View style={styles.filtrosRow}>
                {FILTROS.map((f) => (
                  <Pressable
                    key={String(f.key)}
                    style={[styles.filtroBtn, filtroAtivo === f.key && styles.filtroBtnAtivo]}
                    onPress={() => handleFiltro(f.key)}
                  >
                    <Text
                      style={[styles.filtroBtnText, filtroAtivo === f.key && styles.filtroBtnTextAtivo]}
                    >
                      {f.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.contagem}>
                {estagiarios.length} estagiário{estagiarios.length !== 1 ? 's' : ''}
              </Text>
            </View>
          }
        />
      </FadeInView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  resumoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  resumoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  resumoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  busca: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  filtrosRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filtroBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  filtroBtnAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filtroBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  filtroBtnTextAtivo: {
    color: '#fff',
  },
  contagem: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardInfo: {
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
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  agendaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  agendaRowPressed: {
    opacity: 0.88,
    backgroundColor: '#e8f5f2',
  },
  agendaRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  agendaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  agendaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  agendaHint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  vazio: {
    marginTop: 24,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
  },
});
