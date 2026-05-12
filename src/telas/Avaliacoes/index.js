import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionButton from '../../components/ActionButton';
import AppTextInput from '../../components/AppTextInput';
import ScreenContainer from '../../components/ScreenContainer';
import { getAvaliacoes, registrarAvaliacao } from '../../data/clinicaApi';
import { colors } from '../../services/theme';

export default function Avaliacoes({ user }) {
  const insets = useSafeAreaInsets();
  const [lista, setLista] = useState([]);
  const [nota, setNota] = useState('5');
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    const av = await getAvaliacoes({ usuarioId: user.id, papel: user.tipo });
    setLista(av);
  }, [user.id, user.tipo]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function enviar() {
    try {
      setLoading(true);
      const n = Number(nota);
      await registrarAvaliacao({
        tipo: user.tipo === 'paciente' ? 'clinica_sessao' : 'estagiario_supervisao',
        nota: n,
        comentario,
        autorId: user.id,
        estagiarioId: user.tipo === 'paciente' ? user.responsavelEstagiarioId ?? null : null,
      });
      setComentario('');
      Alert.alert('Obrigado', 'Avaliação registrada (demonstração).');
      carregar();
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}>
        <Text style={styles.title}>Avaliações</Text>
        <Text style={styles.sub}>
          {user.tipo === 'admin' && 'Visão da coordenação — registros recebidos.'}
          {user.tipo === 'estagiario' && 'Avaliação acadêmica / feedback recebido (demonstração).'}
          {user.tipo === 'paciente' && 'Sua opinião sobre o atendimento e a clínica.'}
        </Text>

        {user.tipo === 'paciente' ? (
          <View style={styles.card}>
            <Text style={styles.label}>Nota (1 a 5)</Text>
            <AppTextInput
              style={styles.input}
              value={nota}
              onChangeText={setNota}
              keyboardType="number-pad"
              maxLength={1}
              placeholderTextColor={colors.muted}
            />
            <Text style={styles.label}>Comentário</Text>
            <AppTextInput
              style={[styles.input, styles.area]}
              value={comentario}
              onChangeText={setComentario}
              multiline
              placeholderTextColor={colors.muted}
              placeholder="Como foi sua experiência?"
            />
            <ActionButton title={loading ? 'Enviando...' : 'Enviar avaliação'} onPress={enviar} disabled={loading} />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.muted}>
              Formulários completos de supervisão podem ser integrados aqui. Por ora, apenas a listagem abaixo.
            </Text>
          </View>
        )}

        <Text style={styles.section}>Registros recentes</Text>
        {lista.map((a) => (
          <View key={a.id} style={styles.item}>
            <Text style={styles.itemTitulo}>
              Nota {a.nota} — {a.tipo}
            </Text>
            {a.comentario ? <Text style={styles.muted}>{a.comentario}</Text> : null}
          </View>
        ))}
        {lista.length === 0 ? <Text style={styles.muted}>Nenhuma avaliação ainda.</Text> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  sub: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: '700',
    marginBottom: 6,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  area: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  section: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  item: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  itemTitulo: {
    fontWeight: '700',
    color: colors.primary,
  },
  muted: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
});
