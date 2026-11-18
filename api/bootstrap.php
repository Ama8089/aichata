<?php
// Socle commun de l'API : configuration, base de données, sessions, réponses JSON, images.
declare(strict_types=1);

// Repli si l'extension mbstring n'est pas activée sur le serveur
if (!function_exists('mb_strlen')) {
    function mb_strlen(string $s): int
    {
        return (int)preg_match_all('/./us', $s);
    }
}

const SITE_ROOT = __DIR__ . '/..';
const UPLOAD_DIR = SITE_ROOT . '/uploads';

function config(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) {
            json_out(['error' => 'Configuration manquante : copiez api/config.sample.php en api/config.php.'], 500);
        }
        $cfg = require $file;
    }
    return $cfg;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $c = config();
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $c['db_host'], (int)$c['db_port'], $c['db_name']);
        try {
            $pdo = new PDO($dsn, $c['db_user'], $c['db_password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            error_log('DB connection failed: ' . $e->getMessage());
            json_out(['error' => 'Connexion à la base de données impossible. Vérifiez api/config.php.'], 500);
        }
    }
    return $pdo;
}

function json_out($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_name('ab_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

/** Bloque la requête si l'administratrice n'est pas connectée (et vérifie le jeton CSRF pour les écritures). */
function require_admin(): int
{
    start_session();
    if (empty($_SESSION['admin_id'])) {
        json_out(['error' => 'Non connecté.'], 401);
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!is_string($sent) || !hash_equals(csrf_token(), $sent)) {
            json_out(['error' => 'Jeton de sécurité invalide. Rechargez la page.'], 403);
        }
    }
    return (int)$_SESSION['admin_id'];
}

function client_ip(): string
{
    return substr((string)($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 45);
}

// ---------- Images ----------

/**
 * Enregistre l'image envoyée dans le champ $field.
 * Retourne le chemin relatif ("uploads/xxxx.jpg"), null si aucun fichier, ou termine avec une erreur 422.
 */
function handle_upload(string $field): ?string
{
    if (empty($_FILES[$field]) || ($_FILES[$field]['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    $f = $_FILES[$field];
    if ($f['error'] !== UPLOAD_ERR_OK) {
        json_out(['error' => 'Échec de l\'envoi de l\'image (code ' . (int)$f['error'] . '). Fichier trop lourd ?'], 422);
    }
    $maxBytes = (int)(config()['max_upload_mb'] ?? 5) * 1024 * 1024;
    if ($f['size'] > $maxBytes) {
        json_out(['error' => 'Image trop lourde (maximum ' . (int)(config()['max_upload_mb'] ?? 5) . ' Mo).'], 422);
    }

    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
    if (!isset($allowed[$mime]) || @getimagesize($f['tmp_name']) === false) {
        json_out(['error' => 'Format non accepté. Utilisez une image JPG, PNG ou WEBP.'], 422);
    }

    if (!is_dir(UPLOAD_DIR) && !mkdir(UPLOAD_DIR, 0755, true)) {
        json_out(['error' => 'Impossible de créer le dossier uploads/.'], 500);
    }

    $ext = $allowed[$mime];
    $name = date('Ymd') . '-' . bin2hex(random_bytes(8)) . '.' . $ext;
    $dest = UPLOAD_DIR . '/' . $name;

    // Ré-encodage avec GD si disponible : redimensionne les très grandes photos et supprime les métadonnées
    if (!reencode_image($f['tmp_name'], $dest, $mime)) {
        if (!move_uploaded_file($f['tmp_name'], $dest)) {
            json_out(['error' => 'Impossible d\'enregistrer l\'image.'], 500);
        }
    }
    return 'uploads/' . $name;
}

function reencode_image(string $src, string $dest, string $mime, int $maxWidth = 1600): bool
{
    if (!extension_loaded('gd')) return false;
    $img = match ($mime) {
        'image/jpeg' => @imagecreatefromjpeg($src),
        'image/png' => @imagecreatefrompng($src),
        'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($src) : false,
        default => false,
    };
    if (!$img) return false;

    $w = imagesx($img);
    $h = imagesy($img);
    if ($w > $maxWidth) {
        $nh = (int)round($h * $maxWidth / $w);
        $resized = imagecreatetruecolor($maxWidth, $nh);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $img, 0, 0, 0, 0, $maxWidth, $nh, $w, $h);
        $img = $resized;
    }
    $ok = match ($mime) {
        'image/jpeg' => imagejpeg($img, $dest, 85),
        'image/png' => (imagesavealpha($img, true) && imagepng($img, $dest, 6)),
        'image/webp' => imagewebp($img, $dest, 85),
    };
    return (bool)$ok;
}

/** Supprime un fichier uniquement s'il a été envoyé via l'admin (dossier uploads/). */
function delete_upload(?string $path): void
{
    if (!$path || !preg_match('#^uploads/[A-Za-z0-9_-]+\.(jpg|png|webp)$#', $path)) return;
    $full = SITE_ROOT . '/' . $path;
    if (is_file($full)) @unlink($full);
}
