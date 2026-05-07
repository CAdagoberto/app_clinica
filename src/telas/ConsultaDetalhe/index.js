import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import { DURACAO_SESSAO_MINUTOS, getConsultaById, getRelatorioConsulta, salvarRelatorioConsulta } from '../../data/clinicaApi';
import { colors } from '../../services/theme';

export default function ConsultaDetalhe({ route, user }) {
  const insets = useSafeAreaInsets();
  const { consultaId } = route.params;
  const [consulta, setConsulta] = useState(null);
  const [relatorio, setRelatorio] = useState('');
  const [loading, setLoading] = useState(false);

  const carregarDados = useCallback(async () => {
    const [consultaData, rel] = await Promise.all([getConsultaById(consultaId), getRelatorioConsulta(consultaId)]);
    setConsulta(consultaData);
    setRelatorio(rel.texto || '');
  }, [consultaId]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  async function handleSalvarRelatorio() {
    try {
      setLoading(true);
      await salvarRelatorioConsulta({ consultaId, texto: relatorio, autorId: user.id });
      Alert.alert('Sucesso', 'Relatório de atendimento salvo.');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!consulta) {
    return (
      <ScreenContainer>
        <Text style={styles.empty}>Carregando detalhes...</Text>
      </ScreenContainer>
    );
  }

  const podeEditarRelatorio = user.tipo === 'admin' || user.tipo === 'estagiario';
  const sessaoLabel =
    consulta.sessaoNumero != null && consulta.pacoteId != null
      ? `Sessão ${consulta.sessaoNumero} de 10 (pacote)`
      : 'Sessão avulsa';

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Detalhes da consulta</Text>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Consulta #{consulta.id}</Text>
          <Text style={styles.info}>{sessaoLabel}</Text>
          <Text style={styles.info}>Duração prevista: {consulta.duracaoMinutos || DURACAO_SESSAO_MINUTOS} min</Text>
          <Text style={styles.info}>Paciente: {consulta.pacienteNome}</Text>
          <Text style={styles.info}>Estagiário: {consulta.estagiarioNome}</Text>
          <Text style={styles.info}>Consultório: {consulta.salaNome}</Text>
          <Text style={styles.info}>
            Data: {consulta.data} — Horário: {consulta.horario}
          </Text>
          <Text style={styles.status}>Status: {consulta.status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Relatório de atendimento</Text>
          <Text style={styles.helper}>
            Registro da sessão conforme fluxo da clínica (após o atendimento).
          </Text>
          {podeEditarRelatorio ? (
            <>
              <TextInput
                value={relatorio}
                onChangeText={setRelatorio}
                placeholder="Descreva o que foi trabalhado na sessão, observações clínicas relevantes..."
                placeholderTextColor={colors.muted}
                style={[styles.input, styles.textArea]}
                multiline
              />
              <ActionButton
                title={loading ? 'Salvando...' : 'Salvar relatório'}
                onPress={handleSalvarRelatorio}
                disabled={loading}
              />
            </>
          ) : relatorio ? (
            <View style={styles.relatorioLeitura}>
              <Text style={styles.relatorioTitulo}>Registro da equipe</Text>
              <Text style={styles.relatorioCorpo}>{relatorio}</Text>
            </View>
          ) : (
            <Text style={styles.muted}>Nenhum relatório registrado para esta sessão.</Text>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  helper: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 10,
  },
  info: {
    color: colors.text,
    marginBottom: 4,
  },
  status: {
    marginTop: 6,
    fontWeight: '700',
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  muted: {
    color: colors.muted,
    fontSize: 13,
  },
  relatorioLeitura: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  relatorioTitulo: {
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    fontSize: 14,
  },
  relatorioCorpo: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  empty: {
    color: colors.muted,
  },
});
