import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import { login } from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function Login({ onLogin, navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEntrar() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      const usuario = await login(email, senha);
      onLogin(usuario);
    } catch (error) {
      Alert.alert('Erro no login', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer centered>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Clínica Psicológica</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
        </View>

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

        <View style={styles.button}>
          <ActionButton
            title={loading ? 'Entrando...' : 'Entrar'}
            onPress={handleEntrar}
            disabled={loading}
          />
        </View>

        <View style={styles.button}>
          <ActionButton
            title="Ir para Cadastro"
            variant="secondary"
            onPress={() => navigation.navigate('Cadastro')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
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
  button: {
    marginTop: 10,
  },
});
