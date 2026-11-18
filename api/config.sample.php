<?php
// ===================================================
// CONFIGURATION — copiez ce fichier en "config.php" puis remplissez-le.
// config.php contient vos mots de passe : ne le partagez jamais (il est ignoré par git).
// ===================================================

return [
    // Connexion MySQL (fournie par votre hébergeur, ou votre MySQL local)
    'db_host'     => '127.0.0.1',
    'db_port'     => 3306,
    'db_name'     => 'aichata_site',
    'db_user'     => 'root',
    'db_password' => '',

    // Clé demandée une seule fois par api/setup.php pour créer le compte administrateur.
    // Mettez une longue phrase secrète, différente de votre mot de passe.
    'setup_key'   => 'CHANGEZ-MOI-une-longue-phrase-secrete',

    // Taille maximale d'une image envoyée (en Mo)
    'max_upload_mb' => 5,
];
