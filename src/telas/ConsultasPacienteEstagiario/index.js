import React, { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ConsultaCard from '../../components/ConsultaCard';
import ScreenContainer from '../../components/ScreenContainer';
import { getConsultasByUsuario } from '../../data/clinicaApi';
import { colors } from '../../services/theme';

export default function ConsultasPacienteEstagiario({ route, navigation }) {
  const { pacienteId, pacienteNome, estagiarioId } = route.params;
  const [consultas, setConsultas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: pacienteNome || 'Consultas do paciente' });
  }, [navigation, pacienteNome]);

  const carregarConsultas = useCallback(async () => {
    setRefreshing(true);
    const dados = await getConsultasByUsuario(estagiarioId);
    const filtradas = dados
      .filter((consulta) => consulta.pacienteId === pacienteId)
      .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));
    setConsultas(filtradas);
    setRefreshing(false);
  }, [estagiarioId, pacienteId]);

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
          <ConsultaCard consulta={item} onPress={() => navigation.navigate('ConsultaDetalhe', { consultaId: item.id })} />
        )}
        ListHeaderComponent={
          <Text style={styles.subtitle}>
            {consultas.length} consulta{consultas.length !== 1 ? 's' : ''} para {pacienteNome}
          </Text>
        }
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma consulta encontrada para este paciente.</Text>}
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
  empty: {
    color: colors.muted,
    marginTop: 20,
    textAlign: 'center',
  },
});
