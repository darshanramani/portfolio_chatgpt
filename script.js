/* =========================================================
   Interactions — Vanilla JavaScript only
   ========================================================= */

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// Custom cursor
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, input, .career-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Header + progress bar + pipeline fill
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const pipeline = document.querySelector('.pipeline');
const pipelineFill = document.querySelector('.pipeline-fill');

function handleScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 35);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${docHeight > 0 ? (y / docHeight) * 100 : 0}%`;

  if (pipeline) {
    const rect = pipeline.getBoundingClientRect();
    const viewportPoint = window.innerHeight * 0.62;
    const traversed = viewportPoint - rect.top;
    const pct = clamp((traversed / rect.height) * 100, 0, 100);
    pipelineFill.style.height = `${pct}%`;

    document.querySelectorAll('.career-card').forEach(card => {
      const r = card.getBoundingClientRect();
      card.classList.toggle('active', r.top < viewportPoint && r.bottom > window.innerHeight * 0.2);
    });
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// Intersection reveals
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-card').forEach(el => revealObserver.observe(el));

// Rotating hero word
const rotatingWord = document.querySelector('.rotating-word');
const words = JSON.parse(rotatingWord.dataset.words);
let wordIndex = 0;

setInterval(() => {
  rotatingWord.animate(
    [
      { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' },
      { transform: 'translateY(-32px)', opacity: 0, filter: 'blur(6px)' }
    ],
    { duration: 390, easing: 'cubic-bezier(.5,0,.8,.2)' }
  ).onfinish = () => {
    wordIndex = (wordIndex + 1) % words.length;
    rotatingWord.textContent = words[wordIndex];
    rotatingWord.animate(
      [
        { transform: 'translateY(32px)', opacity: 0, filter: 'blur(6px)' },
        { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' }
      ],
      { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
  };
}, 2100);

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

// Card spotlight
document.querySelectorAll('.career-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// 3D tilt skill cards
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const ry = (px - 0.5) * 10;
    const rx = (0.5 - py) * 10;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// Mobile navigation
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}));

// Local "retrieval" knowledge base
const knowledge = [
  {
    keys: ['rag', 'retrieval', 'vector', 'search', 'embedding'],
    answer: 'Built production RAG systems with LangChain, Azure OpenAI, Azure AI Search, embeddings, FastAPI, ChromaDB, and semantic retrieval workflows.'
  },
  {
    keys: ['mlops', 'docker', 'kubernetes', 'deployment', 'cicd', 'ci/cd'],
    answer: 'Productionized AI services with Docker, Kubernetes, Azure DevOps CI/CD, GitHub Actions, MLflow, and model-monitoring workflows.'
  },
  {
    keys: ['databricks', 'etl', 'pyspark', 'delta'],
    answer: 'Worked on enterprise-scale ETL and ML pipelines using Azure Databricks, PySpark, Delta Lake and datasets exceeding 40M records.'
  },
  {
    keys: ['llm', 'openai', 'prompt', 'summarization', 'function'],
    answer: 'Built LLM-powered Q&A, summarization, semantic search and document intelligence services using OpenAI APIs, Azure OpenAI, LangChain and prompt engineering.'
  },
  {
    keys: ['ocr', 'invoice', 'document', 'hubbroker'],
    answer: 'Built OCR + NLP document intelligence pipelines for invoice processing and semantic document search, reducing manual processing effort.'
  },
  {
    keys: ['forecast', 'power bi', 'sql', 'dashboard'],
    answer: 'Improved forecasting accuracy through feature engineering and delivered Power BI dashboards on SQL data pipelines.'
  }
];

const input = document.getElementById('queryInput');
const retrieveBtn = document.getElementById('retrieveBtn');
const output = document.getElementById('retrievalOutput');

function retrieve(query) {
  const q = query.trim().toLowerCase();
  if (!q) return;
  output.classList.add('loading');
  output.innerHTML = '<div class="output-meta"><span>retriever</span><span>searching</span></div><p>Scanning experience knowledge base</p>';

  setTimeout(() => {
    const scored = knowledge.map(item => ({
      ...item,
      score: item.keys.reduce((s, key) => s + (q.includes(key) ? 1 : 0), 0)
    })).sort((a,b) => b.score - a.score);

    const best = scored[0];
    const answer = best.score > 0
      ? best.answer
      : 'Relevant profile areas include production RAG, LLM applications, document intelligence, Databricks ETL, forecasting, APIs, Docker and Kubernetes. Try asking about one of those topics.';

    output.classList.remove('loading');
    output.innerHTML = `<div class="output-meta"><span>top match</span><span>score ${best.score > 0 ? '0.9' + Math.min(best.score,9) : '0.61'}</span></div><p>${answer}</p>`;
  }, 460);
}

retrieveBtn.addEventListener('click', () => retrieve(input.value));
input.addEventListener('keydown', e => { if (e.key === 'Enter') retrieve(input.value); });
document.querySelectorAll('.quick-prompts button').forEach(btn => btn.addEventListener('click', () => {
  input.value = btn.dataset.query;
  retrieve(btn.dataset.query);
}));

// Project pipeline animation
const nodes = [...document.querySelectorAll('.flow-node')];
let activeNode = 0;
setInterval(() => {
  nodes.forEach(n => n.classList.remove('active'));
  nodes[activeNode].classList.add('active');
  activeNode = (activeNode + 1) % nodes.length;
}, 1100);

// Subtle hero parallax
window.addEventListener('mousemove', (e) => {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  const x = (e.clientX / window.innerWidth - .5);
  const y = (e.clientY / window.innerHeight - .5);
  document.querySelector('.orb-one').style.transform = `translate(${x * 28}px, ${y * 20}px)`;
  document.querySelector('.orb-two').style.transform = `translate(${x * -25}px, ${y * -18}px)`;
}, { passive: true });
