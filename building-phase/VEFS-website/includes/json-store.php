<?php
declare(strict_types=1);

/**
 * Read a JSON file and return decoded array. Throws if file missing or invalid JSON.
 */
function json_store_read(string $path): array {
    if (!is_file($path)) {
        throw new RuntimeException("JSON file not found: $path");
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        throw new RuntimeException("Failed to read: $path");
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        throw new RuntimeException("Not valid JSON: $path");
    }
    return $data;
}

/**
 * Atomically write JSON. Steps:
 *   1. Open with LOCK_EX
 *   2. Read & validate current content (refuses to overwrite corrupt JSON)
 *   3. Copy current to backups/<basename>-YYYYMMDD-HHMMSS-<microsec>.json
 *   4. Write new content to <path>.tmp
 *   5. rename() tmp -> live (atomic on POSIX)
 *   6. Release lock
 *   7. Prune backups to newest 20
 */
function json_store_write(string $path, array $data, string $backupDir): void {
    if (!is_file($path)) {
        throw new RuntimeException("JSON file not found: $path");
    }
    if (!is_dir($backupDir)) {
        throw new RuntimeException("Backup dir missing: $backupDir");
    }

    $fp = fopen($path, 'c+');
    if ($fp === false) throw new RuntimeException("Cannot open: $path");

    try {
        if (!flock($fp, LOCK_EX)) {
            throw new RuntimeException("Cannot lock: $path");
        }

        $current = stream_get_contents($fp);
        $decoded = json_decode($current, true);
        if (!is_array($decoded)) {
            throw new RuntimeException("current file is not valid JSON: $path");
        }

        // Backup current content
        $base = pathinfo($path, PATHINFO_FILENAME);
        [$usec, $sec] = explode(' ', microtime());
        $stamp = date('Ymd-His', (int)$sec) . '-' . substr($usec, 2, 6);
        $backupPath = rtrim($backupDir, '/\\') . DIRECTORY_SEPARATOR . $base . '-' . $stamp . '.json';
        if (file_put_contents($backupPath, $current) === false) {
            throw new RuntimeException("Backup failed: $backupPath");
        }

        // Write the new content in place while holding the lock. rename() over an
        // open+locked file fails on Windows, so we truncate-and-write instead of the
        // POSIX tmp+rename trick. The exclusive lock still guarantees no concurrent
        // writer sees a partial file.
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($json === false) throw new RuntimeException("json_encode failed");

        if (DIRECTORY_SEPARATOR === '\\') {
            // Windows: write through the already-open, locked handle.
            if (!ftruncate($fp, 0)) throw new RuntimeException("Cannot truncate: $path");
            rewind($fp);
            if (fwrite($fp, $json) === false) throw new RuntimeException("Cannot write: $path");
            fflush($fp);
        } else {
            // POSIX: atomic tmp + rename.
            $tmp = $path . '.tmp';
            if (file_put_contents($tmp, $json) === false) {
                throw new RuntimeException("Cannot write tmp: $tmp");
            }
            if (!rename($tmp, $path)) {
                @unlink($tmp);
                throw new RuntimeException("Rename failed: $tmp -> $path");
            }
        }
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }

    // Prune backups
    $pattern = rtrim($backupDir, '/\\') . DIRECTORY_SEPARATOR . pathinfo($path, PATHINFO_FILENAME) . '-*.json';
    $files = glob($pattern) ?: [];
    if (count($files) > 20) {
        sort($files); // oldest first (timestamp prefix sorts chronologically)
        $toDelete = array_slice($files, 0, count($files) - 20);
        foreach ($toDelete as $f) @unlink($f);
    }
}
