import React, { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ConsultaCard from '../../components/ConsultaCard';
import ScreenContainer from '../../components/ScreenContainer';
import { getConsultasByUsuario } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function AgendaEstagiario({ route, navigation }) {
  const { estagiarioId, estagiarioNome } = route.params;
  const [consultas, setConsultas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: estagiarioNome });
  }, [navigation, estagiarioNome]);

  const carregarConsultas = useCallback(async () => {
    setRefreshing(true);
    const dados = await getConsultasByUsuario(estagiarioId);
    setConsultas(dados);
    setRefreshing(false);
  }, [estagiarioId]);

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [carregarConsultas])
  );

  return (
    <ScreenContainer>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarConsultas} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ConsultaCard
            consulta={item}
            onPress={() => navigation.navigate('ConsultaDetalhe', { consultaId: item.id })}
          />
        )}
        ListHeaderComponent={
          <Text style={styles.subtitle}>
            {consultas.length} consulta{consultas.length !== 1 ? 's' : ''} na agenda
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma consulta encontrada para este estagiário.</Text>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 12,
  },
  vazio: {
    marginTop: 24,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
  },
});
