import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import { getNotificacoes, marcarNotificacaoLida } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function Notificacoes({ user }) {
  const [lista, setLista] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    setRefreshing(true);
    const dados = await getNotificacoes(user.id);
    setLista(dados);
    setRefreshing(false);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function marcarLida(id) {
    await marcarNotificacaoLida(id, user.id);
    carregar();
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Notificações</Text>
      <Text style={styles.sub}>Lembretes e confirmações (mock — no app final: push / WhatsApp conforme escopo).</Text>
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregar} />}
        renderItem={({ item }) => (
          <View style={[styles.card, item.lida && styles.cardLida]}>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>
            <Text style={styles.cardCorpo}>{item.corpo}</Text>
            <Text style={styles.data}>{item.criadaEm}</Text>
            {!item.lida ? (
              <Pressable style={styles.btnLida} onPress={() => marcarLida(item.id)}>
                <Text style={styles.btnLidaText}>Marcar como lida</Text>
              </Pressable>
            ) : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma notificação.</Text>}
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
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cardLida: {
    opacity: 0.65,
  },
  cardTitulo: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  cardCorpo: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  data: {
    marginTop: 8,
    fontSize: 12,
    color: colors.muted,
  },
  btnLida: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  btnLidaText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  vazio: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 24,
  },
});
