import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import ConsultaCard from '../../components/ConsultaCard';
import { getProntuarioPaciente } from '../../data/clinicaApi';
import { colors } from '../../services/theme';

export default function ProntuarioPaciente({ route, navigation }) {
  const { pacienteId } = route.params;
  const [dados, setDados] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setRefreshing(true);
    setErro(null);
    try {
      const r = await getProntuarioPaciente(pacienteId);
      setDados(r);
    } catch (e) {
      setDados(null);
      setErro(e.message || 'Não foi possível carregar o prontuário.');
    }
    setRefreshing(false);
  }, [pacienteId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  if (erro) {
    return (
      <ScreenContainer>
        <Text style={styles.erro}>{erro}</Text>
      </ScreenContainer>
    );
  }

  if (!dados) {
    return (
      <ScreenContainer>
        <Text style={styles.muted}>Carregando prontuário...</Text>
      </ScreenContainer>
    );
  }

  const { paciente, profissionalResponsavel, historicoConsultas, encaminhamentos } = dados;

  return (
    <ScreenContainer>
      <FlatList
        data={historicoConsultas}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregar} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Prontuário</Text>
            <View style={styles.card}>
              <Text style={styles.nome}>{paciente.nome}</Text>
              <Text style={styles.linha}>Prontuário: {paciente.prontuario}</Text>
              <Text style={styles.linha}>Telefone: {paciente.telefone}</Text>
              <Text style={styles.linha}>Região: {paciente.regiao}</Text>
              {paciente.menorDeIdade ? (
                <>
                  <Text style={styles.sub}>Responsável legal</Text>
                  <Text style={styles.linha}>{paciente.responsavelLegalNome}</Text>
                  <Text style={styles.linha}>{paciente.responsavelLegalTelefone}</Text>
                </>
              ) : null}
              <Text style={styles.sub}>Profissional responsável</Text>
              <Text style={styles.linha}>
                {profissionalResponsavel
                  ? `${profissionalResponsavel.nome} (matr. ${profissionalResponsavel.matricula})`
                  : '—'}
              </Text>
            </View>

            <Text style={styles.section}>Encaminhamentos registrados</Text>
            {encaminhamentos.length === 0 ? (
              <Text style={styles.muted}>Nenhum encaminhamento.</Text>
            ) : (
              encaminhamentos.map((e) => (
                <View key={e.id} style={styles.encCard}>
                  <Text style={styles.encTipo}>{e.tipo === 'interno' ? 'Interno' : 'Externo'}</Text>
                  <Text style={styles.linha}>{e.destino}</Text>
                  {e.observacao ? <Text style={styles.muted}>{e.observacao}</Text> : null}
                </View>
              ))
            )}

            <Pressable
              style={styles.linkEnc}
              onPress={() =>
                navigation.navigate('EncaminhamentoPaciente', {
                  pacienteId: paciente.id,
                  pacienteNome: paciente.nome,
                })
              }
            >
              <Text style={styles.linkEncText}>+ Novo encaminhamento</Text>
            </Pressable>

            <Text style={[styles.section, { marginTop: 16 }]}>Histórico de consultas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ConsultaCard
            consulta={item}
            onPress={() => navigation.navigate('ConsultaDetalhe', { consultaId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.muted}>Nenhuma consulta registrada.</Text>}
      />
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
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  linha: {
    color: colors.text,
    marginBottom: 4,
    fontSize: 14,
  },
  sub: {
    marginTop: 10,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  encCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  encTipo: {
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
  },
  erro: {
    color: colors.danger,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
  },
  linkEnc: {
    marginBottom: 8,
  },
  linkEncText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});
