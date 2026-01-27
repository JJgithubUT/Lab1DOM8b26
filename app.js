'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Listo');

// Referencias a elementos del DOM
const btnCambiarMensaje = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');

// Manejador de eventos
btnCambiarMensaje.addEventListener('click', () => {
    const alt = titulo.dataset.alt === '1';

    titulo.textContent = alt
        ? '¡Bienvenido a la Aplicación!'
        : '¡Hola, mundo!';

    subtitulo.textContent = alt
        ? 'Explora las funcionalidades disponibles.'
        : 'Hoy veremos cómo manipular el DOM.';

    titulo.dataset.alt = alt  ? '0' : '1';
    setEstado('Textos actualizados');
});