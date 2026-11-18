// ===================================================
// AICHATA BOUJIMA — Script commun à toutes les pages
// Chaque bloc vérifie que ses éléments existent sur la page,
// pour qu'une erreur sur une page n'empêche pas le reste de fonctionner.
// ===================================================

document.addEventListener('DOMContentLoaded', function () {
    const data = (typeof siteData !== 'undefined') ? siteData : {};

    // ---------- Navigation ----------
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    function onScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function closeMenu() {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navbar) navbar.classList.remove('menu-open');
        document.body.style.overflow = '';
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const open = !navMenu.classList.contains('active');
            navMenu.classList.toggle('active', open);
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
            if (navbar) navbar.classList.toggle('menu-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 960) closeMenu();
        });
    }

    // ---------- Animations d'apparition ----------
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // ---------- Liens réseaux sociaux (data-network="instagram" etc.) ----------
    // Un lien dont l'URL est vide ou "#" dans data.js est masqué automatiquement.
    const social = data.social || {};
    document.querySelectorAll('[data-network]').forEach(function (link) {
        const url = social[link.getAttribute('data-network')];
        if (url && url !== '#') {
            link.setAttribute('href', url);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
        } else {
            link.hidden = true;
        }
    });

    // ---------- Liens des projets (data-project="aichataMindset" etc.) ----------
    const projects = data.projects || {};
    document.querySelectorAll('[data-project]').forEach(function (link) {
        const project = projects[link.getAttribute('data-project')];
        if (project && project.url && project.url !== '#') {
            link.setAttribute('href', project.url);
        } else {
            link.hidden = true;
        }
    });

    // ---------- Blog ----------
    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function formatDate(dateString) {
        const d = new Date(dateString);
        if (isNaN(d)) return '';
        return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const blogGrid = document.getElementById('blogGrid');
    if (blogGrid && Array.isArray(data.blogPosts) && data.blogPosts.length > 0) {
        blogGrid.innerHTML = '';
        data.blogPosts.forEach(function (post) {
            const article = document.createElement('article');
            article.className = 'blog-card reveal visible';
            const image = post.image || './images/photos/explorer-blog.jpg';
            article.innerHTML =
                '<div class="card-media"><img src="' + escapeHtml(image) + '" alt="" loading="lazy"></div>' +
                '<div class="blog-card-content">' +
                    '<span class="chip blog-category">' + escapeHtml(post.category) + '</span>' +
                    '<h3 class="blog-title">' + escapeHtml(post.title) + '</h3>' +
                    '<p class="blog-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
                    '<div class="blog-meta">' +
                        '<span class="blog-date">' + escapeHtml(formatDate(post.date)) + '</span>' +
                        '<a href="' + escapeHtml(post.link || '#') + '" class="blog-read-more">Lire la suite →</a>' +
                    '</div>' +
                '</div>';
            blogGrid.appendChild(article);
        });
    }

    // ---------- Galerie des conférences ----------
    const gallery = document.querySelector('.conferences-gallery');
    if (gallery && Array.isArray(data.conferencePhotos) && data.conferencePhotos.length > 0) {
        const grid = document.createElement('div');
        grid.className = 'gallery-grid';
        data.conferencePhotos.forEach(function (photo) {
            const img = document.createElement('img');
            img.src = photo;
            img.alt = 'Conférence — Aichata Boujima';
            img.className = 'gallery-image';
            img.loading = 'lazy';
            grid.appendChild(img);
        });
        gallery.innerHTML = '';
        gallery.appendChild(grid);
    }

    // ---------- Contenu dynamique depuis la base de données (projets, événements, galerie) ----------
    const projectsList = document.getElementById('projectsList');
    const eventsList = document.getElementById('eventsList');
    const upcomingBox = document.getElementById('upcomingEvents');
    const needsApi = projectsList || eventsList || upcomingBox || gallery;

    const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    const PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';

    // N'accepte que des liens http(s) et des chemins d'images relatifs
    function safeUrl(url) {
        url = String(url || '');
        return /^(https?:\/\/|uploads\/|images\/)/i.test(url) ? url : '';
    }

    function renderProjects(projects) {
        projectsList.innerHTML = projects.map(function (p) {
            const tags = (p.tags || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean)
                .map(function (t) { return '<span class="chip">' + escapeHtml(t) + '</span>'; }).join('');
            const img = safeUrl(p.image);
            const link = safeUrl(p.link_url);
            return '<article class="project-card reveal visible">' +
                '<div class="card-media">' + (img ? '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(p.title) + '" loading="lazy">' : '') + '</div>' +
                '<div class="project-content">' +
                    '<div class="project-meta">' +
                        (p.category ? '<span class="project-category">' + escapeHtml(p.category) + '</span>' : '') +
                        (p.status ? '<span class="status">' + escapeHtml(p.status) + '</span>' : '') + tags +
                    '</div>' +
                    '<h3 class="project-title">' + escapeHtml(p.title) + '</h3>' +
                    (p.description ? '<p class="project-description">' + escapeHtml(p.description) + '</p>' : '') +
                    (p.motto ? '<p class="project-motto">« ' + escapeHtml(p.motto) + ' »</p>' : '') +
                    (link ? '<a href="' + escapeHtml(link) + '" class="project-link" target="_blank" rel="noopener">' + escapeHtml(p.link_label || 'En savoir plus') + ' ' + ARROW + '</a>' : '') +
                '</div></article>';
        }).join('');
    }

    function eventCard(ev, upcoming) {
        const img = safeUrl(ev.image);
        const link = safeUrl(ev.link_url);
        const date = ev.event_date ? formatDate(ev.event_date) : '';
        return '<div class="conference-item reveal visible' + (img ? ' has-image' : '') + '">' +
            (img ? '<img class="ev-img" src="' + escapeHtml(img) + '" alt="" loading="lazy">' : '') +
            '<div class="ev-meta">' +
                (ev.location ? '<span class="loc">' + PIN + ' ' + escapeHtml(ev.location) + '</span>' : '') +
                (date ? '<span class="ev-date' + (upcoming ? ' upcoming' : '') + '">' + escapeHtml(date) + '</span>' : '') +
            '</div>' +
            '<h3>' + escapeHtml(ev.title) + '</h3>' +
            (ev.description ? '<p>' + escapeHtml(ev.description) + '</p>' : '') +
            (link ? '<a class="project-link" href="' + escapeHtml(link) + '" target="_blank" rel="noopener">' + (upcoming ? 'S\'inscrire / en savoir plus' : 'En savoir plus') + ' ' + ARROW + '</a>' : '') +
        '</div>';
    }

    function renderGallery(images) {
        const grid = document.createElement('div');
        grid.className = 'gallery-grid';
        images.forEach(function (g) {
            const src = safeUrl(g.image);
            if (!src) return;
            const fig = document.createElement('figure');
            fig.className = 'gallery-item';
            const img = document.createElement('img');
            img.src = src;
            img.alt = g.caption || g.event_title || 'Conférence — Aichata Boujima';
            img.className = 'gallery-image';
            img.loading = 'lazy';
            fig.appendChild(img);
            const text = g.caption || g.event_title;
            if (text) {
                const cap = document.createElement('figcaption');
                cap.textContent = text;
                fig.appendChild(cap);
            }
            grid.appendChild(fig);
        });
        gallery.innerHTML = '';
        gallery.appendChild(grid);
    }

    if (needsApi && data.apiUrl && /^https?:$/.test(window.location.protocol)) {
        fetch(data.apiUrl, { headers: { 'Accept': 'application/json' } })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(function (db) {
                // On ne remplace le contenu écrit dans la page que si la base contient des éléments
                if (projectsList && db.projects && db.projects.length) renderProjects(db.projects);
                if (eventsList && db.events && db.events.past.length) {
                    eventsList.innerHTML = db.events.past.map(function (e) { return eventCard(e, false); }).join('');
                }
                if (upcomingBox && db.events && db.events.upcoming.length) {
                    upcomingBox.innerHTML = '<div class="timeline">' + db.events.upcoming.map(function (e) { return eventCard(e, true); }).join('') + '</div>';
                }
                if (gallery && db.gallery && db.gallery.length) renderGallery(db.gallery);
            })
            .catch(function () { /* API indisponible : on garde le contenu statique */ });
    }

    // ---------- Formulaire de contact ----------
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    function showMessage(type, html) {
        if (!formMessage) return;
        formMessage.className = 'form-message ' + type;
        formMessage.innerHTML = html;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const formData = {
                name: contactForm.name.value.trim(),
                email: contactForm.email.value.trim(),
                subject: contactForm.subject.value.trim(),
                message: contactForm.message.value.trim()
            };
            const formspreeId = (data.formspreeId || '').trim();
            const email = (data.personal && data.personal.email) || '';

            // Formspree pas encore configuré : proposer l'e-mail en secours
            if (!formspreeId) {
                const body = 'Nom : ' + formData.name + '\nEmail : ' + formData.email + '\n\n' + formData.message;
                const mailto = 'mailto:' + email + '?subject=' + encodeURIComponent(formData.subject) + '&body=' + encodeURIComponent(body);
                showMessage('warning', email
                    ? 'L\'envoi direct n\'est pas encore activé. <a href="' + mailto + '">Cliquez ici pour envoyer votre message par e-mail</a>.'
                    : 'L\'envoi du formulaire n\'est pas encore activé. Contactez-moi en attendant via mes réseaux sociaux.');
                return;
            }

            if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.innerHTML; submitBtn.textContent = 'Envoi en cours…'; }
            showMessage('info', 'Envoi en cours…');

            try {
                const response = await fetch('https://formspree.io/f/' + encodeURIComponent(formspreeId), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                showMessage('success', 'Merci ! Votre message a bien été envoyé. Je vous répondrai très bientôt.');
                contactForm.reset();
            } catch (err) {
                showMessage('error', 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou me contacter via mes réseaux sociaux.');
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitBtn.dataset.label; }
            }
        });
    }

    // ---------- Année dans le footer ----------
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---------- Accessibilité : focus visible au clavier ----------
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') document.body.classList.add('using-keyboard');
    });
    document.addEventListener('mousedown', function () {
        document.body.classList.remove('using-keyboard');
    });
});
