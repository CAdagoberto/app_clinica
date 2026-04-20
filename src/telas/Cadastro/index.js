import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import { cadastrarUsuario } from '../../data/mockApi';
import { colors } from '../../services/theme';

const permissoesPorPerfil = {
  admin: ['estagiario', 'paciente'],
  estagiario: ['paciente'],
};

export default function Cadastro({ navigation, user, route }) {
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const tiposPermitidos = permissoesPorPerfil[user?.tipo] || [];
  const tipoInicial = route?.params?.tipoInicial || tiposPermitidos[0] || '';
  const [tipo, setTipo] = useState(tipoInicial);
  const [loading, setLoading] = useState(false);

  if (!user || tiposPermitidos.length === 0) {
    return (
      <ScreenContainer centered>
        <Text style={styles.semPermissao}>Você não tem permissão para realizar cadastros.</Text>
      </ScreenContainer>
    );
  }

  async function handleCadastro() {
    if (!nome || !email || !senha || !tipo) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      await cadastrarUsuario(
        { nome, email, senha, tipo },
        {
          atorTipo: user?.tipo,
          atorId: user?.id,
        }
      );
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro no cadastro', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
      >
        <Text style={styles.title}>{route?.params?.titulo || 'Cadastro de Usuário'}</Text>

        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {tiposPermitidos.length > 1 ? (
          <>
            <Text style={styles.label}>Tipo de usuário:</Text>
            <View style={styles.typeButtons}>
              {tiposPermitidos.map((item) => (
                <View key={item} style={styles.typeButton}>
                  <ActionButton
                    title={item}
                    variant={tipo === item ? 'primary' : 'secondary'}
                    onPress={() => setTipo(item)}
                  />
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.fixedType}>Tipo: paciente</Text>
        )}

        <ActionButton
          title={loading ? 'Salvando...' : 'Cadastrar'}
          onPress={handleCadastro}
          disabled={loading}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  label: {
    marginBottom: 10,
    color: colors.text,
    fontWeight: '600',
  },
  typeButtons: {
    marginBottom: 20,
  },
  typeButton: {
    marginBottom: 8,
  },
  fixedType: {
    marginBottom: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  semPermissao: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
});
