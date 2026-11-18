-- Contenu initial (reprend le contenu actuel du site). Exécuté une seule fois par api/setup.php si les tables sont vides.

INSERT INTO projects (title, category, description, motto, status, tags, link_url, link_label, image, sort_order) VALUES
('AICHATA MINDSET', 'Développement personnel & Leadership',
 'Une initiative dédiée à la connaissance de soi, au mindset, à la discipline, à la confiance en soi et à la transformation personnelle. À travers des contenus éducatifs, des programmes et des événements, AICHATA Mindset encourage chacun à prendre son développement en main.',
 NULL, NULL, NULL, NULL, 'Découvrir AICHATA Mindset', 'images/photos/projet-mindset.jpg', 1),
('WEEK-END DIGITAL', 'Éducation numérique & Autonomie',
 'Un programme éducatif porté par AICHATA Mindset qui vise à sensibiliser les jeunes à l''importance de l''autoformation, de l''apprentissage continu et du développement des compétences numériques. Le programme prévoit des journées de formation pratiques dans les établissements scolaires et universitaires.',
 'Apprendre autrement. Penser autrement. Évoluer autrement.', 'En développement', NULL, NULL, 'En savoir plus', 'images/photos/projet-weekend-digital.jpg', 2),
('AÏCHATA FORMATIONS TECH', 'Formation informatique',
 'Une initiative de formation et de partage de connaissances dans le domaine informatique. Son objectif est de rendre les compétences numériques plus accessibles à travers des formations et des activités éducatives.',
 NULL, NULL, NULL, NULL, 'Voir les formations', 'images/photos/projet-formations-tech.jpg', 3),
('SILLAGE', 'Entrepreneuriat & Innovation',
 'Une initiative entrepreneuriale multiservice développée à Niamey, avec pour ambition de faciliter le quotidien des populations grâce à des services pratiques de livraison, de restauration et de pressing.',
 NULL, NULL, 'Livraison, Restauration, Pressing', NULL, 'Découvrir Sillage', 'images/photos/projet-sillage.jpg', 4);

INSERT INTO events (title, location, event_date, description, sort_order) VALUES
('Conférences à Niamey', 'Niamey', NULL, 'Interventions régulières autour du développement personnel, de l''ambition et de la transformation personnelle.', 1),
('Conférence à Tahoua', 'Tahoua', NULL, 'Sensibilisation et partage de connaissances avec les jeunes.', 2),
('Activités de sensibilisation', 'Niger', NULL, 'Création d''espaces de dialogue et de réflexion sur le développement personnel et l''entrepreneuriat.', 3);
