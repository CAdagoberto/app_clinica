-- Clínica (API mínima) — MySQL 8.x / MariaDB 10.x
-- Charset recomendado: utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('admin','estagiario','paciente') NOT NULL,
  matricula VARCHAR(40) NULL,
  nivel_estagio TINYINT UNSIGNED NULL,
  ativo TINYINT(1) NULL DEFAULT 1,
  responsavel_estagiario_id INT UNSIGNED NULL,
  telefone VARCHAR(40) NULL DEFAULT '',
  regiao VARCHAR(120) NULL DEFAULT '',
  prontuario VARCHAR(60) NULL DEFAULT '',
  menor_de_idade TINYINT(1) NOT NULL DEFAULT 0,
  responsavel_legal_nome VARCHAR(160) NULL DEFAULT '',
  responsavel_legal_telefone VARCHAR(40) NULL DEFAULT '',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_responsavel FOREIGN KEY (responsavel_estagiario_id) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS salas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  status ENUM('disponivel','ocupada','em reforma') NOT NULL DEFAULT 'disponivel',
  tipo ENUM('atendimento','recepcao','descanso') NOT NULL,
  restricao_consultorio TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consultas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT UNSIGNED NOT NULL,
  estagiario_id INT UNSIGNED NOT NULL,
  sala_id INT UNSIGNED NOT NULL,
  data DATE NOT NULL,
  horario CHAR(5) NOT NULL,
  status ENUM('pendente','confirmado','cancelado') NOT NULL DEFAULT 'pendente',
  pacote_id INT UNSIGNED NULL,
  sessao_numero TINYINT UNSIGNED NULL,
  duracao_minutos SMALLINT UNSIGNED NOT NULL DEFAULT 50,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_consulta_paciente FOREIGN KEY (paciente_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_consulta_estagiario FOREIGN KEY (estagiario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_consulta_sala FOREIGN KEY (sala_id) REFERENCES salas (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS status_pacientes (
  paciente_id INT UNSIGNED PRIMARY KEY,
  status VARCHAR(80) NOT NULL,
  CONSTRAINT fk_status_paciente FOREIGN KEY (paciente_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS relatorios_consulta (
  consulta_id INT UNSIGNED PRIMARY KEY,
  texto TEXT NOT NULL,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_relatorio_consulta FOREIGN KEY (consulta_id) REFERENCES consultas (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notificacoes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  corpo TEXT NOT NULL,
  criada_em DATE NOT NULL,
  lida TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  INDEX idx_notif_usuario (usuario_id, lida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS encaminhamentos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT UNSIGNED NOT NULL,
  tipo ENUM('interno','externo') NOT NULL,
  destino VARCHAR(255) NOT NULL,
  observacao TEXT NULL,
  criado_por_id INT UNSIGNED NOT NULL,
  criado_em DATE NOT NULL,
  CONSTRAINT fk_enc_paciente FOREIGN KEY (paciente_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_enc_autor FOREIGN KEY (criado_por_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS avaliacoes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(80) NOT NULL,
  nota TINYINT UNSIGNED NOT NULL,
  comentario TEXT NOT NULL,
  autor_id INT UNSIGNED NOT NULL,
  estagiario_id INT UNSIGNED NULL,
  criada_em DATE NOT NULL,
  CONSTRAINT fk_aval_autor FOREIGN KEY (autor_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_aval_est FOREIGN KEY (estagiario_id) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS presencas_estagiario (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  estagiario_id INT UNSIGNED NOT NULL,
  data DATE NOT NULL,
  horario_chegada CHAR(5) NOT NULL,
  CONSTRAINT fk_pres_est FOREIGN KEY (estagiario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  INDEX idx_pres_est_data (estagiario_id, data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
