import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import { getPacientesComStatus } from '../../data/mockApi';
import { colors } from '../../services/theme';

function getStatusStyle(status) {
  if (status === 'cancelado') {
    return { backgroundColor: '#fee2e2', color: '#b91c1c' };
  }
  if (status === 'sessão confirmada') {
    return { backgroundColor: '#fef9c3', color: '#854d0e' };
  }
  return { backgroundColor: '#d1fae5', color: colors.primary };
}

export default function PacientesEstagiario({ user, navigation }) {
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
        <Text style={styles.title}>Pacientes</Text>
        <Text style={styles.subtitle}>Toque no paciente para abrir o prontuário e o histórico de consultas.</Text>
        <View style={styles.newButton}>
          <ActionButton
            title="Cadastrar Paciente"
            onPress={() =>
              navigation.navigate('CadastroUsuario', {
                titulo: 'Cadastrar Paciente',
                tipoInicial: 'paciente',
              })
            }
          />
        </View>

        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarPacientes} />}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.statusPaciente);
            return (
              <Pressable
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() => navigation.navigate('ProntuarioPaciente', { pacienteId: item.id })}
              >
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.info}>Prontuário: {item.prontuario || '—'}</Text>
                <Text style={styles.info}>{item.email}</Text>
                <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
                  <Text style={[styles.badgeText, { color: statusStyle.color }]}>{item.statusPaciente}</Text>
                </View>
              </Pressable>
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
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
  cardPressed: {
    opacity: 0.88,
  },
  newButton: {
    marginBottom: 12,
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
