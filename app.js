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

//
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
    setEstado(`${ estadoText }`);
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

 // Modificar elementos del dom
const btnAgregarCard = $('#btnAgregarCard');
const btnLimpiarCard = $('#btnLimpiarCard');
const listaArticulos2 = $('#listaArticulos');


 // Agregar elementos del dom
btnAgregarCard.addEventListener('click', () => {
    const new_article = document.createElement('article');
    new_article.className = 'card';
    new_article.dataset.tags = 'agentes';
    new_article.innerHTML = `
        <h3 class="card-title">Nueva Tarjeta</h3>
        <p class="card-text">Basura entra, basura sale; y además puede amplificar sesgos.</p>
        <div class="card-actions">
            <button class="btn small" type="button" data-action="like">👍 Like</button>
            <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
            <span class="badge" aria-label="likes">0</span>
        </div>
    `;
    listaArticulos2.append(new_article);
    setEstado('Nueva card agregada');
});

 // Eliminar elementos del dom
btnLimpiarCard.addEventListener('click', () => {
    const cards = $$('#listaArticulos .card');
    let removed = 0; // los articulos a borrar
    cards.forEach(card => {
        if (card.dataset.seed == 'true') return;
        card.remove();
        removed++;
    });
    setEstado(`N° de Articulos eliminados ${ removed }`);
});