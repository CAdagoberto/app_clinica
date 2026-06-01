import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ConsultaStatusBadge } from './StatusBadge';
import { colors, radii, shadows, typography } from '../services/theme';

export default function ConsultaCard({ consulta, children, onPress }) {
  const statusStyle = consulta.status === 'confirmado'
    ? colors.success
    : consulta.status === 'cancelado'
      ? colors.error
      : colors.warning;
  const content = (
    <>
      <View style={[styles.statusBar, { backgroundColor: statusStyle }]} />
      <View style={styles.body}>
        <Text style={styles.title}>Consulta #{consulta.id}</Text>
        {consulta.sessaoNumero != null && consulta.pacoteId != null ? (
          <Text style={styles.sessao}>Sessão {consulta.sessaoNumero} de 10</Text>
        ) : null}
        <Text style={styles.info}>Paciente: {consulta.pacienteNome}</Text>
        <Text style={styles.info}>Estagiário: {consulta.estagiarioNome}</Text>
        <Text style={styles.info}>Sala: {consulta.salaNome}</Text>
        <Text style={styles.info}>
          Data: {consulta.data} — Horário: {consulta.horario}
        </Text>
        <ConsultaStatusBadge status={consulta.status} />
        {children}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.cardMd,
    marginBottom: 14,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ translateY: -2 }],
  },
  statusBar: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.fontBold,
    color: colors.primary,
    marginBottom: 6,
  },
  sessao: {
    fontSize: 13,
    fontFamily: typography.fontSemiBold,
    color: colors.muted,
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    fontFamily: typography.fontRegular,
    color: colors.text,
    marginBottom: 2,
    lineHeight: 20,
  },
});
