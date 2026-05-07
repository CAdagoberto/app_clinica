import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import ConsultaCard from '../../components/ConsultaCard';
import { atualizarStatusConsulta, getConsultasByUsuario } from '../../data/clinicaApi';
import { colors } from '../../services/theme';

export default function HomePaciente({ user, navigation }) {
  const [consultas, setConsultas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState(null);

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
    try {
      setAtualizandoId(id);
      await atualizarStatusConsulta(id, 'confirmado');
      Alert.alert('Consulta confirmada', 'A consulta foi confirmada com sucesso.');
      await carregarConsultas();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível confirmar a consulta.');
    } finally {
      setAtualizandoId(null);
    }
  }

  async function cancelarConsulta(id) {
    try {
      setAtualizandoId(id);
      await atualizarStatusConsulta(id, 'cancelado');
      Alert.alert('Consulta cancelada', 'A consulta foi cancelada com sucesso.');
      await carregarConsultas();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível cancelar a consulta.');
    } finally {
      setAtualizandoId(null);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Minhas Consultas</Text>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarConsultas} />}
        renderItem={({ item }) => (
          <ConsultaCard
            consulta={item}
            onPress={() => navigation.navigate('ConsultaDetalhe', { consultaId: item.id })}
          >
            {item.status === 'pendente' ? (
              <View style={styles.buttons}>
                <View style={styles.button}>
                  <ActionButton
                    title={atualizandoId === item.id ? 'Confirmando...' : 'Confirmar'}
                    onPress={() => confirmarConsulta(item.id)}
                    disabled={atualizandoId === item.id}
                  />
                </View>
                <View style={styles.buttonNoMargin}>
                  <ActionButton
                    title={atualizandoId === item.id ? 'Cancelando...' : 'Cancelar'}
                    variant="danger"
                    onPress={() => cancelarConsulta(item.id)}
                    disabled={atualizandoId === item.id}
                  />
                </View>
              </View>
            ) : item.status === 'confirmado' ? (
              <Text style={styles.helper}>Consulta já confirmada.</Text>
            ) : (
              <Text style={styles.helper}>Consulta cancelada.</Text>
            )}
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
  helper: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
});
