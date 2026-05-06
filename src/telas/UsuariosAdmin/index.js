import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import FadeInView from '../../components/FadeInView';
import ScreenContainer from '../../components/ScreenContainer';
import { getUsuarios } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function UsuariosAdmin({ navigation }) {
  const [filtro, setFiltro] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    setRefreshing(true);
    const dados = await getUsuarios();
    setUsuarios(dados);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const filtrados = useMemo(() => {
    const t = filtro.trim().toLowerCase();
    if (!t) return usuarios;
    return usuarios.filter((u) => u.nome.toLowerCase().includes(t) || u.email.toLowerCase().includes(t));
  }, [usuarios, filtro]);

  return (
    <ScreenContainer>
      <FadeInView style={styles.wrapper}>
        <Text style={styles.title}>Usuários da clínica</Text>
        <Text style={styles.sub}>Administração e supervisão — cadastro conforme escopo (dados mínimos no mock).</Text>
        <View style={styles.newButton}>
          <ActionButton
            title="Novo cadastro"
            onPress={() => navigation.navigate('CadastroUsuario', { titulo: 'Novo usuário' })}
          />
        </View>
        <TextInput
          value={filtro}
          onChangeText={setFiltro}
          placeholder="Buscar por nome ou email"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregar} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>{item.email}</Text>
              <Text style={styles.chip}>Perfil: {item.tipo}</Text>
              {item.tipo === 'estagiario' ? (
                <>
                  <Text style={styles.info}>Matrícula: {item.matricula || '—'}</Text>
                  <Text style={styles.info}>Estágio: {item.nivelEstagio ?? '—'}</Text>
                </>
              ) : null}
              {item.tipo === 'paciente' ? (
                <>
                  <Text style={styles.info}>Prontuário: {item.prontuario || '—'}</Text>
                  <Text style={styles.info}>Telefone: {item.telefone || '—'}</Text>
                  <Text style={styles.info}>Região: {item.regiao || '—'}</Text>
                </>
              ) : null}
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum usuário encontrado.</Text>}
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
  sub: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  newButton: {
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
    fontSize: 14,
  },
  chip: {
    marginTop: 8,
    fontWeight: '700',
    color: colors.text,
    fontSize: 13,
  },
  empty: {
    marginTop: 16,
    color: colors.muted,
    textAlign: 'center',
  },
});
