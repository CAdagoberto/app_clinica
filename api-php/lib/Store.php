<?php

declare(strict_types=1);

/**
 * Armazenamento em JSON (bom para protótipo / faculdade).
 * Quando integrar com MySQL: substitua as chamadas a Store por PDO usando
 * schema_mysql.sql + lib/config.mysql.example.php (renomear para config.mysql.php).
 */

final class Store
{
    private string $file;
    private string $seed;

    public function __construct()
    {
        $base = dirname(__DIR__);
        $this->file = $base . '/data/state.json';
        $this->seed = $base . '/data/seed.json';
    }

    public function read(): array
    {
        if (!is_file($this->file)) {
            if (!is_file($this->seed)) {
                throw new RuntimeException('seed.json não encontrado.');
            }
            copy($this->seed, $this->file);
        }
        $raw = file_get_contents($this->file);
        if ($raw === false || $raw === '') {
            throw new RuntimeException('state.json inválido.');
        }
        $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        return $data;
    }

    public function write(array $data): void
    {
        $dir = dirname($this->file);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $tmp = $this->file . '.tmp';
        file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        rename($tmp, $this->file);
    }

    public function transaction(callable $fn): mixed
    {
        $fp = fopen($this->file, 'c+');
        if ($fp === false) {
            throw new RuntimeException('Não foi possível abrir state.json');
        }
        try {
            if (!flock($fp, LOCK_EX)) {
                throw new RuntimeException('Lock falhou.');
            }
            rewind($fp);
            $content = stream_get_contents($fp);
            if ($content === false || $content === '') {
                $data = json_decode(file_get_contents($this->seed), true, 512, JSON_THROW_ON_ERROR);
            } else {
                $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
            }
            $result = $fn($data);
            rewind($fp);
            ftruncate($fp, 0);
            fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            fflush($fp);
            flock($fp, LOCK_UN);
            return $result;
        } finally {
            fclose($fp);
        }
    }
}
