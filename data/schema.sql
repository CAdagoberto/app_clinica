CREATE DATABASE IF NOT EXISTS login_clinica;
USE login_clinica;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    email VARCHAR(150) UNIQUE,
    senha_hash VARCHAR(255),
    senha VARCHAR(255),
    matricula VARCHAR(50),
    estagio_atual VARCHAR(50),
    cargo ENUM('admin', 'estagiario', 'paciente') NOT NULL,
    telefone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    status ENUM('disponivel', 'ocupada', 'em reforma') DEFAULT 'disponivel'
);

CREATE TABLE IF NOT EXISTS consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estagiario_id INT NOT NULL,
    paciente_id INT NOT NULL,
    data_consulta DATE NOT NULL,
    horario TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'pendente',
    FOREIGN KEY (estagiario_id) REFERENCES usuarios(id),
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS relatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estagiario_id INT NOT NULL,
    paciente_id INT NOT NULL,
    resumo TEXT NOT NULL,
    duvidas TEXT,
    status VARCHAR(30) DEFAULT 'enviado',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (estagiario_id) REFERENCES usuarios(id),
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS exames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_solicitacao DATE NOT NULL,
    status ENUM('pendente', 'anexado') DEFAULT 'pendente',
    arquivo_nome VARCHAR(255),
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS prontuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    estagiario_id INT NOT NULL,
    sessao VARCHAR(20),
    ultimo DATE,
    supervisor VARCHAR(100),
    status VARCHAR(30) DEFAULT 'pendente',
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id),
    FOREIGN KEY (estagiario_id) REFERENCES usuarios(id)
);
