// ===================================
// FICHIER DE DONNÉES
// Modifiez ce fichier pour mettre à jour les informations du site
// ===================================

const siteData = {
    // Informations personnelles
    personal: {
        name: "BOUJIMA BANITAN Aichata",
        displayName: "Aichata Boujima", // Nom affiché sur le site
        title: "Développeuse mobile, Coach en développement personnel et Entrepreneuse",
        tagline: "Technology • Mindset • Entrepreneurship",
        motto: "Apprendre, construire, entreprendre et inspirer",
        email: "", // Ajoutez votre email ici
        phone: "+227 77 90 78 07", // Numéro WhatsApp
    },

    // API de la base de données MySQL (projets, événements, galerie gérés depuis /admin)
    // Si l'API ne répond pas (site ouvert sans serveur PHP), le contenu écrit dans les pages HTML est affiché.
    apiUrl: "api/public.php",

    // Formulaire de contact (Formspree)
    // 1. Créez un compte sur https://formspree.io et un formulaire
    // 2. Copiez l'identifiant du formulaire (ex : "xyzabcde" dans https://formspree.io/f/xyzabcde)
    // 3. Collez-le ci-dessous entre les guillemets — c'est tout !
    formspreeId: "",

    // Réseaux sociaux
    // Mettez "#" ou "" pour masquer un réseau sur tout le site
    social: {
        linkedin: "#", // Ajoutez votre lien LinkedIn ici
        instagram: "https://www.instagram.com/aichatamindset?xtok=azlzYms4MHIwdjZh&utm_source=qr",
        tiktok: "https://www.tiktok.com/@aichata.mindset",
        github: "#", // Ajoutez votre lien GitHub ici si vous en avez un
        whatsapp: "https://whatsapp.com/channel/0029VbB87nA4yltXDLOcxP0X", // Chaîne WhatsApp
        whatsappChat: "https://wa.me/22777907807", // Discussion directe sur WhatsApp
    },

    // Articles de blog
    // Ajoutez vos articles ici
    blogPosts: [
        // Exemple d'article (décommentez et modifiez pour ajouter des articles):
        // {
        //     title: "Titre de l'article",
        //     category: "Développement personnel",
        //     excerpt: "Courte description de l'article...",
        //     date: "2024-01-15",
        //     link: "#"
        // }
    ],

    // Galerie de conférences
    // Ajoutez les chemins vers vos photos de conférences
    conferencePhotos: [
        // Exemple (décommentez et modifiez):
        // "./images/conference1.jpg",
        // "./images/conference2.jpg",
    ],

    // Projets additionnels
    // Vous pouvez ajouter plus de détails sur vos projets ici
    projects: {
        aichataMindset: {
            url: "#", // Lien vers le site/page AICHATA Mindset
        },
        weekendDigital: {
            url: "#", // Lien vers les informations du programme
        },
        formationsTech: {
            url: "#", // Lien vers vos formations
        },
        sillage: {
            url: "#", // Lien vers Sillage
        }
    }
};

// Export pour utilisation dans script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteData;
}
