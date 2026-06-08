/**
 * Helpers compartilhados das telas_web
 */
const WebApp = {
  /** Raiz do site (Live Server com pasta telas_web como root) */
  loginPath: '/index.html', // Ajuste para '../../index.html' se as telas continuarem dando problema de rota ao sair
  _uiCarregado: false,

  incluirCss(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  },

  carregarScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  },

  async carregarUi() {
    ['/src/css/shared/animations.css', '/src/css/shared/skeleton.css', '/src/css/shared/components.css'].forEach(
      (href) => this.incluirCss(href)
    );
    if (this._uiCarregado) return;
    await this.carregarScript('/src/js/templates.js');
    await this.carregarScript('/src/js/ui.js');
    this._uiCarregado = true;
  },

  exigirSessao(tiposPermitidos = null) {
    // 1. Agora ele busca o login real que fizemos no Node.js
    const usuarioString = localStorage.getItem('usuarioLogado');
    
    if (!usuarioString) {
      window.location.href = this.loginPath;
      return null;
    }

    const sessao = JSON.parse(usuarioString);

    // 2. Agora ele verifica a palavra certa: 'cargo' em vez de 'tipo'
    if (tiposPermitidos && !tiposPermitidos.includes(sessao.cargo)) {
      alert('Você não tem permissão para acessar esta página.');
      window.location.href = this.loginPath;
      return null;
    }
    return sessao;
  },

  carregarHeaderUsuario() {
    const usuarioString = localStorage.getItem('usuarioLogado');
    if (!usuarioString) return;
    
    const sessao = JSON.parse(usuarioString);
    const nomeEl = document.getElementById('nome-usuario');
    const avatarEl = document.getElementById('avatar-letra');
    
    if (nomeEl) nomeEl.textContent = sessao.nome;
    if (avatarEl) avatarEl.textContent = sessao.nome.charAt(0).toUpperCase();
  },

  marcarNavAtivo(arquivo) {
    document.querySelectorAll('.sidebar nav a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href.includes(arquivo));
    });
  },

  sair() {
    // 3. Limpa o login real ao sair
    localStorage.removeItem('usuarioLogado');
    const destino = this.loginPath.includes('?')
      ? this.loginPath
      : `${this.loginPath}?logout=1`;
    window.location.href = destino;
  },

  vincularLogout() {
    document.querySelectorAll('.sidebar-footer a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.sair();
      });
    });
  },

  aplicarMarcaClinica() {
    if (typeof ClinicaConfig !== 'undefined') {
      ClinicaConfig.aplicarMarca();
    }
  },

  async initPagina({ tipos = null, navAtivo = '', ui = true } = {}) {
    this.aplicarMarcaClinica();

    if (ui) {
      document.body.classList.add('ui-page-enter');
      await this.carregarUi();
    }
    
    // O segurança da página agora usa a nossa nova função exigirSessao
    const sessao = this.exigirSessao(tipos);
    if (!sessao) return null;
    
    this.carregarHeaderUsuario();
    this.vincularLogout();
    if (navAtivo) this.marcarNavAtivo(navAtivo);
    return sessao;
  },
};