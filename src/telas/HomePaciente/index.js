import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import ConsultaCard from '../../components/ConsultaCard';
import SectionTitle from '../../components/SectionTitle';
import { atualizarStatusConsulta, getConsultasByUsuario } from '../../data/clinicaApi';
import { colors, typography } from '../../services/theme';
import { themeStyles } from '../../services/themeStyles';

export default function HomePaciente({ user, navigation }) {
  const [consultas, setConsultas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState(null);

  const proximaPendente = useMemo(
    () => consultas.find((c) => c.status === 'pendente'),
    [consultas]
  );

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
      <Text style={styles.pageTitle}>Início</Text>
      <Text style={themeStyles.sub}>Suas consultas e confirmações</Text>

      {proximaPendente ? (
        <View style={themeStyles.cardHero}>
          <Text style={themeStyles.cardHeroTitle}>Próxima consulta</Text>
          <Text style={themeStyles.cardHeroSub}>
            {proximaPendente.data} às {proximaPendente.horario}
          </Text>
          <Text style={themeStyles.cardHeroSub}>
            {proximaPendente.salaNome} · {proximaPendente.estagiarioNome}
          </Text>
        </View>
      ) : null}

      <SectionTitle variant="primary">Minhas consultas</SectionTitle>

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
        ListEmptyComponent={<Text style={themeStyles.empty}>Nenhuma consulta encontrada.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 26,
    fontFamily: typography.fontBold,
    color: colors.text,
    marginBottom: 4,
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
  buttonNoMargin: {
    flex: 1,
  },
  helper: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 13,
    fontFamily: typography.fontSemiBold,
  },
});
