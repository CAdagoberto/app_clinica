import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import ConsultaCard from '../../components/ConsultaCard';
import { getConsultasByUsuario, getUsuarios } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function HomeAdmin({ user }) {
  const [consultas, setConsultas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = useCallback(async () => {
    setRefreshing(true);
    const [consultasData, usuariosData] = await Promise.all([
      getConsultasByUsuario(user.id),
      getUsuarios(),
    ]);
    setConsultas(consultasData);
    setUsuarios(usuariosData);
    setRefreshing(false);
  }, [user.id]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const examesPendentes = consultas.filter((consulta) => consulta.status === 'pendente').length;
  const examesConfirmados = consultas.filter((consulta) => consulta.status === 'confirmado').length;
  const totalEstagiarios = usuarios.filter((usuario) => usuario.tipo === 'estagiario').length;

  return (
    <ScreenContainer>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarDados} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Painel Admin</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{examesPendentes}</Text>
                <Text style={styles.statLabel}>Exames pendentes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{examesConfirmados}</Text>
                <Text style={styles.statLabel}>Exames confirmados</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{totalEstagiarios}</Text>
                <Text style={styles.statLabel}>Estagiários</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Consultas gerais</Text>
          </View>
        }
        renderItem={({ item }) => <ConsultaCard consulta={item} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.sectionTitle}>Usuários</Text>
            {usuarios.map((usuario) => (
              <View key={usuario.id} style={styles.userCard}>
                <Text style={styles.userName}>{usuario.nome}</Text>
                <Text style={styles.userInfo}>{usuario.email}</Text>
                <Text style={styles.userInfo}>Tipo: {usuario.tipo}</Text>
              </View>
            ))}
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    width: '31.5%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  footer: {
    marginTop: 12,
    paddingBottom: 20,
  },
  userCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  userName: {
    fontWeight: '700',
    color: colors.primary,
  },
  userInfo: {
    color: colors.text,
    marginTop: 2,
  },
});
