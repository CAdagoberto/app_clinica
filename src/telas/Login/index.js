import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import { login } from '../../data/clinicaApi';
import { colors } from '../../services/theme';

export default function Login({ onLogin }) {
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
      <Text style={styles.title}>Clínica Psicológica</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.muted}
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

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
    maxWidth: 420,
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
