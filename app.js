
const mainContent = document.getElementById('mainContent');

const assets = {
  home: 'home_abertura.png',
  prometeon: 'topo_prometeon.png',
  visaoGeral: 'topo_visao_geral.png',
  pendencias: 'topo_pendencias.png',
  planejamento: 'topo_planejamento.png',
  materiais: 'topo_materiais.png',
  cadastrarMateriais: 'topo_cadastrar_materiais.png',
  programacao: 'topo_programacao.png',
  equipe: 'topo_equipe.png',
  configuracao: 'topo_configuracao.png',
  regras: 'topo_regras.png',

  icon_visaoGeral: 'icon_visao_geral.png',
  icon_pendencias: 'icon_pendencias.png',
  icon_planejamento: 'icon_planejamento.png',
  icon_materiais: 'icon_materiais.png',
  icon_cadastrarMateriais: 'icon_cadastrar_materiais.png',
  icon_programacao: 'icon_programacao.png',
  icon_equipe: 'icon_equipe.png',
  icon_configuracao: 'icon_configuracao.png',
  icon_regras: 'icon_regras.png',
};

const mainFunctions = [
  { key:'visaoGeral', label:'Visão Geral', icon:assets.icon_visaoGeral },
  { key:'pendencias', label:'Pendências', icon:assets.icon_pendencias },
  { key:'planejamento', label:'Planejamento', icon:assets.icon_planejamento },
  { key:'materiais', label:'Materiais', icon:assets.icon_materiais },
  { key:'cadastrarMateriais', label:'Cadastrar Materiais', icon:assets.icon_cadastrarMateriais },
  { key:'programacao', label:'Programação', icon:assets.icon_programacao },
  { key:'equipe', label:'Equipe', icon:assets.icon_equipe },
  { key:'configuracao', label:'Configuração', icon:assets.icon_configuracao },
  { key:'regras', label:'Regras do Sistema', icon:assets.icon_regras }
];

const subFunctions = {
  visaoGeral: ['Dashboard Geral','UPA','UPGR','Criticidade','Status'],
  pendencias: ['Criar Pendência','Lista Geral','Abertas','Em Atendimento','Aguardando Material','Não Concluídas'],
  planejamento: ['Gerar Dia','Agenda do Dia','Agenda Semana','Cargas','Distribuição'],
  materiais: ['Lista','Buscar','Faltantes','Materiais do Dia'],
  cadastrarMateriais: ['Novo Material','Importar CSV','Revisar Cadastro'],
  programacao: ['Integrações','Agenda','Automação','Mensagens'],
  equipe: ['Manutentores','Padrinhos','Especialidades','Carga Diária'],
  configuracao: ['Setores','Áreas','Máquinas','Parâmetros'],
  regras: ['Prioridade','Esforço','Horas','Alocação','Material']
};

let state = {
  currentMainView: 'home',
  currentSubView: null
};

let bannerLoopInterval = null;
let bannerReturnTimeout = null;

function buildBottomZone(title, items, isMainNav){
  return `
    <footer class="bottom-zone">
      <div class="bottom-zone-head">
        <h2>${title}</h2>
        <button id="btnHome" class="btn-home ${isMainNav ? 'hidden' : ''}">Início</button>
      </div>
      <div class="carousel-shell">
        <button id="btnPrev" class="nav-arrow left" aria-label="Anterior">‹</button>
        <div id="bottomCarousel" class="bottom-carousel">
          ${items.map((item, index) => `
            <a href="#" class="nav-card ${index === 0 ? 'active' : ''}" data-key="${item.key}" data-label="${item.label}">
              <img src="${item.icon}" alt="${item.label}">
              
            </a>
          `).join('')}
        </div>
        <button id="btnNext" class="nav-arrow right" aria-label="Próximo">›</button>
      </div>
      <div id="bottomDots" class="bottom-dots">
        ${items.map((_, index) => `<button class="${index === 0 ? 'active' : ''}" data-index="${index}"></button>`).join('')}
      </div>
    </footer>
  `;
}

function buildBigCard(title, tag, description, metrics){
  return `
    <article class="big-card">
      <div class="tag">${tag}</div>
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="metric-grid">
        ${metrics.map(m => `<div class="metric">${m}</div>`).join('')}
      </div>
    </article>
  `;
}

const featureCards = {
  visaoGeral: [
    buildBigCard('Dashboard Geral','VISÃO','Indicadores gerais da operação por setor, criticidade e status.',['UPA','UPGR','Críticas','Status']),
    buildBigCard('Leitura Operacional','SETOR','Visão consolidada para leitura rápida do cenário industrial.',['Pendências','Material','Atrasos','Cargas'])
  ],
  pendencias: [
    buildBigCard('Lista de Pendências','PENDÊNCIAS','Controle operacional das pendências abertas e em andamento.',['Abertas','Atendimento','Material','Não Concluídas']),
    buildBigCard('Tratamento','AÇÃO','Cadastro, atualização e priorização da carteira.',['Criar','Editar','Criticidade','Status'])
  ],
  planejamento: [
    buildBigCard('Planejamento do Dia','GERAÇÃO','Distribuição automática respeitando horas, esforço e padrinho.',['Manhã','Tarde','Carga','Prioridade']),
    buildBigCard('Planejamento Semanal','AGENDA','Visão consolidada para balanceamento da equipe.',['Semana','Setor','Equipe','Ajustes'])
  ],
  materiais: [
    buildBigCard('Controle de Materiais','MATERIAIS','Disponibilidade, faltas e preparação operacional.',['Lista','Busca','Faltantes','Dia']),
    buildBigCard('Vínculo por Pendência','VÍNCULO','Material associado à execução das atividades.',['Pendência','Reserva','Saldo','Bloqueio'])
  ],
  cadastrarMateriais: [
    buildBigCard('Cadastro Unitário','CADASTRO','Inclusão e revisão de materiais da operação.',['Novo','Código','Descrição','Salvar']),
    buildBigCard('Importação','IMPORTAÇÃO','Entrada em lote com conferência e padronização.',['CSV','Validação','Duplicidade','Confirmar'])
  ],
  programacao: [
    buildBigCard('Programação Operacional','PROGRAMAÇÃO','Base para integrações, agenda e automações.',['Agenda','Mensagens','Integrações','Execução']),
    buildBigCard('Automação','AUTOMAÇÃO','Preparação para notificações e rotinas.',['WhatsApp','Alertas','Horários','Envios'])
  ],
  equipe: [
    buildBigCard('Equipe de Manutenção','EQUIPE','Leitura de disponibilidade, padrinhos e distribuição.',['Manutentores','Padrinhos','Especialidades','Carga']),
    buildBigCard('Carga Diária','CARGA','Visão consolidada de ocupação por manutentor.',['Leve','Médio','Pesado','7h'])
  ],
  configuracao: [
    buildBigCard('Estrutura do Sistema','CONFIGURAÇÃO','Configuração da estrutura industrial.',['Setores','Áreas','Máquinas','Parâmetros']),
    buildBigCard('Parâmetros Gerais','PARÂMETROS','Regras de interface e operação.',['Campos','Filtros','Preferências','Temas'])
  ],
  regras: [
    buildBigCard('Regras do Sistema','REGRAS','Prioridade, esforço, horas e material.',['Prioridade','Esforço','Horas','Material']),
    buildBigCard('Parâmetros Industriais','INDUSTRIAL','Base operacional para o motor e execução.',['Padrinho','Slot','Carga','Bloqueios'])
  ]
};

function bindBottomZone(isMainNav){
  const carousel = document.getElementById('bottomCarousel');
  const dots = document.getElementById('bottomDots');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnHome = document.getElementById('btnHome');

  if (btnHome) btnHome.addEventListener('click', renderHome);
  btnPrev.addEventListener('click', () => carousel.scrollBy({left:-220, behavior:'smooth'}));
  btnNext.addEventListener('click', () => carousel.scrollBy({left:220, behavior:'smooth'}));

  const cards = [...carousel.querySelectorAll('.nav-card')];
  const dotItems = [...dots.querySelectorAll('button')];

  function setActive(index){
    cards.forEach((c,i)=>c.classList.toggle('active', i===index));
    dotItems.forEach((d,i)=>d.classList.toggle('active', i===index));
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(index);
      if (isMainNav) {
        renderFeature(card.dataset.key);
      } else {
        state.currentSubView = card.dataset.label;
      }
    });
  });

  dotItems.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      cards[index].scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
      setActive(index);
    });
  });
}

function stopBannerLoop(){
  clearInterval(bannerLoopInterval);
  clearTimeout(bannerReturnTimeout);
  bannerLoopInterval = null;
  bannerReturnTimeout = null;
}

function startBannerLoop(imgEl){
  stopBannerLoop();
  if(!imgEl || state.currentMainView === 'home') return;

  function changeBanner(src){
    imgEl.classList.add('banner-fade');
    setTimeout(() => {
      imgEl.src = src;
      imgEl.classList.remove('banner-fade');
    }, 170);
  }

  function showFunctionBanner(){
    changeBanner(assets[state.currentMainView] || assets.prometeon);
  }

  function flashPrometeonBanner(){
    clearTimeout(bannerReturnTimeout);
    changeBanner(assets.prometeon);
    bannerReturnTimeout = setTimeout(() => {
      showFunctionBanner();
    }, 2000);
  }

  showFunctionBanner();
  bannerLoopInterval = setInterval(() => {
    flashPrometeonBanner();
  }, 10000);
}

function renderHome(){
  stopBannerLoop();
  state.currentMainView = 'home';
  state.currentSubView = null;

  mainContent.innerHTML = `
    <section class="home-screen">
      <div class="home-hero">
        <img src="${assets.home}" alt="Manutenção Prometeon">
      </div>
      ${buildBottomZone('Funções principais', mainFunctions, true)}
    </section>
  `;
  bindBottomZone(true);
}

function renderFeature(mainKey){
  stopBannerLoop();
  state.currentMainView = mainKey;
  state.currentSubView = null;

  const current = mainFunctions.find(f => f.key === mainKey);
  const subs = (subFunctions[mainKey] || []).map((label, idx) => ({
    key: `${mainKey}_${idx}`,
    label,
    icon: current.icon
  }));

  mainContent.innerHTML = `
    <section class="feature-screen">
      <div class="top-banner-wrap">
        <img id="featureBanner" src="${assets[current.key]}" alt="${current.label}">
      </div>

      <section class="feature-panel">
        <div class="feature-head">
          <h1>${current.label}</h1>
          <p>Carrossel grande central com navegação por subfunções no rodapé.</p>
        </div>
        <div class="big-carousel">
          ${(featureCards[mainKey] || []).join('')}
        </div>
      </section>

      ${buildBottomZone(`Subfunções: ${current.label}`, subs, false)}
    </section>
  `;

  bindBottomZone(false);
  const imgEl = document.getElementById('featureBanner');
  startBannerLoop(imgEl);
}

window.addEventListener('load', renderHome);
