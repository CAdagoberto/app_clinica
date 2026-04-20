import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../services/theme';

export default function ConsultaCard({ consulta, children, onPress }) {
  const Container = onPress ? Pressable : View;

  return (
    <Container style={styles.card} onPress={onPress}>
      <Text style={styles.title}>Consulta #{consulta.id}</Text>
      <Text style={styles.info}>Paciente: {consulta.pacienteNome}</Text>
      <Text style={styles.info}>Estagiário: {consulta.estagiarioNome}</Text>
      <Text style={styles.info}>Sala: {consulta.salaNome}</Text>
      <Text style={styles.info}>
        Data: {consulta.data} - Horário: {consulta.horario}
      </Text>
      <Text style={styles.status}>Status: {consulta.status}</Text>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  status: {
    marginTop: 8,
    fontWeight: '600',
    color: colors.primary,
  },
});
