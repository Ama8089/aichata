# Site Web Personnel - Aichata Boujima

**Technology • Mindset • Entrepreneurship**

Site web personnel professionnel présentant Aichata Boujima : Développeuse mobile, Coach en développement personnel et Entrepreneuse.

## 🌟 Caractéristiques

- Design moderne, élégant et professionnel
- Entièrement responsive (mobile, tablette, desktop)
- Navigation fluide avec scroll smooth
- Animations subtiles et élégantes
- Formulaire de contact
- Section blog
- Galerie de conférences
- Optimisé pour le référencement (SEO)

## 📁 Structure du projet

```
My website/
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── script.js           # Fonctionnalités JavaScript
├── data.js             # Données du site (à personnaliser)
├── images/             # Dossier des images
│   ├── ma_photo_-removebg-preview.png
│   └── Aichata_Logo-removebg-preview.png
└── README.md           # Ce fichier
```

## 🚀 Installation et utilisation

### Option 1 : Utilisation simple (recommandée)

1. Ouvrez simplement `index.html` dans votre navigateur
2. Le site fonctionne immédiatement !

### Option 2 : Serveur local (pour tester comme en production)

Si vous avez Python installé :

```bash
# Python 3
python -m http.server 8000

# Puis ouvrez : http://localhost:8000
```

Avec Node.js et npx :

```bash
npx serve .

# Puis ouvrez l'URL indiquée
```

## ⚙️ Personnalisation

### 1. Modifier les informations personnelles

Ouvrez le fichier `data.js` et modifiez :

```javascript
const siteData = {
    personal: {
        email: "votre-email@example.com",
        phone: "227XXXXXXXX",
    },
    social: {
        linkedin: "https://www.linkedin.com/in/votre-profil",
        facebook: "https://www.facebook.com/votre-profil",
        tiktok: "https://www.tiktok.com/@votre-profil",
        github: "https://github.com/votre-profil",
        whatsapp: "https://wa.me/227XXXXXXXX",
    },
    // ... autres données
};
```

### 2. Ajouter des articles de blog

Dans `data.js`, ajoutez vos articles :

```javascript
blogPosts: [
    {
        title: "Titre de votre article",
        category: "Développement personnel",
        excerpt: "Courte description...",
        date: "2024-01-15",
        link: "#"
    },
    // Ajoutez plus d'articles...
]
```

### 3. Ajouter des photos de conférences

1. Placez vos photos dans le dossier `images/`
2. Dans `data.js`, ajoutez les chemins :

```javascript
conferencePhotos: [
    "./images/conference1.jpg",
    "./images/conference2.jpg",
    // ...
]
```

### 4. Configurer le formulaire de contact

**Méthode recommandée : FormSpree (gratuit)**

1. Créez un compte sur [FormSpree.io](https://formspree.io)
2. Créez un nouveau formulaire
3. Copiez votre Form ID
4. Dans `script.js` (ligne 131), décommentez et configurez :

```javascript
const response = await fetch('https://formspree.io/f/VOTRE_FORM_ID', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
});
```

**Alternatives :**
- [EmailJS](https://www.emailjs.com/) - Gratuit
- [Netlify Forms](https://www.netlify.com/products/forms/) - Si hébergé sur Netlify
- Web3Forms, Basin, etc.

### 5. Modifier les couleurs

Dans `styles.css`, modifiez les variables CSS :

```css
:root {
    --color-emerald: #00866A;
    --color-dark-green: #063D35;
    --color-gold: #D4AF37;
    /* ... */
}
```

## 🌐 Déploiement

### Option 1 : GitHub Pages (Gratuit et recommandé)

1. Créez un compte GitHub si vous n'en avez pas
2. Créez un nouveau repository : `votre-username.github.io`
3. Uploadez tous les fichiers
4. Allez dans Settings > Pages
5. Sélectionnez la branche `main` et le dossier `/ (root)`
6. Cliquez sur Save
7. Votre site sera accessible à : `https://votre-username.github.io`

**Via Git :**

```bash
git init
git add .
git commit -m "Premier commit"
git branch -M main
git remote add origin https://github.com/votre-username/votre-username.github.io.git
git push -u origin main
```

### Option 2 : Netlify (Gratuit)

1. Créez un compte sur [Netlify](https://www.netlify.com)
2. Glissez-déposez le dossier du site dans Netlify Drop
3. Votre site est en ligne instantanément !
4. Vous pouvez configurer un nom de domaine personnalisé

### Option 3 : Vercel (Gratuit)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre projet depuis GitHub ou uploadez directement
3. Le site est déployé automatiquement

### Domaine personnalisé

Une fois déployé, vous pouvez :
- Acheter un domaine (ex: aichataboujima.com) sur Namecheap, GoDaddy, etc.
- Le connecter à votre hébergement (GitHub Pages, Netlify, ou Vercel)

## 🎨 Personnalisation avancée

### Ajouter une nouvelle section

1. Dans `index.html`, ajoutez votre section :

```html
<section id="ma-nouvelle-section" class="ma-section">
    <div class="container">
        <h2 class="section-title">Mon titre</h2>
        <!-- Votre contenu -->
    </div>
</section>
```

2. Dans `styles.css`, ajoutez les styles
3. Ajoutez le lien dans la navigation

### Modifier la typographie

Changez les Google Fonts dans `index.html` :

```html
<link href="https://fonts.googleapis.com/css2?family=VotreFont:wght@400;700&display=swap" rel="stylesheet">
```

Puis dans `styles.css` :

```css
:root {
    --font-primary: 'VotreFont', sans-serif;
}
```

## 📱 Réseaux sociaux

N'oubliez pas de :
- Partager votre site sur vos réseaux
- Ajouter le lien dans vos bios Instagram, TikTok, etc.
- L'utiliser sur vos cartes de visite

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec variables CSS, Grid, Flexbox
- **JavaScript** : Interactivité et animations
- **Google Fonts** : Typographie professionnelle

## 📊 Optimisations SEO

Le site inclut :
- Balises meta pour SEO
- Open Graph pour les réseaux sociaux
- Structure sémantique HTML5
- Temps de chargement optimisé
- Design responsive

### Améliorations SEO supplémentaires :

1. Ajoutez un fichier `sitemap.xml`
2. Créez un fichier `robots.txt`
3. Connectez votre site à Google Search Console
4. Configurez Google Analytics

## 🐛 Dépannage

### Le site ne s'affiche pas correctement
- Vérifiez que tous les fichiers sont au bon endroit
- Ouvrez la console du navigateur (F12) pour voir les erreurs

### Les images ne s'affichent pas
- Vérifiez les chemins dans le code
- Assurez-vous que les images sont dans le dossier `images/`

### Le formulaire ne fonctionne pas
- Configurez FormSpree ou une alternative (voir section Personnalisation)

## 📞 Support

Pour toute question ou problème :
- Vérifiez d'abord ce README
- Consultez les commentaires dans le code
- Recherchez sur Stack Overflow ou les forums de développement

## 📝 Licence

© 2024 BOUJIMA BANITAN Aichata. Tous droits réservés.

---

**Fait avec ❤️ pour Aichata Boujima**

*Apprendre, construire, entreprendre et inspirer.*
