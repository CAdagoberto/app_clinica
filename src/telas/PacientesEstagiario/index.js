import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import { getPacientesComStatus } from '../../data/mockApi';
import { colors } from '../../services/theme';

function getStatusStyle(status) {
  if (status === 'cancelado') {
    return { backgroundColor: '#fee2e2', color: '#b91c1c' };
  }
  if (status === 'exame pendente') {
    return { backgroundColor: '#fef9c3', color: '#854d0e' };
  }
  return { backgroundColor: '#d1fae5', color: colors.primary };
}

export default function PacientesEstagiario({ user }) {
  const [pacientes, setPacientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarPacientes = useCallback(async () => {
    setRefreshing(true);
    const dados = await getPacientesComStatus(user.id);
    setPacientes(dados);
    setRefreshing(false);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      carregarPacientes();
    }, [carregarPacientes])
  );

  return (
    <ScreenContainer>
      <FadeInView style={styles.wrapper}>
        <Text style={styles.title}>Pacientes e Status</Text>

        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarPacientes} />}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.statusPaciente);
            return (
              <View style={styles.card}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.info}>{item.email}</Text>
                <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
                  <Text style={[styles.badgeText, { color: statusStyle.color }]}>{item.statusPaciente}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum paciente encontrado.</Text>}
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
  badge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  empty: {
    marginTop: 16,
    color: colors.muted,
    textAlign: 'center',
  },
});
