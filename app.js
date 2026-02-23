'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Universidad Tecnológica de Tlaxcala');

// referencias a elementos de DOM
const btnCambiarMensaje = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');
const listaArticulos = $('#listaArticulos');

// funciones
const buildCard = ({ title, text, tags }) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.tags = tags;
    article.dataset.seed = 'false';
    article.innerHTML = `
        <h3 class="card-title"></h3>
        <p class="card-text"></p>
        <div class="card-actions">
            <button class="btn small" type="button" data-action="like">👍</button>
            <button class="btn small delete" type="button" data-action="dislike">👎</button>
            <button class="btn small ghost" type="button" data-action="remove">❎</button>
            <span class="badge" aria-label="likes">0</span>
        </div>
    `;
    article.querySelector('.card-title').textContent = title;
    article.querySelector('.card-text').textContent = text;
    return article;
};

// Eventos
btnCambiarMensaje.addEventListener('click', () => {  
    const alt = titulo.dataset.alt === '1';
    let estadoText = "";

    titulo.textContent = alt
        ? 'Bienvenido a la App mis SauFlogers'
        : 'Hoy veremos la manipulación del DOM!';

    subtitulo.textContent = alt
        ? 'Hola'
        : '¡HAS SIDO HACKEADOOOOOO!';

    titulo.dataset.alt = alt ? '0' : '1';
    
    estadoText = alt
        ? 'El texto no ha sido alterado (aún)'
        : '!¡!¡EL TEXTO HA SIDO TOTALMENTE ALTERADOOOO¡!¡!';
    setEstado(estadoText);
});

// Modificar elementos del DOM
const btnAgregarCard = $('#btnAgregarCard');
const btnLimpiarCard = $('#btnLimpiarCard');

// Agregar elementos al DOM
btnAgregarCard.addEventListener('click', () => {
    const new_article = buildCard({
        title: 'Nuevo Articulo',
        text: 'Editar texto',
        tags: 'nuevo articulo'
    });

    listaArticulos.append(new_article);
    setEstado('Nueva card agregada');
});

// Eliminar elementos del DOM
btnLimpiarCard.addEventListener('click', () => {
    const cards = $$('#listaArticulos .card');
    let removed = 0;

    cards.forEach(card => {
        if (card.dataset.seed === 'true') return;
        card.remove();
        removed++;
    });

    setEstado(`N° de Articulos eliminados ${removed}`);
});

// Delegación de eventos
listaArticulos.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const card = btn.closest('.card');
    const badge = card.querySelector('.badge');
    const currentLikes = Number(badge.textContent);

    if (!card) return;

    // Eliminar la tarjeta
    if (btn.dataset.action === 'remove') {
        if (card.dataset.seed === 'true') return;
        card.remove();
        setEstado('Card eliminada');
    }   

    // Dar like a la tarjeta
    if (btn.dataset.action === 'like') {
        badge.textContent = currentLikes + 1;
        setEstado('Card likeada');
    }

    // Quitar like a la tarjeta
    if (btn.dataset.action === 'dislike') {
        currentLikes > 0
            ? badge.textContent = currentLikes - 1
        : badge.textContent = 0;
        setEstado('Card dislikeada');
    }
});

const filtro = $('#filtro');

const matchText = (card, q) => {
    const title = card.querySelector('.card-title')?.textContent ?? '';
    const text = card.querySelector('.card-text')?.textContent ?? '';
    const hayStack = (title + '' + text).toLowerCase();
    return hayStack.includes(q);
}

// Evento de tipo input: mientras se escribe en la caja, se aplican los filtros
filtro.addEventListener('input', () => {
    filterState.q = filtro.value.trim().toLowerCase();
    applyFilters();
});

const listaChips = $('#chips');

listaChips.addEventListener('click', e => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;

    const chip = btn.closest('.chip');

    filterState.tag = (filterState.tag === tag) ? '' : tag;
    applyFilters();
});

const filterState = {
    q:   '',
    tag: '',
};

const matchTag = (card, tag) => {
    if (!tag) return true;
    const tags = (card.dataset.tags || '').toLowerCase();
    return tags.includes(tag.toLowerCase());
};

const applyFilters = () => {
    const cards = $$('#listaArticulos .card');
    cards.forEach((card) => {
        const okText = filterState.q ? matchText(card,filterState.q) : true;
        const okTag = matchTag(card, filterState.tag);
        card.hidden = !(okText && okTag);
    });

    const parts = [];
    if (filterState.q) parts.push(`texto: "${filterState.q}"`);
    if (filterState.tag) parts.push(`tag: "${filterState.tag}"`);
    setEstado(parts.length > 0
        ? `Filtros : ${parts.join(' + ')}`
        : 'Filtros: ninguno'
    );
};

const formNewsLetter = $('#formNewsLetter');
const email = $('#email');
const interes = $('#interes');
const feedback = $('#feedback');

// Validar email con expresión regular simple
const isValidEmail = (value) => /^[^\s@]+@[^s@]+\.[^\s@]+$/.test(value);

formNewsLetter.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar envio precoz del formulario
    const valueEmail = email.value.trim();
    const valueInterest = interes.value.trim();

    email.classList.remove('is-valid');
    interes.classList.remove('is-invalid');
    feedback.textContent = '';

    let ok = true;

    if (!isValidEmail(valueEmail)) {
        email.classList.add('is-invalid');
        ok = false;
    }

    if (!valueInterest) {
        interes.classList.add('is-invalid')
        of = false
    }

    if (!valueInterest) {
        feedback.textContent = 'Revisa los cmapos marcados';
        setEstado('Formulario con errores');
        return;
    }

    // Simular envío de datos
    feedback.textContent = `¡Gracias x suscribirte! Tematica de interés: "${valueInterest}"`;
    setEstado('Formulario enviado con éxito');
});

// Carga asíncrona de noticias
const listaNoticias = $('#listaNoticias');

const renderNoticias = (items) => {
    listaNoticias.innerHTML = '';
    if ( !items || items.length === 0 ) {
        const li = document.createElement('li');
        li.textContent = 'No se encontraron noticias.';
        listaNoticias.append(li);
        return;
    }
    items.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        listaNoticias.append(li);
    });
};

renderNoticias(['N1', 'N2', 'N3']);