import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionButton from '../../components/ActionButton';
import AppTextInput from '../../components/AppTextInput';
import ScreenContainer from '../../components/ScreenContainer';
import { cadastrarUsuario } from '../../data/clinicaApi';
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

  const [telefone, setTelefone] = useState('');
  const [regiao, setRegiao] = useState('');
  const [prontuario, setProntuario] = useState('');
  const [menorDeIdade, setMenorDeIdade] = useState(false);
  const [responsavelLegalNome, setResponsavelLegalNome] = useState('');
  const [responsavelLegalTelefone, setResponsavelLegalTelefone] = useState('');

  const [matricula, setMatricula] = useState('');
  const [nivelEstagio, setNivelEstagio] = useState(1);

  if (!user || tiposPermitidos.length === 0) {
    return (
      <ScreenContainer centered>
        <Text style={styles.semPermissao}>Você não tem permissão para realizar cadastros.</Text>
      </ScreenContainer>
    );
  }

  async function handleCadastro() {
    if (!nome || !email || !senha || !tipo) {
      Alert.alert('Atenção', 'Preencha nome, email e senha.');
      return;
    }

    const payload = { nome, email, senha, tipo };

    if (tipo === 'paciente') {
      Object.assign(payload, {
        telefone,
        regiao,
        prontuario,
        menorDeIdade,
        responsavelLegalNome,
        responsavelLegalTelefone,
      });
    }
    if (tipo === 'estagiario') {
      Object.assign(payload, { matricula, nivelEstagio, ativo: true });
    }

    try {
      setLoading(true);
      await cadastrarUsuario(payload, {
        atorTipo: user?.tipo,
        atorId: user?.id,
      });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso.');
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
        <Text style={styles.title}>{route?.params?.titulo || 'Cadastro'}</Text>

        {tiposPermitidos.length > 1 ? (
          <>
            <Text style={styles.label}>Tipo de usuário</Text>
            <View style={styles.typeRow}>
              {tiposPermitidos.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.typeChip, tipo === item && styles.typeChipAtivo]}
                  onPress={() => setTipo(item)}
                >
                  <Text style={[styles.typeChipText, tipo === item && styles.typeChipTextAtivo]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.fixedType}>Tipo: paciente</Text>
        )}

        <Text style={styles.section}>Dados de acesso</Text>
        <AppTextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor={colors.muted}
          value={nome}
          onChangeText={setNome}
        />
        <AppTextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <AppTextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {tipo === 'paciente' ? (
          <>
            <Text style={styles.section}>Dados do paciente (obrigatórios)</Text>
            <AppTextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor={colors.muted}
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
            <AppTextInput
              style={styles.input}
              placeholder="Região / localização"
              placeholderTextColor={colors.muted}
              value={regiao}
              onChangeText={setRegiao}
            />
            <AppTextInput
              style={styles.input}
              placeholder="Número de prontuário"
              placeholderTextColor={colors.muted}
              value={prontuario}
              onChangeText={setProntuario}
            />

            <Pressable style={styles.checkRow} onPress={() => setMenorDeIdade(!menorDeIdade)}>
              <View style={[styles.checkBox, menorDeIdade && styles.checkBoxMarcado]} />
              <Text style={styles.checkLabel}>Paciente menor de idade</Text>
            </Pressable>

            {menorDeIdade ? (
              <>
                <Text style={styles.helper}>Responsável legal (obrigatório)</Text>
                <AppTextInput
                  style={styles.input}
                  placeholder="Nome do responsável legal"
                  placeholderTextColor={colors.muted}
                  value={responsavelLegalNome}
                  onChangeText={setResponsavelLegalNome}
                />
                <AppTextInput
                  style={styles.input}
                  placeholder="Telefone do responsável"
                  placeholderTextColor={colors.muted}
                  value={responsavelLegalTelefone}
                  onChangeText={setResponsavelLegalTelefone}
                  keyboardType="phone-pad"
                />
              </>
            ) : null}
          </>
        ) : null}

        {tipo === 'estagiario' ? (
          <>
            <Text style={styles.section}>Dados do estagiário</Text>
            <AppTextInput
              style={styles.input}
              placeholder="Número de matrícula"
              placeholderTextColor={colors.muted}
              value={matricula}
              onChangeText={setMatricula}
            />
            <Text style={styles.label}>Estágio atual (carga de pacientes)</Text>
            <View style={styles.typeRow}>
              {[1, 2, 3].map((n) => (
                <Pressable
                  key={n}
                  style={[styles.typeChip, nivelEstagio === n && styles.typeChipAtivo]}
                  onPress={() => setNivelEstagio(n)}
                >
                  <Text style={[styles.typeChipText, nivelEstagio === n && styles.typeChipTextAtivo]}>
                    Estágio {n}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.helper}>
              Estágio 1: até 2 pacientes. Estágios 2 e 3: até 3 pacientes (conforme regulamento).
            </Text>
          </>
        ) : null}

        <ActionButton title={loading ? 'Salvando...' : 'Cadastrar'} onPress={handleCadastro} disabled={loading} />
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
  section: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 10,
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
  label: {
    marginBottom: 8,
    color: colors.text,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
  },
  typeChipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    fontWeight: '600',
    color: colors.text,
  },
  typeChipTextAtivo: {
    color: '#fff',
  },
  fixedType: {
    marginBottom: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  helper: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
  },
  checkBoxMarcado: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  semPermissao: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
});
