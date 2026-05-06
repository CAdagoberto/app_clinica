import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import ConsultaCard from '../../components/ConsultaCard';
import { fazerCheckIn, getConsultasDisponiveis } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function CheckIn() {
  const [consultas, setConsultas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarConsultas = useCallback(async () => {
    setRefreshing(true);
    const dados = await getConsultasDisponiveis();
    setConsultas(dados);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [carregarConsultas])
  );

  async function handleCheckIn(consultaId) {
    await fazerCheckIn(consultaId);
    Alert.alert('Sucesso', 'Check-in realizado e status atualizado.');
    carregarConsultas();
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Recepção — chegadas do dia</Text>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarConsultas} />}
        renderItem={({ item }) => (
          <ConsultaCard consulta={item}>
            <View style={styles.button}>
              <ActionButton title="Fazer Check-in" onPress={() => handleCheckIn(item.id)} />
            </View>
          </ConsultaCard>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma consulta pendente para hoje.</Text>}
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
  button: {
    marginTop: 10,
  },
  empty: {
    color: colors.muted,
    marginTop: 20,
    textAlign: 'center',
  },
});
