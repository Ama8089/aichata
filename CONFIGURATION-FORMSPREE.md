# 📧 Configuration du Formulaire de Contact avec FormSpree

## 🎯 Objectif
Activer le formulaire de contact sur votre site pour recevoir les messages directement dans votre email.

---

## ✅ ÉTAPE 1 : Créer un compte FormSpree (2 minutes)

### 1. Aller sur FormSpree
🔗 **Lien :** https://formspree.io

### 2. S'inscrire (gratuit)
- Cliquez sur **"Sign Up"** (en haut à droite)
- Choisissez **"Sign up with Email"**
- Entrez votre email (celui où vous voulez recevoir les messages)
- Créez un mot de passe
- Cliquez sur **"Create Account"**

### 3. Vérifier votre email
- Ouvrez votre boîte email
- Cherchez l'email de FormSpree
- Cliquez sur le lien de vérification

✅ **Compte créé !**

---

## ✅ ÉTAPE 2 : Créer un formulaire (1 minute)

### 1. Se connecter à FormSpree
- Allez sur https://formspree.io
- Connectez-vous avec vos identifiants

### 2. Créer un nouveau formulaire
- Cliquez sur **"+ New Form"**
- Donnez un nom : `Site Web - Contact`
- Email de destination : (votre email - déjà pré-rempli)
- Cliquez sur **"Create Form"**

### 3. Copier votre Form ID
Une fois créé, vous verrez un écran avec votre **Form Endpoint**

Il ressemble à ça :
```
https://formspree.io/f/xyzabc123
                         ^^^^^^^^
                     Votre Form ID
```

**📋 COPIEZ ce Form ID** (exemple : `xyzabc123`)

✅ **Formulaire créé !**

---

## ✅ ÉTAPE 3 : Configurer le site (2 minutes)

### Ouvrir le fichier `script.js`

Cherchez la ligne **105** (environ), vous verrez ce bloc de code :

```javascript
// OPTION 2: Intégrer FormSpree (décommentez pour utiliser)
// const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(formData)
// });
// if (response.ok) {
//     formMessage.textContent = 'Message envoyé avec succès ! Je vous répondrai bientôt.';
//     formMessage.className = 'form-message success';
//     contactForm.reset();
// } else {
//     throw new Error('Erreur lors de l\'envoi');
// }
```

### Modifications à faire :

1. **Supprimez les `//`** au début de chaque ligne (pour décommenter)
2. **Remplacez `YOUR_FORM_ID`** par votre Form ID copié
3. **Commentez** (ajoutez `//`) les lignes du bloc "Configuration requise" en dessous

### Résultat final (lignes 105-120 environ) :

```javascript
// OPTION 2: Intégrer FormSpree
const response = await fetch('https://formspree.io/f/xyzabc123', {  // ⬅️ Remplacez par VOTRE Form ID
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
});
if (response.ok) {
    formMessage.textContent = 'Message envoyé avec succès ! Je vous répondrai bientôt.';
    formMessage.className = 'form-message success';
    contactForm.reset();
} else {
    throw new Error('Erreur lors de l\'envoi');
}

// Commentez le bloc ci-dessous en ajoutant // devant chaque ligne
// formMessage.innerHTML = `
//     <strong>Configuration requise :</strong><br>
//     ...
```

### Sauvegardez le fichier

✅ **Formulaire configuré !**

---

## ✅ ÉTAPE 4 : Tester le formulaire (1 minute)

### 1. Ouvrir la page Contact
- Ouvrez `contact.html` dans votre navigateur
- Ou naviguez vers la page Contact depuis le menu

### 2. Remplir le formulaire
- Nom : Votre nom
- Email : Votre email de test
- Sujet : Test du formulaire
- Message : Ceci est un message de test

### 3. Envoyer
- Cliquez sur **"Envoyer"**
- Vous devriez voir : ✅ "Message envoyé avec succès !"

### 4. Vérifier votre email
- Ouvrez votre boîte email (celle configurée sur FormSpree)
- Vous devriez avoir reçu le message de test
- FormSpree inclut tous les détails : nom, email, sujet, message

✅ **Formulaire fonctionnel !**

---

## 🎨 Personnalisation (optionnel)

### Dans le tableau de bord FormSpree, vous pouvez :

1. **Configurer un email de confirmation automatique**
   - Settings > Autoresponder
   - Message envoyé à la personne qui vous contacte

2. **Ajouter un message de remerciement personnalisé**
   - Settings > Success Message

3. **Bloquer les spams**
   - Settings > Spam Protection
   - Déjà activé par défaut avec reCAPTCHA invisible

4. **Rediriger après envoi**
   - Settings > Redirect URL
   - Ex: `https://votre-site.com/merci.html`

5. **Voir les soumissions**
   - Onglet "Submissions" dans le dashboard
   - Liste de tous les messages reçus

---

## 🆓 Plan Gratuit FormSpree

### Ce que vous avez gratuitement :
- ✅ 50 soumissions / mois
- ✅ Protection anti-spam
- ✅ Notifications email
- ✅ Formulaires illimités
- ✅ AJAX (pas de rechargement de page)

### Si vous dépassez 50 messages/mois :
- Passez au plan payant ($10/mois pour 1000 soumissions)
- Ou utilisez une alternative gratuite (voir ci-dessous)

---

## 🔄 Alternatives gratuites à FormSpree

Si vous voulez plus de soumissions gratuites :

### 1. **Web3Forms** (gratuit illimité)
- Site : https://web3forms.com
- 100% gratuit
- Configuration similaire à FormSpree

### 2. **EmailJS** (200/mois gratuit)
- Site : https://www.emailjs.com
- 200 emails/mois gratuits
- Envoi direct depuis le navigateur

### 3. **Netlify Forms** (100/mois gratuit)
- Si vous hébergez sur Netlify
- Intégration automatique
- 100 soumissions/mois gratuites

---

## 📝 Code complet du script.js (section formulaire)

Pour référence, voici le code complet après configuration :

```javascript
// FORMULAIRE DE CONTACT
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    formMessage.textContent = 'Envoi en cours...';
    formMessage.className = 'form-message';
    formMessage.style.display = 'block';
    
    try {
        // FormSpree configuré
        const response = await fetch('https://formspree.io/f/VOTRE_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            formMessage.textContent = 'Message envoyé avec succès ! Je vous répondrai bientôt.';
            formMessage.className = 'form-message success';
            contactForm.reset();
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
        
    } catch (error) {
        formMessage.textContent = 'Une erreur est survenue. Veuillez réessayer ou me contacter directement.';
        formMessage.className = 'form-message error';
    }
});
```

---

## ❓ Dépannage

### Le formulaire ne fonctionne pas ?

**1. Vérifiez le Form ID**
- Assurez-vous d'avoir copié le bon ID
- Format : `xyzabc123` (pas d'espace, pas d'URL complète)

**2. Vérifiez que le code est décommenté**
- Les lignes ne doivent PAS avoir `//` au début

**3. Ouvrez la Console du navigateur**
- F12 → Onglet Console
- Regardez s'il y a des erreurs en rouge

**4. Testez avec un autre navigateur**
- Parfois un bloqueur de pub peut bloquer FormSpree

**5. Vérifiez votre email sur FormSpree**
- Connectez-vous à FormSpree
- Settings → Email → Vérifiez qu'il est bien vérifié

### Message "Configuration requise" apparaît toujours ?

Vous n'avez pas commenté le bloc en dessous du code FormSpree. Ajoutez `//` devant ces lignes :

```javascript
// formMessage.innerHTML = `
//     <strong>Configuration requise :</strong><br>
//     ...
// `;
```

---

## ✅ Checklist finale

- [ ] Compte FormSpree créé
- [ ] Email vérifié
- [ ] Formulaire créé sur FormSpree
- [ ] Form ID copié
- [ ] Code dans script.js modifié
- [ ] Form ID collé dans le code
- [ ] Ancien bloc "Configuration requise" commenté
- [ ] Fichier script.js sauvegardé
- [ ] Formulaire testé
- [ ] Message de test reçu dans votre email

---

## 🎉 Félicitations !

Votre formulaire de contact est maintenant **100% fonctionnel** !

Les visiteurs peuvent vous contacter directement depuis votre site, et vous recevrez tous les messages dans votre boîte email.

---

**Besoin d'aide ?** Relisez les étapes ci-dessus ou vérifiez la section Dépannage.

**Dernière mise à jour :** Janvier 2024
