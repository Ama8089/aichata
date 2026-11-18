<?php
// Description des tables modifiables depuis l'administration.
// type : string (max), text, url, date, int, bool
declare(strict_types=1);

const RESOURCES = [
    'projects' => [
        'table' => 'projects',
        'order' => 'sort_order ASC, id ASC',
        'fields' => [
            'title'        => ['type' => 'string', 'max' => 150, 'required' => true, 'label' => 'Titre'],
            'category'     => ['type' => 'string', 'max' => 150, 'label' => 'Catégorie'],
            'description'  => ['type' => 'text', 'label' => 'Description'],
            'motto'        => ['type' => 'string', 'max' => 255, 'label' => 'Devise'],
            'status'       => ['type' => 'string', 'max' => 60, 'label' => 'Statut'],
            'tags'         => ['type' => 'string', 'max' => 255, 'label' => 'Étiquettes'],
            'link_url'     => ['type' => 'url', 'label' => 'Lien'],
            'link_label'   => ['type' => 'string', 'max' => 100, 'label' => 'Texte du bouton'],
            'sort_order'   => ['type' => 'int', 'label' => "Ordre d'affichage"],
            'is_published' => ['type' => 'bool'],
        ],
    ],
    'events' => [
        'table' => 'events',
        'order' => 'event_date IS NULL, event_date ASC, sort_order ASC, id ASC',
        'fields' => [
            'title'        => ['type' => 'string', 'max' => 150, 'required' => true, 'label' => 'Titre'],
            'location'     => ['type' => 'string', 'max' => 150, 'label' => 'Lieu'],
            'event_date'   => ['type' => 'date', 'label' => 'Date'],
            'description'  => ['type' => 'text', 'label' => 'Description'],
            'link_url'     => ['type' => 'url', 'label' => 'Lien'],
            'sort_order'   => ['type' => 'int', 'label' => "Ordre d'affichage"],
            'is_published' => ['type' => 'bool'],
        ],
    ],
    'gallery' => [
        'table' => 'gallery_images',
        'order' => 'sort_order ASC, id DESC',
        'image_required' => true,
        'fields' => [
            'caption'      => ['type' => 'string', 'max' => 255, 'label' => 'Légende'],
            'event_id'     => ['type' => 'int', 'nullable' => true, 'label' => 'Événement'],
            'sort_order'   => ['type' => 'int', 'label' => "Ordre d'affichage"],
            'is_published' => ['type' => 'bool'],
        ],
    ],
];

function resource(string $name): array
{
    if (!isset(RESOURCES[$name])) {
        json_out(['error' => 'Ressource inconnue.'], 400);
    }
    return RESOURCES[$name];
}

/** Valide et nettoie les champs envoyés ($src = $_POST). Termine avec une erreur 422 si invalide. */
function clean_fields(array $res, array $src): array
{
    $out = [];
    foreach ($res['fields'] as $name => $def) {
        $raw = $src[$name] ?? null;
        $raw = is_string($raw) ? trim($raw) : $raw;
        $label = $def['label'] ?? $name;
        if (is_array($raw) || (is_string($raw) && !preg_match('//u', $raw))) {
            json_out(['error' => "Le champ « $label » contient des caractères invalides."], 422);
        }

        switch ($def['type']) {
            case 'bool':
                $out[$name] = in_array($raw, ['1', 'true', 'on', 1, true], true) ? 1 : 0;
                break;
            case 'int':
                if ($raw === null || $raw === '') {
                    $out[$name] = !empty($def['nullable']) ? null : 0;
                } elseif (filter_var($raw, FILTER_VALIDATE_INT) === false) {
                    json_out(['error' => "Le champ « $label » doit être un nombre entier."], 422);
                } else {
                    $out[$name] = (int)$raw;
                }
                break;
            case 'date':
                if ($raw === null || $raw === '') {
                    $out[$name] = null;
                } else {
                    $d = DateTime::createFromFormat('!Y-m-d', (string)$raw);
                    if (!$d || $d->format('Y-m-d') !== $raw) {
                        json_out(['error' => "Date invalide pour « $label » (format AAAA-MM-JJ)."], 422);
                    }
                    $out[$name] = $raw;
                }
                break;
            case 'url':
                if ($raw === null || $raw === '') {
                    $out[$name] = null;
                } elseif (!preg_match('#^https?://#i', (string)$raw) || filter_var($raw, FILTER_VALIDATE_URL) === false || mb_strlen((string)$raw) > 500) {
                    json_out(['error' => "Lien invalide pour « $label » : il doit commencer par http:// ou https://"], 422);
                } else {
                    $out[$name] = $raw;
                }
                break;
            default: // string / text
                $val = ($raw === null) ? '' : (string)$raw;
                if (isset($def['max']) && mb_strlen($val) > $def['max']) {
                    json_out(['error' => "« $label » est trop long ({$def['max']} caractères maximum)."], 422);
                }
                $out[$name] = ($val === '') ? null : $val;
        }

        if (!empty($def['required']) && ($out[$name] === null || $out[$name] === '')) {
            json_out(['error' => "Le champ « $label » est obligatoire."], 422);
        }
    }
    return $out;
}
