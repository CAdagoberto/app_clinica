import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import ConsultaCard from '../../components/ConsultaCard';
import { getConsultasByUsuario } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function HomeEstagiario({ user }) {
  const [consultas, setConsultas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarConsultas = useCallback(async () => {
    setRefreshing(true);
    const dados = await getConsultasByUsuario(user.id);
    setConsultas(dados);
    setRefreshing(false);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [carregarConsultas])
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>Consultas de Hoje</Text>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarConsultas} />}
        renderItem={({ item }) => (
          <ConsultaCard consulta={item}>
            <View style={styles.row}>
              <Text style={styles.detail}>Paciente: {item.pacienteNome}</Text>
              <Text style={styles.detail}>Horário: {item.horario}</Text>
            </View>
          </ConsultaCard>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma consulta encontrada.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  row: {
    marginTop: 8,
  },
  detail: {
    color: colors.text,
  },
  empty: {
    color: colors.muted,
    marginTop: 20,
    textAlign: 'center',
  },
});
