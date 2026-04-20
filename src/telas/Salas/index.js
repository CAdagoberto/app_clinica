import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import { criarSala, getSalas } from '../../data/mockApi';
import { colors } from '../../services/theme';

const statusOptions = ['disponivel', 'ocupada', 'em reforma'];

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
  const [nomeSala, setNomeSala] = useState('');
  const [statusSala, setStatusSala] = useState('disponivel');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  async function handleCriarSala() {
    try {
      setLoading(true);
      await criarSala(nomeSala, statusSala);
      setNomeSala('');
      setStatusSala('disponivel');
      Alert.alert('Sucesso', 'Sala criada com sucesso.');
      carregarSalas();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <FadeInView style={styles.wrapper}>
        <Text style={styles.title}>Salas</Text>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nova Sala</Text>
          <TextInput
            value={nomeSala}
            onChangeText={setNomeSala}
            style={styles.input}
            placeholder="Nome da sala"
          />

          <Text style={styles.label}>Status:</Text>
          <View style={styles.statusGrid}>
            {statusOptions.map((status) => (
              <View key={status} style={styles.statusButton}>
                <ActionButton
                  title={status}
                  variant={statusSala === status ? 'primary' : 'secondary'}
                  onPress={() => setStatusSala(status)}
                />
              </View>
            ))}
          </View>

          <ActionButton
            title={loading ? 'Salvando...' : 'Criar Sala'}
            onPress={handleCriarSala}
            disabled={loading}
          />
        </View>

        <FlatList
          data={salas}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarSalas} />}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <View style={styles.card}>
                <Text style={styles.salaNome}>{item.nome}</Text>
                <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
                  <Text style={[styles.badgeText, { color: statusStyle.color }]}>{item.status}</Text>
                </View>
              </View>
            );
          }}
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
    marginBottom: 12,
  },
  formCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  label: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  statusGrid: {
    marginBottom: 10,
  },
  statusButton: {
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaNome: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 15,
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
});
