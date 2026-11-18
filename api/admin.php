<?php
// API d'administration : api/admin.php?action=...
//   POST login   (email, password)         GET  me
//   POST logout                            GET  list&resource=projects|events|gallery
//   POST save&resource=...  (champs + image, id facultatif → création ou modification)
//   POST delete&resource=... (id)
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/resources.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

function require_method(string $expected): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $expected) {
        json_out(['error' => 'Méthode non autorisée.'], 405);
    }
}

switch ($action) {

    case 'login':
        require_method('POST');
        start_session();
        $pdo = db();
        $ip = client_ip();

        // Limite : 5 tentatives échouées par 15 minutes et par adresse IP
        $pdo->prepare('DELETE FROM login_attempts WHERE attempted_at < (NOW() - INTERVAL 1 DAY)')->execute();
        $st = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND attempted_at > (NOW() - INTERVAL 15 MINUTE)');
        $st->execute([$ip]);
        if ((int)$st->fetchColumn() >= 5) {
            json_out(['error' => 'Trop de tentatives. Réessayez dans 15 minutes.'], 429);
        }

        $email = trim((string)($_POST['email'] ?? ''));
        $password = (string)($_POST['password'] ?? '');
        $st = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = ?');
        $st->execute([$email]);
        $admin = $st->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            $pdo->prepare('INSERT INTO login_attempts (ip) VALUES (?)')->execute([$ip]);
            usleep(400000);
            json_out(['error' => 'E-mail ou mot de passe incorrect.'], 401);
        }

        if (password_needs_rehash($admin['password_hash'], PASSWORD_DEFAULT)) {
            $pdo->prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
                ->execute([password_hash($password, PASSWORD_DEFAULT), $admin['id']]);
        }
        $pdo->prepare('DELETE FROM login_attempts WHERE ip = ?')->execute([$ip]);

        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int)$admin['id'];
        $_SESSION['admin_email'] = $admin['email'];
        unset($_SESSION['csrf']);
        json_out(['ok' => true, 'email' => $admin['email'], 'csrf' => csrf_token()]);

    case 'logout':
        require_method('POST');
        require_admin();
        $_SESSION = [];
        session_destroy();
        json_out(['ok' => true]);

    case 'me':
        start_session();
        if (empty($_SESSION['admin_id'])) {
            json_out(['authenticated' => false]);
        }
        json_out(['authenticated' => true, 'email' => $_SESSION['admin_email'] ?? '', 'csrf' => csrf_token()]);

    case 'list':
        require_method('GET');
        require_admin();
        $res = resource((string)($_GET['resource'] ?? ''));
        $rows = db()->query("SELECT * FROM {$res['table']} ORDER BY {$res['order']}")->fetchAll();
        json_out(['items' => $rows]);

    case 'save':
        require_method('POST');
        require_admin();
        $name = (string)($_GET['resource'] ?? '');
        $res = resource($name);
        $pdo = db();
        $data = clean_fields($res, $_POST);
        $id = filter_var($_POST['id'] ?? '', FILTER_VALIDATE_INT) ?: null;

        if ($name === 'gallery' && $data['event_id'] !== null) {
            $st = $pdo->prepare('SELECT COUNT(*) FROM events WHERE id = ?');
            $st->execute([$data['event_id']]);
            if (!(int)$st->fetchColumn()) $data['event_id'] = null;
        }

        $existing = null;
        if ($id) {
            $st = $pdo->prepare("SELECT * FROM {$res['table']} WHERE id = ?");
            $st->execute([$id]);
            $existing = $st->fetch();
            if (!$existing) json_out(['error' => 'Élément introuvable.'], 404);
        }

        $newImage = handle_upload('image');
        if ($newImage !== null) {
            $data['image'] = $newImage;
        } elseif (!empty($_POST['remove_image']) && empty($res['image_required'])) {
            $data['image'] = null;
        }
        if (!empty($res['image_required']) && $newImage === null && !$existing) {
            json_out(['error' => 'Veuillez choisir une image.'], 422);
        }

        try {
            if ($existing) {
                $sets = implode(', ', array_map(fn($k) => "`$k` = ?", array_keys($data)));
                $st = $pdo->prepare("UPDATE {$res['table']} SET $sets WHERE id = ?");
                $st->execute([...array_values($data), $id]);
                // Ancienne image remplacée ou retirée : on supprime le fichier
                if (array_key_exists('image', $data) && $existing['image'] !== $data['image']) {
                    delete_upload($existing['image']);
                }
            } else {
                $cols = implode(', ', array_map(fn($k) => "`$k`", array_keys($data)));
                $marks = implode(', ', array_fill(0, count($data), '?'));
                $st = $pdo->prepare("INSERT INTO {$res['table']} ($cols) VALUES ($marks)");
                $st->execute(array_values($data));
                $id = (int)$pdo->lastInsertId();
            }
        } catch (PDOException $e) {
            if ($newImage) delete_upload($newImage);
            error_log('Save failed: ' . $e->getMessage());
            json_out(['error' => 'Erreur lors de l\'enregistrement.'], 500);
        }

        $st = $pdo->prepare("SELECT * FROM {$res['table']} WHERE id = ?");
        $st->execute([$id]);
        json_out(['ok' => true, 'item' => $st->fetch()]);

    case 'delete':
        require_method('POST');
        require_admin();
        $res = resource((string)($_GET['resource'] ?? ''));
        $id = filter_var($_POST['id'] ?? '', FILTER_VALIDATE_INT);
        if (!$id) json_out(['error' => 'Identifiant manquant.'], 400);
        $pdo = db();
        $st = $pdo->prepare("SELECT image FROM {$res['table']} WHERE id = ?");
        $st->execute([$id]);
        $row = $st->fetch();
        if (!$row) json_out(['error' => 'Élément introuvable.'], 404);
        $pdo->prepare("DELETE FROM {$res['table']} WHERE id = ?")->execute([$id]);
        delete_upload($row['image'] ?? null);
        json_out(['ok' => true]);

    default:
        json_out(['error' => 'Action inconnue.'], 400);
}
