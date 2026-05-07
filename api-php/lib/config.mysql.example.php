<?php

/**
 * Copie para config.mysql.php (não versionar credenciais) e ajuste na Hostinger.
 * Uso: require __DIR__ . '/config.mysql.php'; $pdo = clinica_pdo();
 */

declare(strict_types=1);

function clinica_pdo(): PDO
{
    $host = getenv('CLINICA_DB_HOST') ?: '127.0.0.1';
    $port = getenv('CLINICA_DB_PORT') ?: '3306';
    $name = getenv('CLINICA_DB_NAME') ?: 'clinica_app';
    $user = getenv('CLINICA_DB_USER') ?: 'clinica_user';
    $pass = getenv('CLINICA_DB_PASS') ?: '';

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}
