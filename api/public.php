<?php
// API publique (lecture seule) utilisée par le site : GET api/public.php
// Renvoie les projets, événements (à venir / passés) et images de galerie publiés.
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Méthode non autorisée.'], 405);
}

$pdo = db();

$projects = $pdo->query(
    'SELECT id, title, category, description, motto, status, tags, link_url, link_label, image
     FROM projects WHERE is_published = 1 ORDER BY sort_order ASC, id ASC'
)->fetchAll();

$events = $pdo->query(
    'SELECT id, title, location, event_date, description, link_url, image
     FROM events WHERE is_published = 1
     ORDER BY event_date IS NULL, event_date ASC, sort_order ASC, id ASC'
)->fetchAll();

$today = date('Y-m-d');
$upcoming = [];
$past = [];
foreach ($events as $e) {
    if ($e['event_date'] !== null && $e['event_date'] >= $today) {
        $upcoming[] = $e;
    } else {
        $past[] = $e;
    }
}
// Interventions passées : les plus récentes d'abord, celles sans date à la fin
usort($past, function ($a, $b) {
    if ($a['event_date'] === $b['event_date']) return 0;
    if ($a['event_date'] === null) return 1;
    if ($b['event_date'] === null) return -1;
    return strcmp($b['event_date'], $a['event_date']);
});

$gallery = $pdo->query(
    'SELECT g.id, g.image, g.caption, e.title AS event_title
     FROM gallery_images g LEFT JOIN events e ON e.id = g.event_id
     WHERE g.is_published = 1 ORDER BY g.sort_order ASC, g.id DESC'
)->fetchAll();

json_out([
    'projects' => $projects,
    'events' => ['upcoming' => $upcoming, 'past' => $past],
    'gallery' => $gallery,
]);
