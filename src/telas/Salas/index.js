import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import ActionButton from '../../components/ActionButton';
import SectionTitle from '../../components/SectionTitle';
import { SalaStatusBadge } from '../../components/StatusBadge';
import { atualizarStatusSala, getSalas } from '../../data/clinicaApi';
import { colors, typography } from '../../services/theme';
import { themeStyles } from '../../services/themeStyles';

const statusOptions = ['disponivel', 'ocupada', 'em reforma'];

const tipoLabels = {
  atendimento: 'Atendimento',
  recepcao: 'Recepção',
  descanso: 'Descanso',
};

export default function Salas() {
  const [salas, setSalas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [mostrarTodas, setMostrarTodas] = useState(true);

  const salasFiltradas = useMemo(() => {
    if (mostrarTodas) return salas;
    return salas.filter((sala) => sala.status === 'disponivel');
  }, [mostrarTodas, salas]);

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

  function abrirAlteracaoStatus(sala) {
    Alert.alert(
      `Alterar status — ${sala.nome}`,
      'Selecione o novo status:',
      [
        ...statusOptions.map((status) => ({
          text: status,
          onPress: () => handleAtualizarStatusSala(sala.id, status),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  }

  async function handleAtualizarStatusSala(salaId, novoStatus) {
    try {
      await atualizarStatusSala(salaId, novoStatus);
      Alert.alert('Sucesso', 'Status atualizado.');
      carregarSalas();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  return (
    <ScreenContainer>
      <FadeInView style={styles.wrapper}>
        <SectionTitle variant="primary">Ambientes da clínica</SectionTitle>
        <Text style={themeStyles.sub}>
          Estrutura fixa: 6 consultórios de atendimento, recepção e sala de descanso. O status indica se o ambiente
          está livre para uso.
        </Text>
        <Text style={styles.nota}>
          Consultórios 1 e 2: uso restrito — terça 13h–16h; quarta e sexta 13h–18h (agendamento validado no sistema).
        </Text>

        <View style={styles.filterRow}>
          <ActionButton
            title={mostrarTodas ? 'Só disponíveis' : 'Ver todos'}
            variant="secondary"
            onPress={() => setMostrarTodas((v) => !v)}
          />
        </View>

        <FlatList
          data={salasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarSalas} />}
          renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => abrirAlteracaoStatus(item)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.salaNome}>{item.nome}</Text>
                  <SalaStatusBadge status={item.status} />
                </View>
                <Text style={styles.tipo}>{tipoLabels[item.tipo] || item.tipo}</Text>
                {item.restricaoConsultorio ? (
                  <Text style={styles.restricao}>Horário restrito para agendamento</Text>
                ) : null}
              </Pressable>
          )}
          ListEmptyComponent={<Text style={themeStyles.empty}>Nenhum ambiente na lista.</Text>}
        />
      </FadeInView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  nota: {
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaNome: {
    fontFamily: typography.fontBold,
    color: colors.text,
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  tipo: {
    marginTop: 6,
    fontSize: 13,
    color: colors.muted,
  },
  restricao: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
});
