import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import { cadastrarUsuario } from '../../data/mockApi';
import { colors } from '../../services/theme';

const tiposUsuario = ['admin', 'estagiario', 'paciente'];

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('paciente');
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
    if (!nome || !email || !senha || !tipo) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      await cadastrarUsuario({ nome, email, senha, tipo });
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
      <Text style={styles.title}>Cadastro</Text>

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

      <Text style={styles.label}>Tipo de usuário:</Text>
      <View style={styles.typeButtons}>
        {tiposUsuario.map((item) => (
          <View key={item} style={styles.typeButton}>
            <ActionButton
              title={item}
              variant={tipo === item ? 'primary' : 'secondary'}
              onPress={() => setTipo(item)}
            />
          </View>
        ))}
      </View>

      <ActionButton
        title={loading ? 'Salvando...' : 'Cadastrar'}
        onPress={handleCadastro}
        disabled={loading}
      />
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
});
