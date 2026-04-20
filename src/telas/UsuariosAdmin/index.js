import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import { getEstagiarios } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function UsuariosAdmin() {
  const [filtro, setFiltro] = useState('');
  const [estagiarios, setEstagiarios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarEstagiarios = useCallback(async (texto = filtro) => {
    setRefreshing(true);
    const dados = await getEstagiarios(texto);
    setEstagiarios(dados);
    setRefreshing(false);
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregarEstagiarios('');
      setFiltro('');
    }, [carregarEstagiarios])
  );

  function handleFiltro(texto) {
    setFiltro(texto);
    carregarEstagiarios(texto);
  }

  return (
    <ScreenContainer>
      <FadeInView style={styles.wrapper}>
        <Text style={styles.title}>Estagiários</Text>
        <TextInput
          value={filtro}
          onChangeText={handleFiltro}
          placeholder="Pesquisar por nome"
          style={styles.input}
        />

        <FlatList
          data={estagiarios}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => carregarEstagiarios()} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>{item.email}</Text>
              <Text style={styles.info}>Perfil: {item.tipo}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum estagiário encontrado.</Text>}
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  info: {
    marginTop: 4,
    color: colors.text,
  },
  empty: {
    marginTop: 16,
    color: colors.muted,
    textAlign: 'center',
  },
});
