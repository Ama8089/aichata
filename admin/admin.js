// ===================================================
// Administration : connexion + CRUD projets / événements / galerie
// ===================================================
(function () {
    'use strict';

    const API = '../api/admin.php';
    const SITE = '../'; // les chemins d'images en base sont relatifs à la racine du site
    let csrf = '';
    let current = 'projects';
    const cache = { projects: [], events: [], gallery: [] };

    // ---------- Description des formulaires ----------
    const FORMS = {
        projects: {
            title: 'Projets',
            hint: 'Affichés sur la page Projets, dans l\'ordre choisi.',
            singular: 'un projet',
            fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                { name: 'category', label: 'Catégorie', type: 'text', hint: 'Ex : Entrepreneuriat & Innovation' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'motto', label: 'Devise / citation', type: 'text' },
                ['row', { name: 'status', label: 'Badge de statut', type: 'text', hint: 'Ex : En développement (vide = aucun)' },
                        { name: 'tags', label: 'Étiquettes', type: 'text', hint: 'Séparées par des virgules' }],
                ['row', { name: 'link_url', label: 'Lien (URL)', type: 'url', hint: 'https://… (vide = pas de bouton)' },
                        { name: 'link_label', label: 'Texte du bouton', type: 'text' }],
                { name: 'image', label: 'Image', type: 'image' },
                ['row', { name: 'sort_order', label: 'Ordre d\'affichage', type: 'number', hint: 'Plus petit = en premier' },
                        { name: 'is_published', label: 'Publié sur le site', type: 'checkbox', default: true }],
            ],
        },
        events: {
            title: 'Événements',
            hint: 'Date future → « Prochains événements ». Date passée ou vide → « Mes interventions ».',
            singular: 'un événement',
            fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                ['row', { name: 'location', label: 'Lieu', type: 'text', hint: 'Ex : Niamey' },
                        { name: 'event_date', label: 'Date', type: 'date' }],
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'link_url', label: 'Lien d\'inscription / infos (URL)', type: 'url' },
                { name: 'image', label: 'Image', type: 'image' },
                ['row', { name: 'sort_order', label: 'Ordre d\'affichage', type: 'number' },
                        { name: 'is_published', label: 'Publié sur le site', type: 'checkbox', default: true }],
            ],
        },
        gallery: {
            title: 'Galerie photos',
            hint: 'Photos affichées dans la galerie de la page Conférences.',
            singular: 'une photo',
            grid: true,
            fields: [
                { name: 'image', label: 'Photo', type: 'image', required: true },
                { name: 'caption', label: 'Légende', type: 'text' },
                { name: 'event_id', label: 'Événement associé', type: 'event-select' },
                ['row', { name: 'sort_order', label: 'Ordre d\'affichage', type: 'number' },
                        { name: 'is_published', label: 'Publiée sur le site', type: 'checkbox', default: true }],
            ],
        },
    };

    // ---------- Utilitaires ----------
    const $ = (sel, root) => (root || document).querySelector(sel);
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const imgUrl = (p) => (p ? (/^https?:\/\//.test(p) ? p : SITE + p) : '');
    const fmtDate = (d) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');

    async function api(action, opts = {}) {
        const { resource, body, method = body ? 'POST' : 'GET' } = opts;
        const url = API + '?action=' + action + (resource ? '&resource=' + resource : '');
        const headers = {};
        if (method !== 'GET') headers['X-CSRF-Token'] = csrf;
        let res;
        try {
            res = await fetch(url, { method, body, headers, credentials: 'same-origin' });
        } catch (e) {
            throw new Error('Serveur injoignable. Le site doit être ouvert via un serveur PHP (pas en double-cliquant le fichier).');
        }
        let data = {};
        try { data = await res.json(); } catch (e) { /* réponse non JSON */ }
        if (res.status === 401 && action !== 'login') { showLogin(); throw new Error('Session expirée, reconnectez-vous.'); }
        if (!res.ok) throw new Error(data.error || ('Erreur ' + res.status));
        return data;
    }

    let toastTimer;
    function toast(msg) {
        const t = $('#toast');
        t.textContent = msg; t.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
    }

    // ---------- Vues ----------
    function show(id) {
        ['viewLoading', 'viewLogin', 'viewApp'].forEach((v) => { $('#' + v).hidden = v !== id; });
    }
    function showLogin() { csrf = ''; show('viewLogin'); }

    async function boot() {
        try {
            const me = await api('me');
            if (me.authenticated) { csrf = me.csrf; enterApp(me.email); } else { showLogin(); }
        } catch (e) {
            showLogin();
            const err = $('#loginError'); err.textContent = e.message; err.hidden = false;
        }
    }

    function enterApp(email) {
        $('#adminEmail').textContent = email;
        show('viewApp');
        // On charge les 3 listes (les événements servent aussi au menu de la galerie)
        Promise.all(['events', 'projects', 'gallery'].map(load)).then(() => render());
    }

    async function load(resource) {
        const data = await api('list', { resource });
        cache[resource] = data.items || [];
        const c = document.querySelector('[data-count="' + resource + '"]');
        if (c) c.textContent = cache[resource].length;
    }

    // ---------- Liste ----------
    function render() {
        const f = FORMS[current];
        $('#panelTitle').textContent = f.title;
        $('#panelHint').textContent = f.hint;
        $('#addBtn').textContent = '+ Ajouter ' + f.singular;
        document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === current));

        const list = $('#list');
        list.className = 'item-list' + (f.grid ? ' grid' : '');
        const items = cache[current];
        if (!items.length) {
            list.innerHTML = '<div class="empty">Aucun élément pour l\'instant. Cliquez sur « + Ajouter ».</div>';
            return;
        }
        list.innerHTML = items.map((it) => {
            const thumb = it.image
                ? '<img class="item-thumb" src="' + esc(imgUrl(it.image)) + '" alt="" loading="lazy">'
                : '<div class="item-thumb">Pas d\'image</div>';
            const pub = Number(it.is_published) ? '<span class="badge on">Publié</span>' : '<span class="badge off">Masqué</span>';
            let title = it.title || it.caption || 'Photo sans légende';
            let meta = [pub];
            if (current === 'projects') {
                if (it.category) meta.push(esc(it.category));
                if (it.status) meta.push('<span class="badge gold">' + esc(it.status) + '</span>');
            } else if (current === 'events') {
                if (it.location) meta.push('📍 ' + esc(it.location));
                if (it.event_date) {
                    const upcoming = it.event_date >= new Date().toISOString().slice(0, 10);
                    meta.push(esc(fmtDate(it.event_date)) + (upcoming ? ' <span class="badge gold">À venir</span>' : ''));
                } else meta.push('Sans date');
            } else if (it.event_id) {
                const ev = cache.events.find((e) => Number(e.id) === Number(it.event_id));
                if (ev) meta.push(esc(ev.title));
            }
            meta.push('Ordre : ' + esc(it.sort_order));
            return '<article class="item">' + thumb +
                '<div class="item-body"><h3>' + esc(title) + '</h3><div class="item-meta">' + meta.join('<span>·</span>') + '</div></div>' +
                '<div class="item-actions">' +
                    '<button class="btn btn-ghost btn-sm" data-edit="' + it.id + '">Modifier</button>' +
                    '<button class="btn btn-danger btn-sm" data-del="' + it.id + '">Supprimer</button>' +
                '</div></article>';
        }).join('');
    }

    // ---------- Formulaire ----------
    function fieldHtml(fd, item) {
        const val = item ? item[fd.name] : undefined;
        const v = val == null ? '' : val;
        const req = fd.required ? ' required' : '';
        const hint = fd.hint ? '<span class="field-hint">' + esc(fd.hint) + '</span>' : '';
        switch (fd.type) {
            case 'textarea':
                return '<label>' + esc(fd.label) + '<textarea name="' + fd.name + '"' + req + '>' + esc(v) + '</textarea>' + hint + '</label>';
            case 'checkbox': {
                const checked = item ? Number(val) === 1 : fd.default;
                return '<label class="check" style="margin-top:28px"><input type="checkbox" name="' + fd.name + '" value="1"' + (checked ? ' checked' : '') + '> ' + esc(fd.label) + '</label>';
            }
            case 'event-select': {
                const opts = ['<option value="">— Aucun —</option>'].concat(cache.events.map((e) =>
                    '<option value="' + e.id + '"' + (Number(v) === Number(e.id) ? ' selected' : '') + '>' + esc(e.title) + (e.event_date ? ' (' + esc(fmtDate(e.event_date)) + ')' : '') + '</option>'));
                return '<label>' + esc(fd.label) + '<select name="' + fd.name + '">' + opts.join('') + '</select></label>';
            }
            case 'image': {
                const preview = v ? '<img src="' + esc(imgUrl(v)) + '" alt="" id="imgPreview">' : '<div class="ph" id="imgPreview">Aucune image</div>';
                const remove = (v && !fd.required) ? '<label class="check" style="margin:8px 0 0;font-weight:500"><input type="checkbox" name="remove_image" value="1"> Retirer l\'image actuelle</label>' : '';
                return '<div class="image-field"><label style="margin-bottom:0">' + esc(fd.label) + (fd.required && !item ? '' : ' <small>(facultatif)</small>') + '</label>' +
                    '<div class="image-drop">' + preview + '<div><input type="file" name="image" accept="image/jpeg,image/png,image/webp"' + (fd.required && !item ? ' required' : '') + '>' +
                    '<span class="field-hint">JPG, PNG ou WEBP — 5 Mo maximum</span>' + remove + '</div></div></div>';
            }
            default: {
                const type = fd.type === 'number' ? 'number' : fd.type;
                return '<label>' + esc(fd.label) + '<input type="' + type + '" name="' + fd.name + '" value="' + esc(v === '' && fd.type === 'number' ? '0' : v) + '"' + req + '>' + hint + '</label>';
            }
        }
    }

    function openEditor(item) {
        const f = FORMS[current];
        $('#editorTitle').textContent = (item ? 'Modifier ' : 'Ajouter ') + f.singular;
        $('#editorError').hidden = true;
        $('#editorFields').innerHTML = f.fields.map((fd) =>
            Array.isArray(fd) ? '<div class="row-2">' + fd.slice(1).map((x) => fieldHtml(x, item)).join('') + '</div>' : fieldHtml(fd, item)
        ).join('') + (item ? '<input type="hidden" name="id" value="' + item.id + '">' : '');

        const fileInput = $('#editorFields input[type=file]');
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                const prev = $('#imgPreview');
                if (!file || !prev) return;
                const img = document.createElement('img');
                img.id = 'imgPreview'; img.alt = '';
                img.src = URL.createObjectURL(file);
                prev.replaceWith(img);
            });
        }
        $('#editor').showModal();
        const first = $('#editorFields input:not([type=hidden]):not([type=file]), #editorFields textarea');
        if (first) first.focus();
    }

    async function saveEditor(e) {
        e.preventDefault();
        const form = $('#editorForm');
        const err = $('#editorError');
        err.hidden = true;
        const missing = [...form.querySelectorAll('[required]')].find((el) => (el.type === 'file' ? !el.files.length : !el.value.trim()));
        if (missing) {
            err.textContent = 'Veuillez remplir les champs obligatoires.'; err.hidden = false; missing.focus(); return;
        }
        const body = new FormData(form);
        const btn = $('#saveBtn');
        btn.disabled = true; btn.textContent = 'Enregistrement…';
        try {
            await api('save', { resource: current, body });
            await load(current);
            if (current === 'events') await load('gallery'); // libellés d'événement dans la galerie
            $('#editor').close();
            render();
            toast('Enregistré ✓');
        } catch (ex) {
            err.textContent = ex.message; err.hidden = false;
        } finally {
            btn.disabled = false; btn.textContent = 'Enregistrer';
        }
    }

    async function remove(id) {
        const item = cache[current].find((x) => Number(x.id) === Number(id));
        const name = item ? (item.title || item.caption || 'cette photo') : 'cet élément';
        if (!confirm('Supprimer « ' + name + ' » ? Cette action est définitive.')) return;
        const body = new FormData();
        body.append('id', id);
        try {
            await api('delete', { resource: current, body });
            await load(current);
            if (current === 'events') await load('gallery');
            render();
            toast('Supprimé');
        } catch (ex) { alert(ex.message); }
    }

    // ---------- Événements ----------
    $('#loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const err = $('#loginError');
        err.hidden = true;
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        try {
            const data = await api('login', { body: new FormData(e.target) });
            csrf = data.csrf;
            e.target.reset();
            enterApp(data.email);
        } catch (ex) {
            err.textContent = ex.message; err.hidden = false;
        } finally { btn.disabled = false; }
    });

    $('#logoutBtn').addEventListener('click', async () => {
        try { await api('logout', { body: new FormData() }); } catch (e) { /* déjà déconnecté */ }
        showLogin();
    });

    document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => { current = t.dataset.tab; render(); }));
    $('#addBtn').addEventListener('click', () => openEditor(null));
    $('#list').addEventListener('click', (e) => {
        const edit = e.target.closest('[data-edit]');
        const del = e.target.closest('[data-del]');
        if (edit) openEditor(cache[current].find((x) => Number(x.id) === Number(edit.dataset.edit)));
        if (del) remove(del.dataset.del);
    });
    $('#editorForm').addEventListener('submit', saveEditor);
    document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => $('#editor').close()));

    boot();
})();
