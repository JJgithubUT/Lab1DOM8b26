'use strict';

// --- Utilidades ---
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Universidad Tecnológica de Tlaxcala');

// --- Referencias al DOM ---
const btnCambiarMensaje = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');
const listaArticulos = $('#listaArticulos');
const btnAgregarCard = $('#btnAgregarCard');
const btnLimpiarCard = $('#btnLimpiarCard');
const filtro = $('#filtro');
const listaChips = $('#chips');
const formNewsLetter = $('#formNewsletter');
const email = $('#email');
const interes = $('#interes');
const feedback = $('#feedback');
const listaNoticias = $('#listaNoticias');
const btnCargar = $('#btnCargar');

// Crear feedback de noticias si no existe
const feedbackNoticias = document.createElement('p');
feedbackNoticias.className = 'feedback';
listaNoticias.after(feedbackNoticias);

// --- Funciones de Construcción ---
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

// --- Lógica de Noticias (Fetch JSON + Random 5) ---

// Mezclar un array aleatoriamente (fisher-yates)
const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

const renderNoticias = (items) => {
    listaNoticias.innerHTML = '';
    if (!items || items.length === 0) {
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

const fetchFakeNews = async () => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() < 0.2 ? reject(new Error('Error de conexión con el servidor.')) : resolve();
        }, 1500);
    });

    const response = await fetch('noticias.json');
    if (!response.ok) throw new Error('No se pudo obtener el archivo JSON.');
    
    const data = await response.json();

    return shuffleArray(data).slice(0, 5);
};



// Botón Cambiar Mensaje
btnCambiarMensaje.addEventListener('click', () => {  
    const alt = titulo.dataset.alt === '1';
    titulo.textContent = alt ? 'Bienvenido a la App mis SauFlogers' : 'Hoy veremos la manipulación del DOM!';
    subtitulo.textContent = alt ? 'Hola' : '¡HAS SIDO HACKEADOOOOOO!';
    titulo.dataset.alt = alt ? '0' : '1';
    setEstado(alt ? 'El texto no ha sido alterado' : '!¡!¡TEXTO ALTERADO¡!¡!');
});

// Agregar Card
btnAgregarCard.addEventListener('click', () => {
    const new_article = buildCard({
        title: 'Nuevo Artículo',
        text: 'Editar texto',
        tags: 'nuevo articulo'
    });
    listaArticulos.append(new_article);
    setEstado('Nueva card agregada');
});

// Limpiar Cards
btnLimpiarCard.addEventListener('click', () => {
    const cards = $$('#listaArticulos .card');
    let removed = 0;
    cards.forEach(card => {
        if (card.dataset.seed === 'true') return;
        card.remove();
        removed++;
    });
    setEstado(`Artículos eliminados: ${removed}`);
});

// Delegación para Likes/Eliminar
listaArticulos.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const card = btn.closest('.card');
    const badge = card.querySelector('.badge');
    const currentLikes = Number(badge.textContent);

    if (btn.dataset.action === 'remove') {
        if (card.dataset.seed === 'true') return;
        card.remove();
        setEstado('Card eliminada');
    }   
    if (btn.dataset.action === 'like') {
        badge.textContent = currentLikes + 1;
        setEstado('Card likeada');
    }
    if (btn.dataset.action === 'dislike') {
        badge.textContent = currentLikes > 0 ? currentLikes - 1 : 0;
        setEstado('Card dislikeada');
    }
});

// Filtros
const filterState = { q: '', tag: '' };

const applyFilters = () => {
    const cards = $$('#listaArticulos .card');
    cards.forEach((card) => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const text = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        const tags = (card.dataset.tags || '').toLowerCase();
        
        const okText = (title + ' ' + text).includes(filterState.q);
        const okTag = !filterState.tag || tags.includes(filterState.tag.toLowerCase());
        
        card.hidden = !(okText && okTag);
    });
};

filtro.addEventListener('input', () => {
    filterState.q = filtro.value.trim().toLowerCase();
    applyFilters();
});

listaChips.addEventListener('click', e => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;
    const tag = btn.dataset.tag; 
    filterState.tag = (filterState.tag === tag) ? '' : tag;
    applyFilters();
});

// Newsletter
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
formNewsLetter.addEventListener('submit', (e) => {
    e.preventDefault();
    const isEmailOk = isValidEmail(email.value.trim());
    const isInterestOk = interes.value.trim() !== '';

    email.classList.toggle('is-invalid', !isEmailOk);
    interes.classList.toggle('is-invalid', !isInterestOk);

    if (isEmailOk && isInterestOk) {
        feedback.textContent = '¡Suscripción exitosa!';
        setEstado('Formulario enviado');
    } else {
        feedback.textContent = 'Revisa los errores';
    }
});

// Cargar Noticias Random
btnCargar.addEventListener('click', async () => {
    btnCargar.disabled = true;
    setEstado('Buscando 5 noticias aleatorias...');
    listaNoticias.innerHTML = '<li>Cargando noticias externas...</li>';
    feedbackNoticias.textContent = '';

    try {
        const noticias = await fetchFakeNews();
        renderNoticias(noticias);
        setEstado('Noticias actualizadas');
    } catch (error) {
        renderNoticias([]);
        feedbackNoticias.textContent = error.message;
        setEstado('Error en la carga');
    } finally {
        btnCargar.disabled = false;
    }
});

// Inicialización
renderNoticias(['Esperando noticias frescas...']);