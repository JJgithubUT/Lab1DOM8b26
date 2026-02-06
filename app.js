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

const listaArticulos = $('#listaArticulos');
listaArticulos.addEventListener('mouseover', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    card.classList.add('is-highlight');
});

listaArticulos.addEventListener('mouseout', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    card.classList.remove('is-highlight');
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

// ✅ Delegación de eventos
listaArticulos.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;

    const card = btn.closest('.card');
    if (!card) return;

    if (btn.dataset.action === 'remove') {
        if (card.dataset.seed === 'true') return;
        card.remove();
        setEstado('Card eliminada');
    }

    if (btn.dataset.action === 'like') {
        const badge = card.querySelector('.badge');
        badge.textContent = Number(badge.textContent) + 1;
    }
});
