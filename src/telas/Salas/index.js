import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import ActionButton from '../../components/ActionButton';
import { atualizarStatusSala, getSalas } from '../../data/mockApi';
import { colors } from '../../services/theme';

const statusOptions = ['disponivel', 'ocupada', 'em reforma'];

const tipoLabels = {
  atendimento: 'Atendimento',
  recepcao: 'Recepção',
  descanso: 'Descanso',
};

function getStatusStyle(status) {
  if (status === 'ocupada') {
    return { backgroundColor: '#fee2e2', color: '#b91c1c' };
  }
  if (status === 'em reforma') {
    return { backgroundColor: '#fef9c3', color: '#854d0e' };
  }
  return { backgroundColor: '#d1fae5', color: colors.primary };
}

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [mostrarTodas, setMostrarTodas] = useState(true);

  const salasFiltradas = useMemo(() => {
    if (mostrarTodas) return salas;
    return salas.filter((sala) => sala.status === 'disponivel');
  }, [mostrarTodas, salas]);

  const carregarSalas = useCallback(async () => {
    setRefreshing(true);
    const dados = await getSalas();
    setSalas(dados);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarSalas();
    }, [carregarSalas])
  );

  function abrirAlteracaoStatus(sala) {
    Alert.alert(
      `Alterar status — ${sala.nome}`,
      'Selecione o novo status:',
      [
        ...statusOptions.map((status) => ({
          text: status,
          onPress: () => handleAtualizarStatusSala(sala.id, status),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  }

  async function handleAtualizarStatusSala(salaId, novoStatus) {
    try {
      await atualizarStatusSala(salaId, novoStatus);
      Alert.alert('Sucesso', 'Status atualizado.');
      carregarSalas();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  return (
    <ScreenContainer>
      <FadeInView style={styles.wrapper}>
        <Text style={styles.title}>Ambientes da clínica</Text>
        <Text style={styles.intro}>
          Estrutura fixa: 6 consultórios de atendimento, recepção e sala de descanso. O status indica se o ambiente
          está livre para uso.
        </Text>
        <Text style={styles.nota}>
          Consultórios 1 e 2: uso restrito — terça 13h–16h; quarta e sexta 13h–18h (agendamento validado no sistema).
        </Text>

        <View style={styles.filterRow}>
          <ActionButton
            title={mostrarTodas ? 'Só disponíveis' : 'Ver todos'}
            variant="secondary"
            onPress={() => setMostrarTodas((v) => !v)}
          />
        </View>

        <FlatList
          data={salasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarSalas} />}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <Pressable style={styles.card} onPress={() => abrirAlteracaoStatus(item)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.salaNome}>{item.nome}</Text>
                  <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Text style={[styles.badgeText, { color: statusStyle.color }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.tipo}>{tipoLabels[item.tipo] || item.tipo}</Text>
                {item.restricaoConsultorio ? (
                  <Text style={styles.restricao}>Horário restrito para agendamento</Text>
                ) : null}
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum ambiente na lista.</Text>}
        />
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
  intro: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 8,
    lineHeight: 18,
  },
  nota: {
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaNome: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  tipo: {
    marginTop: 6,
    fontSize: 13,
    color: colors.muted,
  },
  restricao: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  empty: {
    marginTop: 10,
    color: colors.muted,
    textAlign: 'center',
  },
});
