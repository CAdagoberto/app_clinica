import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ActionButton from '../../components/ActionButton';
import AppTextInput from '../../components/AppTextInput';
import LogoAvatar from '../../components/LogoAvatar';
import ScreenContainer from '../../components/ScreenContainer';
import { login } from '../../data/clinicaApi';
import { colors, radii, shadows, typography } from '../../services/theme';

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
    <ScreenContainer centered insetBottom>
      <View style={styles.card}>
        <LogoAvatar size={60} circular />
        <Text style={styles.title}>Clínica Psiquiátrica</Text>
        <Text style={styles.subtitle}>Acesse com seu email institucional</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <AppTextInput
            placeholder="seu@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <AppTextInput
            placeholder="••••••••"
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

        <Text style={styles.hint}>Demonstração: admin@clinica.com / 123456</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: 28,
    ...shadows.login,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontBold,
    color: colors.textAlt,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: typography.fontMedium,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontFamily: typography.fontSemiBold,
    color: colors.mutedDark,
    marginBottom: 6,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    fontFamily: typography.fontRegular,
    color: colors.placeholder,
    textAlign: 'center',
  },
});
