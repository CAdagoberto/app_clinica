import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import {
  anexarExame,
  getConsultaById,
  getSolicitacoesExameByConsulta,
  solicitarExame,
} from '../../data/mockApi';
import { colors } from '../../services/theme';

export default function ConsultaDetalhe({ route, user }) {
  const { consultaId } = route.params;
  const [consulta, setConsulta] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [tituloExame, setTituloExame] = useState('');
  const [descricaoExame, setDescricaoExame] = useState('');
  const [loading, setLoading] = useState(false);

  const carregarDados = useCallback(async () => {
    const [consultaData, solicitacoesData] = await Promise.all([
      getConsultaById(consultaId),
      getSolicitacoesExameByConsulta(consultaId),
    ]);
    setConsulta(consultaData);
    setSolicitacoes(solicitacoesData);
  }, [consultaId]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  async function handleSolicitarExame() {
    try {
      setLoading(true);
      await solicitarExame({
        consultaId,
        titulo: tituloExame,
        descricao: descricaoExame,
        solicitadoPorId: user.id,
      });
      setTituloExame('');
      setDescricaoExame('');
      Alert.alert('Sucesso', 'Solicitação de exame criada.');
      carregarDados();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnexarExame(solicitacaoId) {
    try {
      await anexarExame(solicitacaoId, `exame-consulta-${consultaId}.pdf`);
      Alert.alert('Sucesso', 'Exame anexado com sucesso.');
      carregarDados();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  if (!consulta) {
    return (
      <ScreenContainer>
        <Text style={styles.empty}>Carregando detalhes...</Text>
      </ScreenContainer>
    );
  }

  const podeSolicitarExame = user.tipo === 'admin' || user.tipo === 'estagiario';
  const podeAnexarExame = user.tipo === 'paciente';

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Detalhes da Consulta</Text>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Consulta #{consulta.id}</Text>
          <Text style={styles.info}>Paciente: {consulta.pacienteNome}</Text>
          <Text style={styles.info}>Estagiário: {consulta.estagiarioNome}</Text>
          <Text style={styles.info}>Sala: {consulta.salaNome}</Text>
          <Text style={styles.info}>Data: {consulta.data}</Text>
          <Text style={styles.info}>Horário: {consulta.horario}</Text>
          <Text style={styles.status}>Status: {consulta.status}</Text>
        </View>

        {podeSolicitarExame ? (
          <View style={styles.card}>
            <Text style={styles.subtitle}>Solicitar Exame</Text>
            <TextInput
              value={tituloExame}
              onChangeText={setTituloExame}
              placeholder="Título do exame"
              style={styles.input}
            />
            <TextInput
              value={descricaoExame}
              onChangeText={setDescricaoExame}
              placeholder="Descrição do exame"
              style={[styles.input, styles.textArea]}
              multiline
            />
            <ActionButton
              title={loading ? 'Salvando...' : 'Solicitar Exame'}
              onPress={handleSolicitarExame}
              disabled={loading}
            />
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.subtitle}>Exames Solicitados</Text>
          {solicitacoes.length === 0 ? (
            <Text style={styles.empty}>Nenhum exame solicitado para esta consulta.</Text>
          ) : (
            solicitacoes.map((item) => (
              <View key={item.id} style={styles.exameItem}>
                <Text style={styles.exameTitulo}>{item.titulo}</Text>
                <Text style={styles.info}>{item.descricao}</Text>
                <Text style={styles.info}>
                  Situação: {item.anexado ? `Anexado (${item.arquivoNome})` : 'Aguardando anexo'}
                </Text>
                {podeAnexarExame && !item.anexado ? (
                  <View style={styles.anexarButton}>
                    <ActionButton title="Anexar Exame" onPress={() => handleAnexarExame(item.id)} />
                  </View>
                ) : null}
              </View>
            ))
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
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  exameItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  exameTitulo: {
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  anexarButton: {
    marginTop: 8,
  },
  empty: {
    color: colors.muted,
  },
});
