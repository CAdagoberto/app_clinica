import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionButton from '../../components/ActionButton';
import ScreenContainer from '../../components/ScreenContainer';
import {
  criarEncaminhamento,
  getEncaminhamentosDoEstagiario,
  getEncaminhamentosPorPaciente,
  getEncaminhamentosTodos,
} from '../../data/clinicaApi';
import { colors } from '../../services/theme';

export default function Encaminhamentos({ route, user }) {
  const insets = useSafeAreaInsets();
  const pacienteIdParam = route.params?.pacienteId;
  const pacienteNome = route.params?.pacienteNome;

  const [lista, setLista] = useState([]);
  const [tipo, setTipo] = useState('interno');
  const [destino, setDestino] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    let dados;
    if (user.tipo === 'admin') {
      dados = await getEncaminhamentosTodos();
    } else if (pacienteIdParam) {
      dados = await getEncaminhamentosPorPaciente(pacienteIdParam);
    } else {
      dados = await getEncaminhamentosDoEstagiario(user.id);
    }
    setLista(dados);
  }, [user.id, user.tipo, pacienteIdParam]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function handleSalvar() {
    if (!pacienteIdParam) {
      Alert.alert('Atenção', 'Abra esta tela a partir do prontuário de um paciente para registrar encaminhamento.');
      return;
    }
    if (!destino.trim()) {
      Alert.alert('Atenção', 'Informe o destino.');
      return;
    }
    try {
      setLoading(true);
      await criarEncaminhamento({
        pacienteId: pacienteIdParam,
        tipo,
        destino,
        observacao,
        criadoPorId: user.id,
      });
      setDestino('');
      setObservacao('');
      Alert.alert('Sucesso', 'Encaminhamento registrado.');
      carregar();
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Encaminhamentos</Text>
        <Text style={styles.sub}>
          Encaminhamento interno (outro estagiário) ou externo (serviço fora da clínica), conforme escopo.
        </Text>

        {pacienteIdParam ? (
          <View style={styles.card}>
            <Text style={styles.label}>Paciente</Text>
            <Text style={styles.destaque}>{pacienteNome || `ID ${pacienteIdParam}`}</Text>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.row}>
              {['interno', 'externo'].map((t) => (
                <Pressable
                  key={t}
                  style={[styles.chip, tipo === t && styles.chipAtivo]}
                  onPress={() => setTipo(t)}
                >
                  <Text style={[styles.chipText, tipo === t && styles.chipTextAtivo]}>
                    {t === 'interno' ? 'Interno' : 'Externo'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.label}>Destino</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do estagiário ou serviço externo"
              placeholderTextColor={colors.muted}
              value={destino}
              onChangeText={setDestino}
            />
            <Text style={styles.label}>Observação</Text>
            <TextInput
              style={[styles.input, styles.area]}
              placeholder="Detalhes relevantes"
              placeholderTextColor={colors.muted}
              value={observacao}
              onChangeText={setObservacao}
              multiline
            />
            <ActionButton title={loading ? 'Salvando...' : 'Registrar'} onPress={handleSalvar} disabled={loading} />
          </View>
        ) : user.tipo === 'estagiario' ? (
          <Text style={styles.hint}>Use o menu Pacientes → abra o prontuário → &quot;Novo encaminhamento&quot;.</Text>
        ) : null}

        <Text style={styles.section}>Registros</Text>
        {lista.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemTipo}>{item.tipo} — paciente #{item.pacienteId}</Text>
            <Text style={styles.itemDest}>{item.destino}</Text>
            {item.observacao ? <Text style={styles.muted}>{item.observacao}</Text> : null}
          </View>
        ))}
        {lista.length === 0 ? <Text style={styles.muted}>Nenhum encaminhamento.</Text> : null}
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
    color: colors.text,
    marginBottom: 6,
    marginTop: 8,
  },
  destaque: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  area: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  section: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  item: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  itemTipo: {
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  itemDest: {
    color: colors.text,
  },
  muted: {
    color: colors.muted,
    marginTop: 4,
  },
  hint: {
    color: colors.muted,
    marginBottom: 12,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontWeight: '700',
    color: colors.text,
  },
  chipTextAtivo: {
    color: '#fff',
  },
});
