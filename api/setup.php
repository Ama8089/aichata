<?php
// Installation : crée les tables, le contenu initial et le compte administrateur.
// Ouvrez api/setup.php dans le navigateur une seule fois. Ensuite, la page se verrouille.
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$cfg = config();
$messages = [];
$errors = [];
$done = false;

function setup_pdo(array $cfg): PDO
{
    $opts = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC];
    $base = sprintf('mysql:host=%s;port=%d;charset=utf8mb4', $cfg['db_host'], (int)$cfg['db_port']);
    $pdo = new PDO($base, $cfg['db_user'], $cfg['db_password'], $opts);
    // Sur un hébergement mutualisé la base existe déjà ; en local on la crée si besoin.
    try {
        $pdo->exec('CREATE DATABASE IF NOT EXISTS `' . str_replace('`', '', $cfg['db_name']) . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    } catch (PDOException $e) { /* pas le droit : la base doit déjà exister */ }
    $pdo->exec('USE `' . str_replace('`', '', $cfg['db_name']) . '`');
    return $pdo;
}

function run_sql_file(PDO $pdo, string $file): void
{
    $sql = file_get_contents($file);
    $sql = preg_replace('/^\s*--.*$/m', '', $sql);
    foreach (preg_split('/;\s*(\r?\n|$)/', $sql) as $stmt) {
        if (trim($stmt) !== '') $pdo->exec($stmt);
    }
}

try {
    $pdo = setup_pdo($cfg);
    run_sql_file($pdo, SITE_ROOT . '/database/schema.sql');
    $hasAdmin = (int)$pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn() > 0;
} catch (PDOException $e) {
    error_log('Setup DB error: ' . $e->getMessage());
    $errors[] = 'Connexion MySQL impossible : vérifiez l\'hôte, le nom de la base, l\'utilisateur et le mot de passe dans api/config.php.';
    $hasAdmin = null;
}

if ($hasAdmin === false && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $key = (string)($_POST['setup_key'] ?? '');
    $email = trim((string)($_POST['email'] ?? ''));
    $pass = (string)($_POST['password'] ?? '');
    $pass2 = (string)($_POST['password2'] ?? '');

    if (str_starts_with($cfg['setup_key'], 'CHANGEZ-MOI')) {
        $errors[] = 'Modifiez d\'abord « setup_key » dans api/config.php.';
    } elseif (!hash_equals((string)$cfg['setup_key'], $key)) {
        $errors[] = 'Clé d\'installation incorrecte.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Adresse e-mail invalide.';
    } elseif (mb_strlen($pass) < 10) {
        $errors[] = 'Le mot de passe doit contenir au moins 10 caractères.';
    } elseif ($pass !== $pass2) {
        $errors[] = 'Les deux mots de passe ne correspondent pas.';
    } else {
        $pdo->prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)')
            ->execute([$email, password_hash($pass, PASSWORD_DEFAULT)]);
        if ((int)$pdo->query('SELECT COUNT(*) FROM projects')->fetchColumn() === 0
            && (int)$pdo->query('SELECT COUNT(*) FROM events')->fetchColumn() === 0) {
            run_sql_file($pdo, SITE_ROOT . '/database/seed.sql');
            $messages[] = 'Contenu initial importé (4 projets, 3 interventions).';
        }
        $messages[] = 'Compte administrateur créé.';
        $done = true;
    }
}

function e(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
header('X-Frame-Options: DENY');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex">
    <title>Installation — Administration</title>
    <link rel="stylesheet" href="../admin/admin.css">
</head>
<body class="auth-page">
    <main class="auth-card">
        <div class="auth-brand"><span class="brand-mark">A</span><div><strong>Installation</strong><small>Aichata Boujima — Administration</small></div></div>

        <?php foreach ($errors as $m): ?><div class="alert error"><?= e($m) ?></div><?php endforeach; ?>
        <?php foreach ($messages as $m): ?><div class="alert success"><?= e($m) ?></div><?php endforeach; ?>

        <?php if ($done || $hasAdmin === true): ?>
            <p><?= $done ? 'Installation terminée.' : 'L\'installation est déjà faite : un compte administrateur existe.' ?></p>
            <a class="btn btn-primary btn-block" href="../admin/">Aller à l'administration</a>
        <?php elseif ($hasAdmin === false): ?>
            <p class="muted">Les tables ont été créées. Créez maintenant votre compte administrateur.</p>
            <form method="post" autocomplete="off">
                <label>Clé d'installation <small>(« setup_key » dans api/config.php)</small>
                    <input type="password" name="setup_key" required></label>
                <label>Votre e-mail
                    <input type="email" name="email" value="<?= e((string)($_POST['email'] ?? '')) ?>" required></label>
                <label>Mot de passe <small>(10 caractères minimum)</small>
                    <input type="password" name="password" minlength="10" required autocomplete="new-password"></label>
                <label>Confirmer le mot de passe
                    <input type="password" name="password2" minlength="10" required autocomplete="new-password"></label>
                <button class="btn btn-primary btn-block" type="submit">Créer le compte</button>
            </form>
        <?php endif; ?>
    </main>
</body>
</html>
