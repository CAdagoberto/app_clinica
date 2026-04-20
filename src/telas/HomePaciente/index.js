import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import ConsultaCard from '../../components/ConsultaCard';
import { atualizarStatusConsulta, getConsultasByUsuario } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function HomePaciente({ user }) {
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

  async function confirmarConsulta(id) {
    await atualizarStatusConsulta(id, 'confirmado');
    carregarConsultas();
  }

  async function cancelarConsulta(id) {
    await atualizarStatusConsulta(id, 'pendente');
    carregarConsultas();
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Minhas Consultas</Text>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarConsultas} />}
        renderItem={({ item }) => (
          <ConsultaCard consulta={item}>
            <View style={styles.buttons}>
              <View style={styles.button}>
                <ActionButton title="Confirmar" onPress={() => confirmarConsulta(item.id)} />
              </View>
              <View style={styles.buttonNoMargin}>
                <ActionButton title="Cancelar" variant="danger" onPress={() => cancelarConsulta(item.id)} />
              </View>
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
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginRight: 8,
  },
  buttonNoMargin: {
    flex: 1,
  },
  empty: {
    color: colors.muted,
    marginTop: 20,
    textAlign: 'center',
  },
});
