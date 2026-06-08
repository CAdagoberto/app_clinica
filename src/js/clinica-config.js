/**
 * Identidade institucional — Clínica Horizonte
 */
const ClinicaConfig = {
  razaoSocial: 'Centro Integrado de Saúde Mental Horizonte Ltda.',
  nomeFantasia: 'Clínica Horizonte',
  sigla: 'CH',

  tituloCompleto() {
    return `${this.razaoSocial} — ${this.nomeFantasia}`;
  },

  aplicarMarca() {
    document.querySelectorAll('.logo, .logo-admin, .logo-avatar').forEach((el) => {
      el.textContent = this.sigla;
      el.title = this.tituloCompleto();
    });

    document.querySelectorAll('[data-clinica-nome]').forEach((el) => {
      el.textContent = this.nomeFantasia;
    });

    document.querySelectorAll('[data-clinica-razao]').forEach((el) => {
      el.textContent = this.razaoSocial;
    });

    const titulo = document.title;
    if (titulo.includes('Clínica Psiquiátrica')) {
      document.title = titulo.replace('Clínica Psiquiátrica', this.nomeFantasia);
    } else if (titulo.endsWith(' - Clínica')) {
      document.title = titulo.replace(' - Clínica', ` - ${this.nomeFantasia}`);
    }
  },
};
