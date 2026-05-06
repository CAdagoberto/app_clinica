import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import { getPresencasEstagiario, registrarPresencaEstagiario } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function PresencaEstagiario({ user }) {
  const [lista, setLista] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    setRefreshing(true);
    const dados = await getPresencasEstagiario(user.id);
    setLista(dados);
    setRefreshing(false);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function registrar() {
    try {
      setLoading(true);
      await registrarPresencaEstagiario(user.id);
      Alert.alert('Registrado', 'Sua chegada na clínica foi anotada (demonstração).');
      carregar();
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Presença na clínica</Text>
      <Text style={styles.sub}>
        Controle simples de chegada do estagiário (conforme escopo — evolução futura: integração com ponto).
      </Text>
      <ActionButton
        title={loading ? 'Registrando...' : 'Registrar chegada hoje'}
        onPress={registrar}
        disabled={loading}
      />
      <Text style={styles.section}>Histórico</Text>
      <FlatList
        data={lista}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregar} />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemData}>{item.data}</Text>
            <Text style={styles.itemHora}>Chegada: {item.horarioChegada}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.muted}>Nenhum registro ainda.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  sub: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 14,
  },
  section: {
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    fontSize: 16,
  },
  item: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  itemData: {
    fontWeight: '700',
    color: colors.primary,
  },
  itemHora: {
    color: colors.text,
    marginTop: 4,
  },
  muted: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 12,
  },
});
