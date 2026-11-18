# 🎨 Guide de Personnalisation Rapide

Bienvenue Aichata ! Voici comment personnaliser rapidement ton site web.

## ✅ Déjà configuré

- ✅ Nom complet : BOUJIMA BANITAN Aichata
- ✅ Instagram : https://www.instagram.com/aichatamindset
- ✅ TikTok : https://www.tiktok.com/@aichata.mindset
- ✅ WhatsApp Channel : https://whatsapp.com/channel/0029VbB87nA4yltXDLOcxP0X
- ✅ Tes deux images (photo profil + logo AICHATA MINDSET)

## 📋 À faire maintenant

### 1. Ajouter ton email et tes autres liens (2 min)

Ouvre le fichier `data.js` et complète :

```javascript
personal: {
    email: "ton-email@example.com", // ⬅️ Ajoute ton email ici
},
social: {
    linkedin: "https://www.linkedin.com/in/ton-profil", // ⬅️ Si tu as LinkedIn
    github: "https://github.com/ton-profil", // ⬅️ Si tu as GitHub (optionnel)
}
```

### 2. Tester le site localement (1 min)

**Option simple :**
- Double-clique sur `index.html`
- Le site s'ouvre dans ton navigateur

**Option avec serveur (recommandé) :**
Si tu as Python installé :
```bash
python -m http.server 8000
```
Puis ouvre : http://localhost:8000

### 3. Configurer le formulaire de contact (5 min)

**Étape 1 :** Va sur https://formspree.io
**Étape 2 :** Créer un compte gratuit
**Étape 3 :** Créer un nouveau formulaire
**Étape 4 :** Copie ton Form ID (ressemble à : `xyzabc123`)
**Étape 5 :** Dans `script.js`, ligne 105, remplace :

```javascript
// Décommente ces lignes et remplace YOUR_FORM_ID
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
});
```

### 4. Ajouter des photos de tes conférences (3 min)

**Étape 1 :** Copie tes photos dans le dossier `images/`
Nomme-les par exemple : `conference1.jpg`, `conference2.jpg`, etc.

**Étape 2 :** Dans `data.js`, ajoute les chemins :

```javascript
conferencePhotos: [
    "./images/conference1.jpg",
    "./images/conference2.jpg",
    "./images/conference3.jpg",
]
```

Les photos apparaîtront automatiquement dans la section Conférences !

### 5. Ajouter des articles de blog (optionnel)

Dans `data.js`, ajoute tes articles :

```javascript
blogPosts: [
    {
        title: "Comment développer son mindset entrepreneurial",
        category: "Développement personnel",
        excerpt: "Les clés pour adopter un état d'esprit orienté vers la réussite...",
        date: "2024-01-20",
        link: "#" // ou le lien vers ton article complet
    },
    {
        title: "Mon parcours en développement mobile",
        category: "Technologie",
        excerpt: "De mes débuts à aujourd'hui, retour sur mon apprentissage...",
        date: "2024-01-15",
        link: "#"
    }
]
```

## 🚀 Mettre le site en ligne (15 min)

### Option 1 : GitHub Pages (GRATUIT et recommandé)

**Étape 1 :** Créer un compte GitHub
- Va sur https://github.com
- Inscris-toi (gratuit)

**Étape 2 :** Créer un nouveau repository
- Clique sur "New repository"
- Nomme-le : `aichata-boujima.github.io` (ou ton-username.github.io)
- Public
- Ne pas initialiser avec README

**Étape 3 :** Uploader les fichiers
- Dans le repository, clique sur "uploading an existing file"
- Glisse-dépose TOUS les fichiers de ton site
- Clique sur "Commit changes"

**Étape 4 :** Activer GitHub Pages
- Va dans Settings > Pages
- Source : Deploy from a branch
- Branch : main, / (root)
- Save

**Étape 5 :** Attendre 2-3 minutes
- Ton site sera disponible à : https://ton-username.github.io

### Option 2 : Netlify (Plus simple, GRATUIT)

**Étape 1 :** Va sur https://www.netlify.com
**Étape 2 :** Inscris-toi (gratuit)
**Étape 3 :** Glisse-dépose le dossier complet du site
**Étape 4 :** C'est en ligne ! 🎉

Tu peux ensuite changer le nom du site dans les paramètres.

### Option 3 : Vercel (GRATUIT)

Même principe que Netlify :
1. https://vercel.com
2. Inscris-toi
3. Import project
4. Deploie

## 🎯 Prochaines étapes (optionnel)

### Acheter un nom de domaine personnalisé
- Exemples : aichataboujima.com, aichatamindset.com
- Sites : Namecheap, GoDaddy (environ 10-15$/an)
- Puis connecte-le à GitHub Pages/Netlify/Vercel

### Ajouter Google Analytics
Pour voir combien de personnes visitent ton site :
1. Créer un compte Google Analytics
2. Obtenir ton code de suivi
3. L'ajouter dans `index.html` juste avant `</head>`

### Créer un sitemap.xml
Pour améliorer ton référencement Google.

## 📱 Partager ton site

Une fois en ligne, partage le lien :
- ✅ Sur ton Instagram (lien dans la bio)
- ✅ Sur ton TikTok (lien dans la bio)
- ✅ Sur ton WhatsApp Channel
- ✅ Sur LinkedIn
- ✅ Dans tes signatures d'email
- ✅ Sur tes cartes de visite

## ❓ Besoin d'aide ?

### Le site ne s'affiche pas bien
- Vide le cache du navigateur (Ctrl + F5)
- Teste sur un autre navigateur
- Vérifie la console (F12) pour voir les erreurs

### Une image ne s'affiche pas
- Vérifie que l'image est bien dans le dossier `images/`
- Vérifie l'orthographe du nom du fichier
- Les noms de fichiers sont sensibles à la casse

### Le formulaire ne fonctionne pas
- Tu dois d'abord configurer FormSpree (voir étape 3 ci-dessus)
- Vérifie que ton Form ID est correct

## 📁 Structure des fichiers

```
My website/
├── index.html              ⬅️ Page principale (ne pas modifier sauf besoin)
├── styles.css              ⬅️ Design (modifier pour changer les couleurs)
├── script.js               ⬅️ Fonctionnalités (configure FormSpree ici)
├── data.js                 ⬅️ TES DONNÉES (email, articles, etc.) ⭐
├── images/
│   ├── ma_photo_-removebg-preview.png
│   ├── Aichata_Logo-removebg-preview.png
│   └── [tes futures photos de conférences]
├── README.md
├── GUIDE_PERSONNALISATION.md  ⬅️ Ce fichier
└── .gitignore
```

## 🎨 Personnaliser les couleurs

Dans `styles.css`, lignes 7-12, change les couleurs si tu veux :

```css
:root {
    --color-emerald: #00866A;      /* Vert principal */
    --color-dark-green: #063D35;   /* Vert foncé */
    --color-gold: #D4AF37;         /* Doré (accents) */
    --color-white: #FFFFFF;        /* Blanc */
    --color-light-gray: #F5F7F6;   /* Gris clair */
    --color-soft-black: #202725;   /* Noir doux */
}
```

## ✨ Conseils finaux

1. **Teste sur mobile** : Ouvre le site sur ton téléphone pour vérifier
2. **Demande des retours** : Montre le site à des amis/collègues
3. **Mets à jour régulièrement** : Ajoute des articles, des photos de conférences
4. **Sauvegarde** : Garde une copie de tous les fichiers

---

**Ton site est prêt ! Il ne reste plus qu'à le personnaliser et le mettre en ligne. 🚀**

Si tu as des questions, relis ce guide ou le README.md principal.

**Bonne chance avec ton site web professionnel !** 💪✨
