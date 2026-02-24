export {};

// --- Interfaces y Tipos ---
interface CardData {
  title: string;
  text: string;
  tags: string;
}

interface FilterState {
  q: string;
  tag: string;
}

// --- Utilidades con Tipado Genérico ---
const $ = <T extends HTMLElement>(sel: string, root: Document | HTMLElement = document): T | null =>
  root.querySelector<T>(sel);

const $$ = <T extends HTMLElement>(sel: string, root: Document | HTMLElement = document): T[] =>
  Array.from(root.querySelectorAll<T>(sel));

// --- Referencias al DOM ---
const estadoUI = $('#estadoUI') as HTMLElement | null;
const setEstado = (msg: string): void => {
  if (estadoUI) estadoUI.textContent = msg;
};

setEstado('Universidad Tecnológica de Tlaxcala');

const btnCambiarMensaje = $('#btnCambiarMensaje') as HTMLButtonElement | null;
const titulo = $('#tituloPrincipal') as HTMLElement | null;
const subtitulo = $('#subtitulo') as HTMLElement | null;
const listaArticulos = $('#listaArticulos') as HTMLElement | null;

// --- Funciones ---
const buildCard = ({ title, text, tags }: CardData): HTMLElement => {
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

  const titleEl = article.querySelector('.card-title') as HTMLElement | null;
  const textEl = article.querySelector('.card-text') as HTMLElement | null;

  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = text;

  return article;
};

// --- Eventos ---
btnCambiarMensaje?.addEventListener('click', () => {
  const alt = titulo?.dataset.alt === '1';

  if (titulo) {
    titulo.textContent = alt
      ? 'Bienvenido a la App mis SauFlogers'
      : 'Hoy veremos la manipulación del DOM!';
    titulo.dataset.alt = alt ? '0' : '1';
  }

  if (subtitulo) {
    subtitulo.textContent = alt ? 'Hola' : '¡HAS SIDO HACKEADOOOOOO!';
  }

  const estadoText = alt
    ? 'El texto no ha sido alterado (aún)'
    : '!¡!¡EL TEXTO HA SIDO TOTALMENTE ALTERADOOOO¡!¡!';
  setEstado(estadoText);
});

const btnAgregarCard = $('#btnAgregarCard') as HTMLButtonElement | null;
const btnLimpiarCard = $('#btnLimpiarCard') as HTMLButtonElement | null;

btnAgregarCard?.addEventListener('click', () => {
  const newArticle = buildCard({
    title: 'Nuevo Artículo',
    text: 'Editar texto',
    tags: 'nuevo articulo',
  });

  if (listaArticulos) {
    listaArticulos.append(newArticle);
    setEstado('Nueva card agregada');
  }
});

btnLimpiarCard?.addEventListener('click', () => {
  if (!listaArticulos) return;

  const cards = $$('#listaArticulos .card') as HTMLElement[];
  let removed = 0;

  cards.forEach((card) => {
    if (card.dataset.seed === 'true') return;
    card.remove();
    removed++;
  });

  setEstado(`N° de Artículos eliminados: ${removed}`);
});

// --- Delegación de eventos ---
listaArticulos?.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  const btn = target.closest<HTMLElement>('[data-action]');
  if (!btn) return;

  const card = btn.closest<HTMLElement>('.card');
  if (!card) return;

  const badge = card.querySelector('.badge') as HTMLElement | null;
  const currentLikes = Number(badge?.textContent ?? '0');

  const action = btn.dataset.action;

  if (action === 'remove') {
    if (card.dataset.seed === 'true') return;
    card.remove();
    setEstado('Card eliminada');
    return;
  }

  if (!badge) return;

  if (action === 'like') {
    badge.textContent = String(currentLikes + 1);
    setEstado('Card likeada');
    return;
  }

  if (action === 'dislike') {
    badge.textContent = String(currentLikes > 0 ? currentLikes - 1 : 0);
    setEstado('Card dislikeada');
    return;
  }
});

// --- Filtros ---
const filtro = $('#filtro') as HTMLInputElement | null;
const listaChips = $('#chips') as HTMLElement | null;

const filterState: FilterState = {
  q: '',
  tag: '',
};

const matchText = (card: HTMLElement, q: string): boolean => {
  const title = card.querySelector('.card-title')?.textContent ?? '';
  const text = card.querySelector('.card-text')?.textContent ?? '';
  const hayStack = (title + ' ' + text).toLowerCase();
  return hayStack.includes(q);
};

const matchTag = (card: HTMLElement, tag: string): boolean => {
  if (!tag) return true;
  const tags = (card.dataset.tags || '').toLowerCase();
  return tags.includes(tag.toLowerCase());
};

const applyFilters = (): void => {
  const cards = $$('#listaArticulos .card') as HTMLElement[];
  cards.forEach((card) => {
    const okText = filterState.q ? matchText(card, filterState.q) : true;
    const okTag = matchTag(card, filterState.tag);
    card.hidden = !(okText && okTag);
  });

  const parts: string[] = [];
  if (filterState.q) parts.push(`texto: "${filterState.q}"`);
  if (filterState.tag) parts.push(`tag: "${filterState.tag}"`);

  setEstado(
    parts.length ? `Filtros: ${parts.join(' + ')}` : 'Filtros: ninguno'
  );
};

filtro?.addEventListener('input', () => {
  if (!filtro) return;
  filterState.q = filtro.value.trim().toLowerCase();
  applyFilters();
});

listaChips?.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  const btn = target.closest<HTMLElement>('[data-tag]');
  if (!btn) return;

  const tag = btn.dataset.tag ?? '';
  filterState.tag = filterState.tag === tag ? '' : tag;
  applyFilters();
});

// --- Formulario Newsletter ---
const formNewsLetter = $('#formNewsletter') as HTMLFormElement | null;
const emailInput = $('#email') as HTMLInputElement | null;
const interesInput = $('#interes') as HTMLSelectElement | null;
const feedback = $('#feedback') as HTMLElement | null;

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

formNewsLetter?.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  const valueEmail = (emailInput?.value ?? '').trim();
  const valueInterest = (interesInput?.value ?? '').trim();

  emailInput?.classList.remove('is-invalid');
  interesInput?.classList.remove('is-invalid');
  if (feedback) feedback.textContent = '';

  let ok = true;

  if (!isValidEmail(valueEmail)) {
    emailInput?.classList.add('is-invalid');
    ok = false;
  }

  if (!valueInterest) {
    interesInput?.classList.add('is-invalid');
    ok = false;
  }

  if (!ok) {
    if (feedback) feedback.textContent = 'Revisa los campos marcados';
    setEstado('Formulario con errores');
    return;
  }

  if (feedback) feedback.textContent = `¡Gracias por suscribirte! Tema de interés: "${valueInterest}"`;
  setEstado('Formulario enviado con éxito');
});

// --- Carga Asíncrona de Noticias ---
const listaNoticias = $('#listaNoticias') as HTMLElement | null;
const feedbackNoticias = document.createElement('p');
feedbackNoticias.className = 'feedback';
if (listaNoticias && listaNoticias.parentElement) {
  listaNoticias.after(feedbackNoticias);
}

const renderNoticias = (items: string[]): void => {
  if (!listaNoticias) return;
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

renderNoticias(['N1', 'N2', 'N3']);

const fakeFetchNoticias = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const shouldFail = Math.random() < 0.2;
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Fallo de red simulado.'));
        return;
      }
      resolve([
        'Nuevo modelo de IA logra mejores resultados en visión',
        'OpenAI lanza mejoras en asistentes inteligentes',
        'Debate sobre ética en sistemas de IA crece en 2026',
      ]);
    }, 1500);
  });
};

const btnCargar = $('#btnCargar') as HTMLButtonElement | null;

btnCargar?.addEventListener('click', async () => {
  setEstado('Cargando noticias...');
  if (listaNoticias) listaNoticias.innerHTML = '<li>Cargando...</li>';
  feedbackNoticias.textContent = '';

  try {
    const noticias = await fakeFetchNoticias();
    renderNoticias(noticias);
    setEstado('Noticias cargadas');
  } catch (error) {
    renderNoticias([]);
    if (error instanceof Error) {
      feedbackNoticias.textContent = error.message;
    }
    setEstado('Error al cargar noticias');
  }
});