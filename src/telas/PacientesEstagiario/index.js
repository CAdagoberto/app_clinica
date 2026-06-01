import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import FadeInView from '../../components/FadeInView';
import SectionTitle from '../../components/SectionTitle';
import ScreenContainer from '../../components/ScreenContainer';
import { getPacientesComStatus } from '../../data/clinicaApi';
import { colors, typography } from '../../services/theme';
import { themeStyles } from '../../services/themeStyles';

function getStatusStyle(status) {
  if (status === 'cancelado') {
    return { backgroundColor: colors.dangerBg, color: colors.dangerText };
  }
  if (status === 'sessão confirmada') {
    return { backgroundColor: colors.successBg, color: colors.successText };
  }
  return { backgroundColor: colors.warningBg, color: colors.warningText };
}

function iniciais(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
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
        <SectionTitle>Meus Pacientes</SectionTitle>
        <Text style={themeStyles.sub}>Toque no paciente para abrir o prontuário e o histórico de consultas.</Text>
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
                <View style={themeStyles.avatarPatient}>
                  <Text style={themeStyles.avatarPatientText}>{iniciais(item.nome)}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.name}>{item.nome}</Text>
                  <Text style={styles.info}>Prontuário: {item.prontuario || '—'}</Text>
                  <Text style={styles.info}>{item.email}</Text>
                  <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
                    <Text style={[styles.badgeText, { color: statusStyle.color }]}>{item.statusPaciente}</Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={themeStyles.empty}>Nenhum paciente encontrado.</Text>}
        />
      </FadeInView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  newButton: {
    marginBottom: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ translateY: -2 }],
  },
  cardBody: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: typography.fontBold,
    color: colors.text,
    marginBottom: 4,
  },
  info: {
    fontSize: 13,
    fontFamily: typography.fontRegular,
    color: colors.muted,
    marginBottom: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: typography.fontSemiBold,
  },
});
