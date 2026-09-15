
/* ══════ ACCESO, SESIÓN Y RECORRIDO GUIADO ══════
   Comparte credencial y sesión con el portal del concesionario: mismo
   dominio, mismo localStorage. Entrar en uno vale para el otro. */

const CRED = { email: 'agente@autollanos.com.ve', pass: 'Pactto2026' };

const LS_SESION = 'pactto.sesion.v1';   // compartida entre los dos portales
const LS_KEY = 'pactto.cliente.v1';     // avance de este recorrido

function haySesion() { try { return window.localStorage.getItem(LS_SESION) === '1'; } catch (e) { return false; } }
function abrirSesion() { try { window.localStorage.setItem(LS_SESION, '1'); } catch (e) {} }
function cerrarSesion() { try { window.localStorage.removeItem(LS_SESION); } catch (e) {} }
function olvidar() { try { window.localStorage.removeItem(LS_KEY); } catch (e) {} }

const CARRILES = [
  { id: 'tarjeta', label: 'Pagar con tarjeta', desc: 'El cargo va a la pasarela y el desenlace llega al momento' },
  { id: 'reporte', label: 'Reportar un pago que ya hice', desc: 'Declaras un depósito, Zelle, cripto o Zinli para que PIVCA lo concilie' }
];

/* Los desenlaces salen del catálogo cerrado de `contracts.ts`: los ocho
   estados canónicos del módulo de pagos. Cada carril alcanza los suyos. */
const DESENLACES_CLI = {
  tarjeta: [
    { id: 'aplicado', label: 'Asignado', desc: 'El cargo se aplicó a las cuotas al momento' },
    { id: 'conciliacion', label: 'Por asignar', desc: 'El cargo pasó, pero la asignación queda en cola' },
    { id: 'rechazado', label: 'Rechazado por el emisor', desc: 'El banco del cliente no autorizó el cargo' },
    { id: 'no_confirmado', label: 'No confirmado', desc: 'La pasarela no respondió a tiempo' },
    { id: 'parcial', label: 'Mixto', desc: 'Unos tramos se asignaron y otros no' }
  ],
  reporte: [
    { id: 'aplicado', label: 'Por conciliar', desc: 'El reporte entra y queda a la espera de que PIVCA lo verifique' },
    { id: 'ref_duplicada', label: 'Referencia duplicada', desc: 'Esa referencia ya se reportó antes' },
    { id: 'error_catalogo', label: 'Error de carga del catálogo', desc: 'Las cuentas de PIVCA no cargan y hay que reintentar' }
  ]
};

const GUION_CLI_BASE = [
  { fase: 'escenario', target: 'cli-scn-carril', titulo: 'Elegir qué practicar',
    tip: 'Son dos formas distintas de pagar. Elige con cuál quieres empezar.' },
  { fase: 'escenario', target: 'cli-scn-desenlace', titulo: 'Elegir el desenlace',
    tip: 'Ahora elige cómo quieres que termine. Son los estados reales que devuelve el sistema.' },
  { fase: 'escenario', target: 'cli-scn-comenzar', titulo: 'Arrancar el recorrido',
    tip: 'Pulsa «Comenzar» para entrar al portal con ese escenario.' },
  { fase: 'login', target: 'cli-login', titulo: 'Iniciar sesión',
    tip: 'Escribe el correo y la contraseña que te entregaron, y pulsa «Iniciar sesión».' }
];

const GUION_CLI = {
  tarjeta: [
    { target: 'cli-tab-tdc', titulo: 'Abrir el pago con tarjeta',
      tip: 'Son dos pestañas. «Pagar con TDC» cobra al momento; la otra sirve para declarar un pago ya hecho.' },
    { target: 'cli-tc-fin', titulo: 'Abrir tus financiamientos',
      tip: 'Aquí salen los vehículos que el cliente tiene financiados con PIVCA. Pulsa para desplegarlos.' },
    { target: 'cli-tc-fin-0', titulo: 'Marcar el financiamiento',
      tip: 'Marca el primero. Puedes marcar varios y el portal reparte el pago entre ellos.' },
    { target: 'cli-tc-concepto-0', titulo: 'Elegir cuánto pagar',
      tip: 'El portal propone montos ya calculados. Elige el primero: lo exigible en este momento.' },
    { target: 'cli-tc-ejemplo', titulo: 'Llenar los datos de la tarjeta',
      tip: 'En la práctica el cliente los escribe. Aquí pulsa este botón y se rellenan con una tarjeta de prueba.' },
    { target: 'cli-tc-pagar', titulo: 'Pagar',
      tip: 'PIVCA no guarda los datos de la tarjeta: el cargo lo procesa la pasarela.' },
    { target: 'cli-res-0', titulo: 'Leer el desenlace',
      tip: 'Este es el desenlace que elegiste al principio. Fíjate en la referencia: es la que el cliente comunica si algo hay que revisar.' }
  ],
  reporte: [
    { target: 'cli-tab-rp', titulo: 'Abrir el reporte de pago',
      tip: 'Esta pestaña no cobra nada: declara un pago que el cliente ya hizo por fuera para que PIVCA lo concilie.' },
    { target: 'cli-rp-fin', titulo: 'Abrir tus financiamientos',
      tip: 'Igual que en tarjeta: eliges a qué financiamiento va el pago.' },
    { target: 'cli-rp-fin-0', titulo: 'Marcar el financiamiento',
      tip: 'Marca el primero.' },
    { target: 'cli-rp-concepto-0', titulo: 'Declarar cuánto pagaste',
      tip: 'Aquí el monto lo declara el cliente: es lo que ya pagó, no lo que el sistema calcula.' },
    { target: 'cli-rp-metodo', titulo: 'Elegir el método',
      tip: 'Sólo cuatro: depósito, Zelle, cripto y Zinli. Ni efectivo, ni pago móvil, ni C2P.' },
    { target: 'cli-rp-metodo-0', titulo: 'Elegir depósito bancario',
      tip: 'Elige el primero para ver los datos de la cuenta de PIVCA.' },
    { target: 'cli-rp-ejemplo', titulo: 'Llenar el resto del reporte',
      tip: 'Referencia, fecha, remitente y comprobante. Pulsa y se llenan con un ejemplo.' },
    { target: 'cli-rp-cuenta', titulo: 'Elegir la cuenta de PIVCA',
      tip: 'Las cuentas tienen vigencia por fecha: sólo aparecen las que estaban activas el día del pago.' },
    { target: 'cli-rp-cuenta-0', titulo: 'Tomar la primera cuenta',
      tip: 'Los datos quedan a la vista, con botón de copiar para que el cliente no se equivoque al transcribir.' },
    { target: 'cli-rp-enviar', titulo: 'Enviar el reporte',
      tip: 'A partir de aquí queda en manos de PIVCA: el reporte se concilia contra el movimiento real.' },
    { target: 'cli-res-0', titulo: 'Leer el desenlace',
      tip: 'Guarda el número de reporte. Es lo que el cliente comunica si hay que hacerle seguimiento.' }
  ]
};

/* #tarjeta/rechazado · #reporte/duplicada · #tarjeta — un enlace por escenario. */
const CARRIL_HASH = { tarjeta: 'tarjeta', tdc: 'tarjeta', reporte: 'reporte', reportar: 'reporte' };
const DES_HASH = {
  asignado: 'aplicado', aplicado: 'aplicado',
  conciliacion: 'conciliacion', 'por-asignar': 'conciliacion',
  rechazado: 'rechazado', 'no-confirmado': 'no_confirmado', no_confirmado: 'no_confirmado',
  mixto: 'parcial', parcial: 'parcial',
  duplicada: 'ref_duplicada', ref_duplicada: 'ref_duplicada',
  catalogo: 'error_catalogo', error_catalogo: 'error_catalogo'
};

function leerHash() {
  try {
    const raw = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
    if (!raw) return null;
    const out = {};
    raw.split(/[\/,+&]/).forEach(t => {
      const k = decodeURIComponent(t.trim());
      if (CARRIL_HASH[k]) out.carril = CARRIL_HASH[k];
      if (DES_HASH[k]) out.escenario = DES_HASH[k];
    });
    if (!out.carril && !out.escenario) return null;
    out.fase = 'login';
    out.paso = 3;
    return out;
  } catch (e) { return null; }
}

function escribirHash(carril, escenario) {
  try {
    const inv = { aplicado: 'asignado', conciliacion: 'por-asignar', no_confirmado: 'no-confirmado',
      parcial: 'mixto', ref_duplicada: 'duplicada', error_catalogo: 'catalogo', rechazado: 'rechazado' };
    window.history.replaceState(null, '',
      window.location.pathname + window.location.search + '#' + carril + '/' + (inv[escenario] || escenario));
  } catch (e) {}
}

function leerGuardado() {
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || d.v !== 1 || !d.s || d.s.fase === 'escenario' || d.s.fase === 'login') return null;
    return Object.assign({}, d.s, { tip: null, toast: null, entrando: false, loginErr: '', pass: '', menuUsuario: false });
  } catch (e) { return null; }
}

function guardar(st) {
  try {
    if (!st.recordar || st.fase === 'escenario' || st.fase === 'login') { olvidar(); return; }
    const c = Object.assign({}, st);
    delete c.tip; delete c.toast; delete c.entrando; delete c.loginErr;
    delete c.pass; delete c.menuUsuario; delete c.api;
    window.localStorage.setItem(LS_KEY, JSON.stringify({ v: 1, s: c }));
  } catch (e) {}
}

function estadoInicial() {
  const h = leerHash();
  const g = leerGuardado();
  if (!h) return g;
  if (g && g.carril === (h.carril || g.carril) && g.escenario === (h.escenario || g.escenario)) return g;
  olvidar();
  return h;
}

class Component extends DCLogic {
/* ══════ LÓGICA DEL PORTAL (prototipo de métodos de pago) ══════ */
  qrRef = React.createRef();

  state = Object.assign({
    fase: 'escenario',
    paso: 0,
    carril: 'tarjeta',
    email: '',
    pass: '',
    verPass: false,
    loginErr: '',
    entrando: false,
    recordar: true,
    menuUsuario: false,
    libre: false,
    tip: null,
    toast: null,
    vista: 'escritorio', tab: 'tdc', escenario: 'conciliacion', escenariosAbiertos: false,
    api: null, fins: [], cargandoFins: true, errorFins: null,
    tc: {
      sel: [], concepto: null, monto: '', abierto: false, aviso: null,
      tipoDoc: 'V', doc: '', titular: '', numero: '', venc: '', cvv: '',
      tocados: {}, enviado: false, estado: 'editando', tx: null, resultado: null
    },
    rp: {
      sel: [], concepto: null, monto: '', abierto: false, aviso: null,
      fecha: '', metodo: null, tipo: null, metodoAbierto: false, tipoAbierto: false,
      cuentas: { estado: 'vacio' }, cuentaId: null, cuentaAbierta: false, confirmoRed: false,
      referencia: '', remNombre: '', remCorreo: '', remUsuario: '', tercero: false,
      archivo: null, errArchivo: null, arrastrando: false,
      tocados: {}, enviado: false, estado: 'editando',
      reporte: null, dup: null, avisoDup: null, confirmadoPosible: false, errorEnvio: null
    },
    copiado: null
  }, estadoInicial());

  componentDidMount() {
    const v = this.props.vistaInicial;
    if (v === 'movil' || v === 'escritorio') this.setState({ vista: v });
    // Sesión compartida con el portal del concesionario: si ya entró allí, no
    // se le vuelve a pedir la credencial aquí.
    if (haySesion() && this.state.fase === 'login') this.setState({ fase: 'app', paso: 4 });
    this.arrancar();

    this._m = () => this.measure();
    this._u = () => { this._uScroll = Date.now(); };
    window.addEventListener('wheel', this._u, { passive: true });
    window.addEventListener('touchmove', this._u, { passive: true });
    window.addEventListener('resize', this._m);
    window.addEventListener('scroll', this._m, true);
    this._h = () => { if (leerHash()) window.location.reload(); };
    window.addEventListener('hashchange', this._h);
    this._iv = setInterval(() => this.measure(), 350);
    requestAnimationFrame(this._m);
    setTimeout(() => this.centrar(), 320);
  }

  componentDidUpdate() {
    this.sincronizarCuentas();
    this.pintarQr();
    this.applyHalo();
    if (this.tGuardar) clearTimeout(this.tGuardar);
    this.tGuardar = setTimeout(() => guardar(this.state), 400);
    if (this._lastPaso !== this.state.paso || this._lastTab !== this.state.tab) {
      this._lastPaso = this.state.paso;
      this._lastTab = this.state.tab;
      setTimeout(() => this.centrar(), 90);
    }
  }

  componentWillUnmount() {
    if (this.tPago) clearTimeout(this.tPago);
    if (this.tCopia) clearTimeout(this.tCopia);
    if (this.tToast) clearTimeout(this.tToast);
    if (this.tGuardar) clearTimeout(this.tGuardar);
    clearInterval(this._iv);
    window.removeEventListener('wheel', this._u);
    window.removeEventListener('touchmove', this._u);
    window.removeEventListener('resize', this._m);
    window.removeEventListener('scroll', this._m, true);
    window.removeEventListener('hashchange', this._h);
  }

  /* ---------- capa de datos ---------- */
  async arrancar() {
    try {
      const api = await import((window.__resources && window.__resources.api) || new URL('pivca-payments-api.js', document.baseURI).href);
      api.configurarSimulacion({ latenciaMs: 600, fallar: false });
      this.setState({ api }, () => this.cargarFins());
    } catch (e) {
      this.setState({ cargandoFins: false, errorFins: 'No pudimos cargar tus financiamientos.' });
    }
  }
  cargarFins() {
    const api = this.state.api;
    if (!api) return;
    this.setState({ cargandoFins: true, errorFins: null });
    api.financiamientosDelCliente()
      .then(fins => this.setState({ fins, cargandoFins: false }))
      .catch(() => this.setState({ fins: [], cargandoFins: false, errorFins: 'No pudimos cargar tus financiamientos.' }));
  }

  /* ---------- utilidades ---------- */
  fmt(n) {
    const v = Number(n) || 0;
    const p = Math.abs(v).toFixed(2).split('.');
    return '$' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1];
  }
  hoyIso() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  fechaCorta(v) {
    if (!v) return '—';
    const d = v instanceof Date ? v : new Date(String(v) + 'T00:00:00');
    const p = n => String(n).padStart(2, '0');
    return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
  }
  digitos(s) { return String(s || '').replace(/\D/g, ''); }
  set(k, patch, cb) { this.setState({ [k]: { ...this.state[k], ...patch } }, cb); }
  tocar(k, campo) { this.set(k, { tocados: { ...this.state[k].tocados, [campo]: true } }); }
  montoTexto(n) { return this.fmt(n).replace('$', '').trim(); }
  /* Valor para un campo editable: sin separador de miles, para que pase la
     validación de formato y se pueda reparsear (1338,90 y no 1.338,90). */
  montoValor(n) { return (Number(n) || 0).toFixed(2).replace('.', ','); }
  sanearMonto(v) {
    let t = String(v).replace(/\./g, ',').replace(/[^\d,]/g, '');
    const i = t.indexOf(',');
    if (i >= 0) t = t.slice(0, i + 1) + t.slice(i + 1).replace(/,/g, '').slice(0, 2);
    return t.slice(0, 13);
  }
  copiar(valor, id) {
    try { if (navigator.clipboard) navigator.clipboard.writeText(String(valor)); } catch (e) { /* noop */ }
    this.setState({ copiado: id });
    if (this.tCopia) clearTimeout(this.tCopia);
    this.tCopia = setTimeout(() => this.setState({ copiado: null }), 1700);
  }

  /* ---------- selección de financiamiento y concepto (compartido) ---------- */
  elegidos(k) {
    const sel = this.state[k].sel;
    return this.state.fins.filter(f => sel.indexOf(f.codigo) >= 0);
  }
  hayAtraso(k) { return this.elegidos(k).some(f => f.estado === 'con_atraso'); }
  composicion(k) {
    const els = this.elegidos(k);
    const atraso = els.filter(f => f.estado === 'con_atraso').length;
    const dia = els.length - atraso;
    if (atraso && dia) return 'mixta';
    if (atraso) return 'atraso';
    return 'dia';
  }
  primario(k) {
    const comp = this.composicion(k);
    if (comp === 'mixta') return { label: 'Lo vencido + cuotas', comp };
    if (comp === 'atraso') return { label: 'Lo vencido', comp };
    return { label: 'Cuota del mes', comp };
  }
  esCalculado(id) { return id === 'exigible' || id === 'total'; }
  campoFin(id, f) {
    if (id === 'total') return 'deudaTotalAlDia';
    if (id === 'exigible') return f.estado === 'con_atraso' ? 'montoVencido' : 'cuotaDelMes';
    return null;
  }
  etiquetaFin(id, f) {
    if (id === 'total') return 'Deuda total al día';
    if (id !== 'exigible') return 'A definir por PIVCA';
    return f.estado === 'con_atraso' ? 'Lo vencido' : 'Cuota del mes';
  }
  calculado(k, id) {
    const c = id || this.state[k].concepto;
    if (!this.esCalculado(c)) return 0;
    return this.elegidos(k).reduce((a, f) => a + (Number(f[this.campoFin(c, f)]) || 0), 0);
  }
  declarativo(k) { return k === 'rp'; }
  modoUnico(k) { return this.state[k].concepto === 'otro'; }

  toggleFin(k, codigo) {
    const s = this.state[k];
    if (this.modoUnico(k)) { this.set(k, { sel: [codigo], aviso: null, abierto: false }); return; }
    const dentro = s.sel.indexOf(codigo) >= 0;
    const sel = dentro ? s.sel.filter(c => c !== codigo) : s.sel.concat([codigo]);
    const patch = { sel, aviso: null };
    if (!sel.length) { patch.concepto = null; patch.monto = ''; }
    else if (s.concepto && s.concepto !== 'otro') {
      const nuevos = this.state.fins.filter(f => sel.indexOf(f.codigo) >= 0);
      const suma = nuevos.reduce((a, f) => a + (Number(f[this.campoFin(s.concepto, f)]) || 0), 0);
      if (this.declarativo(k)) patch.monto = this.montoValor(suma);
    }
    this.set(k, patch);
  }

  elegirConcepto(k, id) {
    const s = this.state[k];
    if (id !== 'otro') {
      const patch = { concepto: id, aviso: null };
      if (this.declarativo(k)) patch.monto = this.montoValor(this.calculado(k, id));
      this.set(k, patch);
      return;
    }
    if (s.sel.length > 1) {
      const primero = s.sel[0];
      const fin = this.state.fins.find(f => f.codigo === primero);
      this.set(k, {
        concepto: 'otro', sel: [primero], monto: '',
        aviso: '«Otro monto» aplica a un solo financiamiento: dejamos ' + primero
             + (fin ? ' · ' + fin.vehiculo : '') + '. La selección pasa a ser única.'
      });
    } else {
      this.set(k, { concepto: 'otro', monto: '', aviso: null });
    }
  }

  montoFinal(k) {
    const s = this.state[k];
    if (this.declarativo(k) || s.concepto === 'otro') {
      return Number(String(s.monto || '0').replace(',', '.')) || 0;
    }
    return this.calculado(k);
  }
  errorMonto(k) {
    const s = this.state[k];
    if (!this.declarativo(k) && s.concepto !== 'otro') return null;
    if (!s.concepto) return null;
    const t = String(s.monto || '').trim();
    if (!t) return 'Indica el monto.';
    if (!/^\d{1,9}(,\d{1,2})?$/.test(t)) return 'Formato no válido: hasta 2 decimales (ej. 350,50).';
    if (!(Number(t.replace(',', '.')) > 0)) return 'El monto debe ser mayor a 0.';
    return null;
  }
  seleccionValida(k) {
    const s = this.state[k];
    if (!s.sel.length || !s.concepto) return false;
    if (this.declarativo(k) || s.concepto === 'otro') return !this.errorMonto(k);
    return this.calculado(k) > 0;
  }
  desglose(k) {
    const s = this.state[k];
    if (!s.concepto) return [];
    if (!this.esCalculado(s.concepto)) {
      const f = this.elegidos(k)[0];
      return f ? [{ codigo: f.codigo, vehiculo: f.vehiculo, concepto: 'A definir por PIVCA', monto: this.montoFinal(k) }] : [];
    }
    return this.elegidos(k).map(f => ({
      codigo: f.codigo, vehiculo: f.vehiculo,
      concepto: this.etiquetaFin(s.concepto, f),
      monto: Number(f[this.campoFin(s.concepto, f)]) || 0
    }));
  }
  bloqueDesglose(cfg) {
    const filas = (cfg.filas || []).filter(t => t && t.codigo);
    if (!filas.length) return null;
    const aten = !!cfg.atenuado;
    const total = cfg.total != null ? cfg.total : filas.reduce((a, t) => a + (Number(t.monto) || 0), 0);
    const pill = cfg.mixto
      ? { color: 'var(--pivca-orange-700)', background: 'var(--pivca-orange-50)', border: '1px solid var(--pivca-orange-300)' }
      : { color: 'var(--pivca-stone-600)', background: '#FFFFFF', border: '1px solid var(--border-strong)' };
    return {
      titulo: cfg.titulo || null,
      wrapStyle: {
        width: '100%', marginTop: cfg.margen || 0,
        border: '1px solid var(--border-default)', background: 'var(--pivca-stone-50)',
        borderRadius: '10px', padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        opacity: aten ? 0.55 : 1
      },
      filas: filas.map(t => ({
        codigo: t.codigo,
        vehiculo: t.vehiculo || '—',
        concepto: t.concepto,
        conceptoStyle: {
          alignSelf: 'flex-start', marginTop: '4px', borderRadius: '999px', padding: '3px 9px',
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          whiteSpace: 'nowrap', color: pill.color, background: pill.background, border: pill.border
        },
        monto: this.fmt(t.monto),
        desenlace: t.desenlace || null,
        desenlaceStyle: {
          fontSize: '11px', fontWeight: 600, lineHeight: 1.4,
          color: t.tono === 'exito' ? 'var(--status-success)' : 'var(--pivca-orange-600)'
        }
      })),
      totalLabel: cfg.totalLabel || 'Total',
      total: this.fmt(total),
      nota: cfg.nota || null,
      aviso: cfg.aviso || null
    };
  }

  /* ---------- tarjeta ---------- */
  franquicia() {
    const d = this.digitos(this.state.tc.numero);
    if (!d) return null;
    if (d[0] === '4') return 'Visa';
    if (d[0] === '5' || d[0] === '2') return 'Mastercard';
    return 'no-soportada';
  }
  luhn(num) {
    let suma = 0, alterno = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let d = Number(num[i]);
      if (alterno) { d *= 2; if (d > 9) d -= 9; }
      suma += d; alterno = !alterno;
    }
    return suma % 10 === 0;
  }
  erroresTC() {
    const s = this.state.tc;
    const e = {};
    if (!s.sel.length) e.sel = 'Selecciona al menos un financiamiento.';
    else if (!s.concepto) e.sel = 'Elige el concepto a pagar.';
    const em = this.errorMonto('tc');
    if (em) e.monto = em;

    const doc = this.digitos(s.doc);
    if (!doc) e.doc = 'Ingresa el documento del titular.';
    else if (doc.length < 6 || doc.length > 9) e.doc = 'Debe tener entre 6 y 9 dígitos.';

    const t = String(s.titular || '').trim();
    if (!t) e.titular = 'Ingresa el nombre del titular.';
    else if (t.length < 3) e.titular = 'Debe tener al menos 3 caracteres.';
    else if (/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/.test(t)) e.titular = 'Solo letras y espacios.';

    const num = this.digitos(s.numero);
    const fr = this.franquicia();
    if (!num) e.numero = 'Ingresa el número de la tarjeta.';
    else if (fr === 'no-soportada') e.numero = 'Solo aceptamos Visa y Mastercard internacionales.';
    else if (num.length < 16) e.numero = 'El número debe tener 16 dígitos: faltan ' + (16 - num.length) + '.';
    else if (!this.luhn(num)) e.numero = 'El número de tarjeta no es válido.';

    const v = this.digitos(s.venc);
    if (v.length < 4) e.venc = 'Indica el vencimiento como MM/AA.';
    else {
      const mes = Number(v.slice(0, 2));
      const anio = 2000 + Number(v.slice(2, 4));
      const hoy = new Date();
      if (mes < 1 || mes > 12) e.venc = 'El mes debe estar entre 01 y 12.';
      else if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) e.venc = 'La tarjeta está vencida.';
    }

    const c = this.digitos(s.cvv);
    if (!c) e.cvv = 'Ingresa el CVV.';
    else if (c.length < 3 || c.length > 4) e.cvv = 'El CVV tiene 3 o 4 dígitos.';
    return e;
  }
  visibleTC(campo) {
    const s = this.state.tc;
    if (!s.enviado && !s.tocados[campo]) return null;
    return this.erroresTC()[campo] || null;
  }
  escenarioTarjeta() {
    const permitidos = ['aplicado', 'conciliacion', 'rechazado', 'no_confirmado', 'parcial'];
    let id = permitidos.indexOf(this.state.escenario) >= 0 ? this.state.escenario : 'aplicado';
    const tx = this.state.tc.tx;
    if (tx) {
      if (id === 'aplicado' && tx.aplicacion !== 'automatica') id = 'conciliacion';
      if (id === 'parcial' && (tx.tramos || []).length < 2) id = 'conciliacion';
    }
    return id;
  }
  pagar() {
    const s = this.state.tc;
    if (s.estado !== 'editando') return;
    const errs = this.erroresTC();
    if (Object.keys(errs).length) { this.set('tc', { enviado: true }); return; }
    const api = this.state.api;
    const sel = this.desglose('tc');
    const tx = {
      referencia: api ? api.nuevaReferenciaPasarela() : 'MS-000000',
      moneda: 'USD', cargos: 1, montoTotal: this.montoFinal('tc'),
      aplicacion: s.concepto === 'otro' ? 'manual' : 'automatica',
      calculadoAl: s.concepto === 'otro' ? null : this.fechaCorta(new Date()),
      tramos: sel.map(t => ({ codigo: t.codigo, vehiculo: t.vehiculo, concepto: t.concepto, monto: t.monto })),
      tarjeta: { franquicia: this.franquicia(), ultimos4: this.digitos(s.numero).slice(-4) }
    };
    this.set('tc', { enviado: true, estado: 'procesando', tx });
    this.tPago = setTimeout(() => this.set('tc', { estado: 'resultado' }), 2200);
  }
  reiniciarTC(limpiarTarjeta) {
    if (this.tPago) clearTimeout(this.tPago);
    const patch = { estado: 'editando', tx: null, enviado: false, tocados: {} };
    if (limpiarTarjeta) { patch.numero = ''; patch.venc = ''; patch.cvv = ''; patch.titular = ''; patch.doc = ''; patch.tipoDoc = 'V'; }
    else { patch.sel = []; patch.concepto = null; patch.monto = ''; patch.numero = ''; patch.venc = ''; patch.cvv = ''; patch.titular = ''; patch.doc = ''; }
    this.set('tc', patch);
  }

  /* ---------- reporte ---------- */
  metodoEfectivo() {
    const s = this.state.rp;
    if (s.metodo === 'deposito') return 'deposito';
    if (s.metodo === 'transferencia') return s.tipo;
    return null;
  }
  errorFecha() {
    const f = this.state.rp.fecha;
    if (!f) return 'Indica cuándo pagaste.';
    if (f > this.hoyIso()) return 'La fecha no puede ser futura.';
    return null;
  }
  sincronizarCuentas() {
    const me = this.metodoEfectivo();
    const f = this.state.rp.fecha;
    const clave = (me && f && !this.errorFecha()) ? me + '|' + f + '|' + this.state.escenario : null;
    if (clave === this._clave) return;
    this._clave = clave;
    if (!clave) {
      if (this.state.rp.cuentas.estado !== 'vacio') this.set('rp', { cuentas: { estado: 'vacio' } });
      return;
    }
    const api = this.state.api;
    if (!api) return;
    const previa = this.state.rp.cuentaId;
    this.set('rp', { cuentas: { estado: 'cargando' }, confirmoRed: false });
    const consulta = this.state.escenario === 'error_catalogo'
      ? new Promise((_, rej) => setTimeout(() => rej(new Error('No pudimos consultar las cuentas de PIVCA.')), 600))
      : api.cuentasVigentesEnFecha(me, f);
    consulta
      .then(lista => {
        if (this._clave !== clave) return;
        const sigue = lista.some(x => x.id === previa);
        this.set('rp', {
          cuentas: { estado: 'listo', lista },
          cuentaId: lista.length === 1 ? lista[0].id : (sigue ? previa : null)
        });
      })
      .catch(err => {
        if (this._clave !== clave) return;
        this.set('rp', { cuentas: { estado: 'error', mensaje: err.message || 'No pudimos consultar las cuentas de PIVCA.' }, cuentaId: null });
      });
  }
  listaCuentas() {
    const c = this.state.rp.cuentas;
    return c.estado === 'listo' ? c.lista : [];
  }
  cuenta() { return this.listaCuentas().find(c => c.id === this.state.rp.cuentaId) || null; }
  principal(x) {
    const d = x.datos || {};
    if (x.metodo === 'deposito') return d.banco;
    if (x.metodo === 'zelle') return d.correo;
    if (x.metodo === 'cripto') return 'USDT ' + d.red;
    return d.identificador;
  }
  secundario(x) {
    const d = x.datos || {};
    if (x.metodo === 'deposito') return d.tipoCuenta + ' · ' + d.numeroCuenta;
    if (x.metodo === 'zelle') return 'Vigente el ' + this.fechaCorta(this.state.rp.fecha);
    if (x.metodo === 'cripto') return 'Red ' + d.red;
    return 'Zinli';
  }
  reglaReferencia(metodo) {
    if (metodo === 'deposito') return { re: /^[A-Za-z0-9]{4,20}$/, pista: 'Alfanumérica, 4 a 20 caracteres, sin espacios.', error: 'La referencia del depósito es alfanumérica, de 4 a 20 caracteres, sin espacios.' };
    if (metodo === 'zelle') return { re: /^[A-Za-z0-9]{6,20}$/, pista: 'Alfanumérica, 6 a 20 caracteres.', error: 'La referencia de Zelle es alfanumérica, de 6 a 20 caracteres.' };
    if (metodo === 'zinli') return { re: /^[A-Za-z0-9]{6,30}$/, pista: 'Alfanumérica, 6 a 30 caracteres.', error: 'La referencia de Zinli es alfanumérica, de 6 a 30 caracteres.' };
    if (metodo === 'cripto') return { re: /^[0-9a-fA-F]{64}$/, pista: 'Hash de la transacción: 64 caracteres hexadecimales.', error: 'El hash de la transacción son 64 caracteres hexadecimales.' };
    return { re: /^.+$/, pista: '', error: 'Ingresa la referencia del pago.' };
  }
  erroresRP() {
    const s = this.state.rp;
    const e = {};
    const me = this.metodoEfectivo();
    if (!s.sel.length) e.sel = 'Selecciona al menos un financiamiento.';
    else if (!s.concepto) e.sel = 'Elige el concepto a pagar.';
    const em = this.errorMonto('rp');
    if (em) e.monto = em;
    const ef = this.errorFecha();
    if (ef) e.fecha = ef;
    if (!s.metodo) e.metodo = 'Elige cómo pagaste.';
    else if (s.metodo === 'transferencia' && !s.tipo) e.metodo = 'Elige el tipo de transferencia.';
    else if (!this.cuenta()) e.metodo = 'Selecciona la cuenta de PIVCA a la que pagaste.';
    else if (me === 'cripto' && !s.confirmoRed) e.metodo = 'Confirma la red antes de continuar.';

    const regla = this.reglaReferencia(me);
    const ref = String(s.referencia || '').trim();
    if (!ref) e.referencia = 'Ingresa la referencia del pago.';
    else if (!regla.re.test(ref)) e.referencia = regla.error;

    if (me === 'zelle') {
      if (!String(s.remNombre).trim()) e.remNombre = 'Ingresa el nombre del emisor.';
      if (!String(s.remCorreo).trim()) e.remCorreo = 'Ingresa el correo del emisor.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s.remCorreo).trim())) e.remCorreo = 'El correo del emisor no es válido.';
    }
    if (me === 'zinli' && !String(s.remUsuario).trim()) e.remUsuario = 'Ingresa el usuario o correo del emisor.';
    if (!s.archivo) e.archivo = s.errArchivo || 'Adjunta el comprobante del pago.';
    return e;
  }
  visibleRP(campo) {
    const s = this.state.rp;
    if (!s.enviado && !s.tocados[campo]) return null;
    return this.erroresRP()[campo] || null;
  }
  archivoValido(f) {
    if (!f) return { error: null, archivo: null };
    const ok = ['image/jpeg', 'image/png', 'application/pdf'];
    if (ok.indexOf(f.type) < 0) return { error: 'Formato no admitido: adjunta JPG, PNG o PDF.', archivo: null };
    if (f.size > 5 * 1024 * 1024) {
      const mb = (f.size / 1048576).toFixed(1).replace('.', ',');
      return { error: 'El comprobante pesa ' + mb + ' MB y el máximo es 5 MB.', archivo: null };
    }
    return { error: null, archivo: { nombre: f.name, tipo: f.type, size: f.size } };
  }
  enviarReporte() {
    const s = this.state.rp;
    if (s.estado !== 'editando') return;
    const errs = this.erroresRP();
    if (Object.keys(errs).length) { this.set('rp', { enviado: true }); return; }
    const api = this.state.api;
    const c = this.cuenta();
    const ref = String(s.referencia).trim();
    this.set('rp', { enviado: true, estado: 'verificando', dup: null, avisoDup: null, errorEnvio: null });

    const forzarDup = this.state.escenario === 'ref_duplicada';
    const buscar = forzarDup && api
      ? new Promise(res => setTimeout(() => res(api.REPORTES_PREVIOS[0]), 600))
      : (api ? api.buscarReportePorReferencia(ref, c.id) : Promise.resolve(null));

    buscar
      .then(previo => {
        if (previo) { this.set('rp', { estado: 'duplicado', dup: previo }); return 'corte'; }
        if (s.confirmadoPosible || !api) return null;
        return api.buscarPosibleDuplicado({ monto: this.montoFinal('rp'), fecha: s.fecha, codigos: s.sel, referencia: ref });
      })
      .then(posible => {
        if (posible === 'corte') return;
        if (posible) { this.set('rp', { estado: 'editando', avisoDup: posible }); return; }
        this.finalizarReporte();
      })
      .catch(err => this.set('rp', { estado: 'editando', errorEnvio: err.message || 'No pudimos verificar el reporte. Intenta de nuevo.' }));
  }
  finalizarReporte() {
    const s = this.state.rp;
    const api = this.state.api;
    const c = this.cuenta();
    const me = this.metodoEfectivo();
    this.set('rp', {
      estado: 'resultado',
      reporte: {
        numero: api ? api.nuevoNumeroReporte() : 'RP-2026-000000',
        estado: 'reportado',
        codigos: s.sel,
        concepto: s.concepto === 'total' ? 'Deuda total al día'
          : s.concepto === 'otro' ? 'Otro monto' : this.primario('rp').label,
        tramos: this.desglose('rp'),
        calculado: this.calculado('rp'),
        otro: s.concepto === 'otro',
        monto: this.montoFinal('rp'),
        fecha: s.fecha,
        metodo: me,
        cuenta: c ? this.principal(c) : null,
        referencia: String(s.referencia).trim(),
        tercero: !!s.tercero,
        comprobante: s.archivo,
        creado: new Date()
      }
    });
  }
  reiniciarRP() {
    this._clave = null;
    this.set('rp', {
      sel: [], concepto: null, monto: '', abierto: false, aviso: null,
      fecha: '', metodo: null, tipo: null, metodoAbierto: false, tipoAbierto: false,
      cuentas: { estado: 'vacio' }, cuentaId: null, cuentaAbierta: false, confirmoRed: false,
      referencia: '', remNombre: '', remCorreo: '', remUsuario: '', tercero: false,
      archivo: null, errArchivo: null, tocados: {}, enviado: false, estado: 'editando',
      reporte: null, dup: null, avisoDup: null, confirmadoPosible: false, errorEnvio: null
    });
  }

  async pintarQr() {
    const c = this.cuenta();
    const visible = c && c.metodo === 'cripto' && this.state.rp.confirmoRed && this.qrRef.current;
    if (!visible) return;
    const firma = c.datos.direccionWallet;
    if (this._qr === firma) return;
    this._qr = firma;
    try {
      const mod = await import((window.__resources && window.__resources.qr) || new URL('qr-min.js', document.baseURI).href);
      mod.dibujarQr(this.qrRef.current, firma, { tinta: '#1F1B16' });
    } catch (e) { this._qr = null; }
  }

  /* ---------- estilos ---------- */
  campo(err, opts) {
    const o = opts || {};
    return {
      width: '100%', height: '46px', padding: '0 14px', borderRadius: '8px',
      boxSizing: 'border-box', fontFamily: o.mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize: '15px', fontWeight: o.mono ? 600 : 400, color: 'var(--pivca-ink-900)',
      background: o.ro ? 'var(--pivca-stone-100)' : 'var(--pivca-stone-100)',
      border: '1px solid ' + (err ? 'var(--status-danger)' : 'transparent'),
      outline: 'none',
      paddingRight: o.icono ? '44px' : '14px',
      transition: 'background 160ms var(--ease-out), border-color 160ms var(--ease-out)'
    };
  }
  trigger(err, activo) {
    return {
      ...this.campo(err), display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '10px', cursor: 'pointer', textAlign: 'left',
      background: activo ? '#fff' : 'var(--pivca-stone-100)',
      borderColor: err ? 'var(--status-danger)' : (activo ? 'var(--pivca-orange-400)' : 'transparent')
    };
  }
  textoTrigger(lleno) {
    return {
      flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      fontSize: '14.5px', color: lleno ? 'var(--pivca-ink-900)' : 'var(--pivca-stone-500)',
      fontFamily: 'var(--font-sans)'
    };
  }
  chev(abierto) {
    return {
      flex: 'none', fontSize: '19px', lineHeight: 1, color: 'var(--pivca-stone-500)',
      transform: abierto ? 'rotate(90deg)' : 'none', transition: 'transform 160ms var(--ease-out)'
    };
  }
  tarjetaOpcion(on) {
    return {
      display: 'flex', flexDirection: 'column', gap: '7px', padding: '13px 14px', borderRadius: '8px',
      cursor: 'pointer', textAlign: 'left', background: on ? 'var(--pivca-orange-50)' : '#fff',
      border: '1px solid ' + (on ? 'var(--pivca-orange-400)' : 'var(--border-strong)'),
      transition: 'background 160ms var(--ease-out), border-color 160ms var(--ease-out)'
    };
  }
  radio(on) {
    return {
      width: '15px', height: '15px', flex: 'none', borderRadius: '999px', background: '#fff',
      border: '1px solid ' + (on ? 'var(--pivca-orange-500)' : 'var(--border-strong)'),
      boxShadow: on ? 'inset 0 0 0 3.5px var(--pivca-orange-400)' : 'none'
    };
  }
  pill(atraso) {
    return {
      flex: 'none', fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.03em', padding: '3px 9px',
      borderRadius: '999px', whiteSpace: 'nowrap',
      background: atraso ? '#FBEEEB' : '#ECF3EC',
      color: atraso ? 'var(--status-danger)' : 'var(--status-success)'
    };
  }
  botonPrimario(off) {
    return {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
      background: 'var(--pivca-orange-500)', color: '#fff', border: 'none', borderRadius: '8px',
      padding: '13px 26px', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700,
      cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.42 : 1,
      boxShadow: off ? 'none' : 'var(--shadow-orange)',
      transition: 'opacity 160ms var(--ease-out), background 160ms var(--ease-out)'
    };
  }
  botonSecundario() {
    return {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      background: '#fff', color: 'var(--pivca-ink-900)', border: '1px solid var(--border-strong)',
      borderRadius: '8px', padding: '12px 22px', fontFamily: 'var(--font-sans)',
      fontSize: '14px', fontWeight: 600, cursor: 'pointer'
    };
  }
  copiarChip(id, off) {
    const on = this.state.copiado === id;
    return {
      flex: 'none', border: '1px solid ' + (on ? 'var(--pivca-orange-500)' : 'var(--border-strong)'),
      background: on ? 'var(--pivca-orange-50)' : '#fff',
      color: on ? 'var(--pivca-orange-600)' : 'var(--pivca-stone-700)',
      borderRadius: '6px', padding: '6px 11px', fontFamily: 'var(--font-sans)', fontSize: '11.5px',
      fontWeight: 600, cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.45 : 1
    };
  }

  /* ---------- resultados ---------- */
  resultado() {
    const s = this.state;
    if (s.tab === 'tdc' && s.tc.estado === 'resultado') return this.resultadoTarjeta();
    if (s.tab === 'reporte' && s.rp.estado === 'duplicado') return this.resultadoDuplicado();
    if (s.tab === 'reporte' && s.rp.estado === 'resultado') return this.resultadoReporte();
    return null;
  }
  filaDato(label, valor, tono) {
    const base = { fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, lineHeight: 1.45, textAlign: 'right', wordBreak: 'break-all', color: 'var(--pivca-ink-900)' };
    if (tono === 'texto') return { label, valor, valorStyle: { ...base, fontFamily: 'var(--font-sans)', fontWeight: 500, wordBreak: 'normal', overflowWrap: 'anywhere' } };
    if (tono === 'exito') return { label, valor, valorStyle: { ...base, fontFamily: 'var(--font-sans)', color: 'var(--status-success)' } };
    if (tono === 'espera') return { label, valor, valorStyle: { ...base, fontFamily: 'var(--font-sans)', color: 'var(--pivca-orange-600)' } };
    if (tono === 'malo') return { label, valor, valorStyle: { ...base, fontFamily: 'var(--font-sans)', color: 'var(--status-danger)' } };
    return { label, valor, valorStyle: base };
  }
  circulo(tono) {
    const mapa = {
      exito: { bg: 'var(--pivca-orange-50)', fg: 'var(--pivca-orange-500)' },
      espera: { bg: '#FDF6E9', fg: 'var(--status-warning)' },
      malo: { bg: '#FCF1EF', fg: 'var(--status-danger)' }
    };
    const c = mapa[tono] || mapa.exito;
    return {
      width: '62px', height: '62px', borderRadius: '999px', background: c.bg, color: c.fg,
      fontSize: '27px', fontWeight: 700, lineHeight: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    };
  }
  bloqueAlerta(tono) {
    const inverso = tono === 'ink';
    return {
      width: '100%', display: 'flex', flexDirection: 'column', gap: '7px', borderRadius: '10px',
      padding: '16px 18px',
      background: inverso ? 'var(--pivca-ink-900)' : 'var(--pivca-orange-50)',
      border: inverso ? 'none' : '1px solid var(--pivca-orange-300)',
      color: inverso ? '#fff' : 'var(--pivca-orange-700)'
    };
  }

  resultadoTarjeta() {
    const tx = this.state.tc.tx || { tramos: [], montoTotal: 0, referencia: '—' };
    const id = this.escenarioTarjeta();
    const multi = (tx.tramos || []).length > 1;
    const acciones = [];
    const f = [];
    let d;

    if (id === 'aplicado' || id === 'conciliacion' || id === 'parcial') {
      const aplicado = id === 'aplicado';
      d = {
        tono: aplicado ? 'exito' : (id === 'parcial' ? 'espera' : 'exito'),
        glifo: id === 'parcial' ? '!' : '✓',
        titulo: aplicado ? 'Pago procesado exitosamente'
          : id === 'parcial' ? 'Cobramos el total; parte queda por asignar'
          : 'Cobramos tu pago correctamente',
        mensaje: aplicado
          ? 'Debitamos tu tarjeta y el pago quedó aplicado: ya se refleja en tu plan de pago.'
          : id === 'parcial'
            ? 'El cargo se hizo por el total en una sola transacción. Un tramo quedó aplicado y el resto lo asignará un ejecutivo.'
            : 'El cargo a tu tarjeta se procesó sin problemas. La asignación al financiamiento la hará un ejecutivo, así que todavía no se refleja en tu plan de pago.',
        alerta: aplicado ? null : 'El motor de prelación de PIVCA determina a qué conceptos se imputa el dinero. Ningún tramo se revierte: el cobro fue por el total.',
        alertaTono: 'naranja'
      };
      f.push(this.filaDato('Referencia', tx.referencia));
      f.push(this.filaDato('Monto debitado', this.fmt(tx.montoTotal)));
      f.push(this.filaDato('Fecha y hora', this.fechaCorta(new Date()) + ' · ' + new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })));
    } else if (id === 'rechazado') {
      d = {
        tono: 'malo', glifo: '×',
        titulo: 'Tu banco rechazó el pago',
        mensaje: 'No se debitó nada de tu tarjeta y no quedó ningún cargo pendiente.',
        alerta: 'Motivo informado por el emisor: fondos insuficientes. Puedes reintentar con otra tarjeta; conservamos el financiamiento y el monto que seleccionaste.',
        alertaTono: 'naranja'
      };
      f.push(this.filaDato('Referencia del intento', tx.referencia));
      f.push(this.filaDato('Monto no debitado', this.fmt(tx.montoTotal)));
      f.push(this.filaDato('Estado', 'Rechazado por el emisor', 'malo'));
      acciones.push({ label: 'Reintentar con otra tarjeta', style: this.botonPrimario(false), ir: () => this.reiniciarTC(true) });
    } else {
      d = {
        tono: 'espera', glifo: '?',
        titulo: 'No pudimos confirmar el resultado',
        mensaje: 'La pasarela no respondió a tiempo. No sabemos si el cobro se realizó, así que revisa tu banco antes de cualquier acción.',
        alerta: 'Si el cobro sí se procesó, un segundo intento genera un doble cargo. Contacta a PIVCA con la referencia del intento y confirmamos qué pasó.',
        alertaTitulo: 'No vuelvas a intentar el pago',
        alertaTono: 'ink'
      };
      f.push(this.filaDato('Referencia del intento', tx.referencia));
      f.push(this.filaDato('Monto del intento', this.fmt(tx.montoTotal)));
      f.push(this.filaDato('Estado', 'No confirmado', 'espera'));
      acciones.push({ label: 'Contactar a Soporte', style: this.botonSecundario(), ir: () => {} });
    }

    acciones.push({ label: 'Volver al inicio', style: id === 'rechazado' ? this.botonSecundario() : this.botonPrimario(false), ir: () => this.reiniciarTC(false) });
    acciones.push({ label: 'Ir a Historial de pagos', style: this.botonSecundario(), ir: () => {} });

    const tramos = tx.tramos || [];
    const mixtoTx = tramos.length > 1 && tramos.some(t => t.concepto !== tramos[0].concepto);
    const conDesenlace = id === 'aplicado' || id === 'conciliacion' || id === 'parcial';
    const filasDg = tramos.map((t, i) => {
      if (id === 'aplicado' || (id === 'parcial' && i === 0)) return { ...t, desenlace: 'Aplicado al financiamiento', tono: 'exito' };
      if (conDesenlace) return { ...t, desenlace: 'Pendiente de asignación' };
      return { ...t };
    });
    const desglose = this.bloqueDesglose({
      titulo: 'Desglose del pago',
      filas: filasDg,
      total: tx.montoTotal,
      totalLabel: id === 'rechazado' ? 'Total no debitado' : conDesenlace ? 'Total debitado' : 'Total del intento',
      mixto: mixtoTx,
      atenuado: !conDesenlace,
      nota: id === 'rechazado'
        ? 'No hubo cobro: no se debitó ningún monto y ningún tramo se aplicó.'
        : conDesenlace
          ? 'El desenlace indica a qué financiamiento va el dinero, no qué cuota queda saldada: la imputación interna la determina el motor de prelación de PIVCA.'
          : 'Sin confirmación de la pasarela no afirmamos el desenlace de ningún tramo.'
    });

    return {
      desglose,
      glifo: d.glifo, circuloStyle: this.circulo(d.tono), titulo: d.titulo, mensaje: d.mensaje,
      alerta: d.alerta, alertaTitulo: d.alertaTitulo || null,
      alertaStyle: this.bloqueAlerta(d.alertaTono === 'ink' ? 'ink' : 'naranja'),
      filas: f,
      copiar: () => this.copiar(tx.referencia, 'ref'),
      copiarLabel: this.state.copiado === 'ref' ? 'Referencia copiada' : 'Copiar referencia',
      copiarStyle: this.copiarChip('ref', false),
      acciones: this.conGuia(acciones)
    };
  }

  resultadoReporte() {
    const r = this.state.rp.reporte || {};
    const nombres = { deposito: 'Depósito', zelle: 'Zelle', cripto: 'Cripto (USDT)', zinli: 'Zinli' };
    const f = [
      this.filaDato('Número de reporte', r.numero),
      this.filaDato('Estado', 'Reportado — pendiente de conciliación', 'espera'),
      this.filaDato('Financiamiento', (r.codigos || []).join(' · ')),
      this.filaDato('Concepto declarado', r.concepto || '—', 'texto'),
      this.filaDato('Monto declarado', this.fmt(r.monto)),
      this.filaDato('Fecha del pago', this.fechaCorta(r.fecha)),
      this.filaDato('Método', nombres[r.metodo] || r.metodo, 'texto'),
      this.filaDato('Cuenta destino', r.cuenta || '—'),
      this.filaDato('Referencia', r.referencia),
      this.filaDato('Comprobante', r.comprobante ? r.comprobante.nombre : '—', 'texto')
    ];
    if (r.tercero) f.push(this.filaDato('Pagó un tercero', 'Sí', 'texto'));
    const tramosRp = (r.tramos || []).map(t => ({ ...t, desenlace: 'Pendiente de conciliación' }));
    const mixtoRp = tramosRp.length > 1 && tramosRp.some(t => t.concepto !== tramosRp[0].concepto);
    const difiereRp = !r.otro && Math.abs((r.monto || 0) - (r.calculado || 0)) > 0.005;
    return {
      desglose: this.bloqueDesglose({
        titulo: 'Desglose declarado',
        filas: tramosRp,
        total: r.otro ? r.monto : (r.calculado || 0),
        totalLabel: r.otro ? 'Total declarado' : 'Total calculado',
        mixto: mixtoRp,
        nota: r.otro
          ? 'Un ejecutivo de PIVCA determinará cómo se aplica este monto al financiamiento.'
          : 'Tesorería verificará el pago antes de aplicarlo. El desenlace indica a qué financiamiento va el dinero, no qué cuota queda saldada.',
        aviso: difiereRp
          ? 'Declaraste ' + this.fmt(r.monto) + ' y el desglose calculado suma ' + this.fmt(r.calculado || 0) + '. Tesorería conciliará con el monto realmente recibido.'
          : null
      }),
      glifo: '✓', circuloStyle: this.circulo('exito'),
      titulo: 'Pago reportado exitosamente',
      mensaje: 'Tu reporte fue recibido y está en proceso de verificación. Revisamos los reportes en días hábiles y te notificamos cuando sea confirmado.',
      alerta: 'Ningún reporte se aplica de inmediato: cuando operaciones concilie el pago, el motor de prelación decide a qué conceptos se imputa.',
      alertaTitulo: null, alertaStyle: this.bloqueAlerta('naranja'),
      filas: f,
      copiar: () => this.copiar(r.numero, 'num'),
      copiarLabel: this.state.copiado === 'num' ? 'Número copiado' : 'Copiar número de reporte',
      copiarStyle: this.copiarChip('num', false),
      acciones: this.conGuia([
        { label: 'Volver al inicio', style: this.botonPrimario(false), ir: () => this.reiniciarRP() },
        { label: 'Ir a Historial de pagos', style: this.botonSecundario(), ir: () => {} }
      ])
    };
  }

  resultadoDuplicado() {
    const p = this.state.rp.dup || {};
    const estados = { reportado: 'Reportado — pendiente de conciliación', en_conciliacion: 'En conciliación', aplicado: 'Aplicado' };
    return {
      glifo: '×', circuloStyle: this.circulo('malo'),
      titulo: 'Esa referencia ya fue reportada',
      mensaje: 'No enviamos el reporte para no duplicarlo. Ya existe un reporte con esa referencia en la misma cuenta destino.',
      alerta: null, alertaTitulo: null, alertaStyle: this.bloqueAlerta('naranja'),
      filas: [
        this.filaDato('Número de reporte', p.numero),
        this.filaDato('Referencia', p.referencia),
        this.filaDato('Fecha del pago', this.fechaCorta(p.fecha)),
        this.filaDato('Monto declarado', this.fmt(p.monto)),
        this.filaDato('Estado actual', estados[p.estado] || p.estado, 'espera')
      ],
      copiar: null, copiarLabel: null, copiarStyle: null,
      acciones: this.conGuia([
        { label: 'Corregir la referencia', style: this.botonPrimario(false), ir: () => this.set('rp', { estado: 'editando', dup: null, referencia: '', enviado: false }) },
        { label: 'Ver ese reporte en el historial', style: this.botonSecundario(), ir: () => {} }
      ])
    };
  }

  /* ---------- render ---------- */
  /* ══════ RECORRIDO GUIADO ══════
     Mismo motor que el portal del concesionario: halo sobre el objetivo,
     globo que se recoloca esquivando obstáculos y barra de progreso. */

  guion() {
    const g = GUION_CLI_BASE.slice();
    (GUION_CLI[this.state.carril] || []).forEach(e => {
      g.push({ fase: 'app', target: e.target, titulo: e.titulo, tip: e.tip });
    });
    return g.map((e, i) => Object.assign({}, e, { kicker: 'Paso ' + (i + 1) }));
  }

  step() {
    if (this.props.guiaActiva === false) return null;
    if (this.state.libre) return null;
    const g = this.guion();
    const s = g[this.state.paso];
    if (!s) return null;
    if (s.fase !== this.state.fase) return null;
    // Cada carril vive en su pestaña: si el usuario se fue a la otra, el paso
    // se convierte en una redirección de vuelta en vez de apuntar a la nada.
    if (s.fase === 'app' && this.state.paso > 3) {
      const quiere = this.state.carril === 'reporte' ? 'reporte' : 'tdc';
      if (this.state.tab !== quiere && s.target.indexOf('cli-tab-') !== 0) {
        return Object.assign({}, s, {
          target: quiere === 'reporte' ? 'cli-tab-rp' : 'cli-tab-tdc', redirect: true,
          tip: 'Vuelve a la pestaña donde íbamos para seguir el recorrido.'
        });
      }
    }
    return s;
  }

  next() {
    const n = this.guion().length;
    this.setState(s => ({ paso: Math.min(s.paso + 1, n) }));
  }

  nudge(msg) {
    if (this.tToast) clearTimeout(this.tToast);
    this.setState({ toast: msg || 'Ese control existe, pero ahora practicamos otra cosa.' });
    this.tToast = setTimeout(() => this.setState({ toast: null }), 2800);
  }

  // Si el handler devuelve false la acción no se dio por cumplida: el guion
  // no avanza (un login con credenciales erradas no cuenta como paso).
  guard(key, fn, strict) {
    return () => {
      const st = this.step();
      const onTarget = !!st && st.target === key;
      let ok = true;
      if (!st || onTarget) { if (fn) ok = fn() !== false; }
      else if (!strict) { if (fn) ok = fn() !== false; }
      if (onTarget) { if (!st.redirect && ok) this.next(); }
      else if (st) this.nudge();
    };
  }

  /* ---------- acceso ---------- */
  entrar() {
    const st = this.state;
    if (st.entrando) return false;
    const mail = (st.email || '').trim().toLowerCase();
    const clave = st.pass || '';
    if (!mail || !clave) { this.setState({ loginErr: 'Escribe tu correo y tu contraseña.' }); return false; }
    if (mail !== CRED.email || clave !== CRED.pass) {
      this.setState({ loginErr: 'Correo o contraseña incorrectos.' });
      return false;
    }
    if (st.recordar) abrirSesion();
    this.setState({ entrando: true, loginErr: '' });
    setTimeout(() => this.setState({ fase: 'app', entrando: false }), 420);
    return true;
  }

  salir = () => {
    olvidar(); cerrarSesion();
    this.setState({ fase: 'login', paso: 3, menuUsuario: false,
      email: '', pass: '', loginErr: '', entrando: false, verPass: false });
  };

  reiniciar = (mantenerEscenario) => {
    if (this.tToast) clearTimeout(this.tToast);
    if (this.tGuardar) clearTimeout(this.tGuardar);
    if (this.tPago) clearTimeout(this.tPago);
    olvidar();
    if (!mantenerEscenario) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) {}
    }
    this.setState({
      fase: mantenerEscenario ? 'login' : 'escenario',
      paso: mantenerEscenario ? 3 : 0,
      email: '', pass: '', loginErr: '', entrando: false, menuUsuario: false, libre: false,
      tab: 'tdc', tip: null, toast: null, copiado: null,
      tc: { sel: [], concepto: null, monto: '', abierto: false, aviso: null, tipoDoc: 'V', doc: '',
        titular: '', numero: '', venc: '', cvv: '', tocados: {}, enviado: false, estado: 'editando',
        tx: null, resultado: null },
      rp: { sel: [], concepto: null, monto: '', abierto: false, aviso: null, fecha: '', metodo: null,
        tipo: null, metodoAbierto: false, tipoAbierto: false, cuentas: { estado: 'vacio' }, cuentaId: null,
        cuentaAbierta: false, confirmoRed: false, referencia: '', remNombre: '', remCorreo: '',
        remUsuario: '', tercero: false, archivo: null, errArchivo: null, arrastrando: false, tocados: {},
        enviado: false, estado: 'editando', reporte: null, dup: null, avisoDup: null,
        confirmadoPosible: false, errorEnvio: null }
    });
  };

  /* ---------- rellenos de ejemplo ---------- */
  ejemploTarjeta = () => {
    this.set('tc', {
      tipoDoc: 'V', doc: '29827910', titular: 'JOSE RAMON LINARES',
      numero: '4111 1111 1111 1111', venc: '09/29', cvv: '123',
      tocados: {}, enviado: false
    });
  };

  ejemploReporte = () => {
    const s = this.state.rp;
    const me = this.metodoEfectivo();
    const ref = me === 'cripto'
      ? 'a3f91c07be452d18fa6b0c93de741825cc09b7f4e61a2d830b5fc17e94ad6206'
      : '004417829365';
    const patch = { referencia: ref, remNombre: 'JOSE RAMON LINARES',
      remCorreo: 'jose.linares@correo.com', remUsuario: 'joselinares',
      archivo: { nombre: 'comprobante_pago.pdf', tipo: 'application/pdf', size: 254 * 1024 },
      confirmoRed: true,
      errArchivo: null, tocados: {}, enviado: false };
    if (!s.fecha) patch.fecha = this.hoyIso();
    this.set('rp', patch);
  };

  /* Marca las acciones de cualquier pantalla de resultado para que el
     recorrido pueda apuntar a ellas y cerrarse con la primera. */
  conGuia(lista) {
    return lista.map((a, i) => Object.assign({}, a, {
      gkey: 'cli-res-' + i,
      ir: this.guard('cli-res-' + i, a.ir)
    }));
  }

  /* ---------- motor del globo ---------- */
  applyHalo() {
    document.querySelectorAll('[data-guide-active]').forEach(e => e.removeAttribute('data-guide-active'));
    const st = this.step();
    if (!st) return null;
    const el = document.querySelector('[data-guide="' + st.target + '"]');
    if (el) el.setAttribute('data-guide-active', 'true');
    if (!el) {
      this._perdido = (this._perdido || 0) + 1;
      if (this._perdido === 6 && this._avisado !== this.state.paso) {
        this._avisado = this.state.paso;
        this.nudge('El objetivo está fuera de pantalla. Desplázate o pulsa «¿Dónde pulso?».');
      }
    } else { this._perdido = 0; }
    return el;
  }

  obstaculos(tgt) {
    const vh = window.innerHeight;
    const out = [];
    document.querySelectorAll('h1,h2,h3,h4,p,label,span,div,button,input,select').forEach(n => {
      if (n === tgt || n.contains(tgt)) return;
      if (n.closest('[data-tip], [data-tip-ignore]')) return;
      if (n.children.length) return;
      const txt = (n.textContent || '').trim();
      if (!txt && n.tagName !== 'INPUT' && n.tagName !== 'SELECT') return;
      const r = n.getBoundingClientRect();
      if (r.width < 10 || r.height < 8) return;
      if (r.bottom < 40 || r.top > vh - 40) return;
      out.push({ r: r, peso: n.closest('[data-tip-keep]') ? 100 : 1 });
    });
    return out;
  }

  encuadrar(cont) {
    const vh = window.innerHeight;
    const r = cont.getBoundingClientRect();
    if (r.top >= 128 && (r.bottom <= vh - 96 || r.height > vh - 224)) return;
    window.scrollTo(0, Math.max(0, window.scrollY + r.top - 128));
  }

  ajustarVentana(el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.top < 120) window.scrollTo(0, Math.max(0, window.scrollY + r.top - 130));
    else if (r.bottom > vh - 120) window.scrollTo(0, window.scrollY + (r.bottom - vh) + 130);
  }

  contenedor(el) {
    let n = el.parentElement;
    while (n && n !== document.body) {
      const st = getComputedStyle(n);
      if (/(auto|scroll)/.test(st.overflowY) && n.scrollHeight > n.clientHeight + 4) return n;
      n = n.parentElement;
    }
    return null;
  }

  elegirSitio(el, W, H) {
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const obs = this.obstaculos(el);
    const cand = [
      { modo: 'below', top: r.bottom + 12, left: Math.min(Math.max(12, r.left), vw - W - 12) },
      { modo: 'above', top: r.top - H - 12, left: Math.min(Math.max(12, r.left), vw - W - 12) },
      { modo: 'right', top: Math.min(Math.max(12, r.top - 10), vh - H - 12), left: r.right + 12 },
      { modo: 'left', top: Math.min(Math.max(12, r.top - 10), vh - H - 12), left: r.left - W - 12 }
    ];
    let mejor = null;
    for (const c of cand) {
      let choques = 0;
      if (c.left < 8 || c.left + W > vw - 8 || c.top < 8 || c.top + H > vh - 8) choques += 100;
      for (const o of obs) {
        const sep = !(c.left > o.r.right || c.left + W < o.r.left || c.top > o.r.bottom || c.top + H < o.r.top);
        if (sep) choques += o.peso;
      }
      if (!mejor || choques < mejor.choques) mejor = Object.assign({}, c, { choques: choques });
    }
    return mejor;
  }

  altoTip() {
    const n = document.querySelector('[data-tip]');
    return n ? Math.max(96, n.getBoundingClientRect().height) : 132;
  }

  measure() {
    const el = this.applyHalo();
    if (!el) { if (this.state.tip) this.setState({ tip: null }); return; }
    const W = Math.min(340, window.innerWidth - 32);
    const H = this.altoTip();
    const sitio = this.elegirSitio(el, W, H);
    const r = el.getBoundingClientRect();
    const cy = Math.max(10, Math.min(H - 16, r.top + r.height / 2 - sitio.top));
    const t = this.state.tip;
    if (t && Math.abs(t.top - sitio.top) < 2 && Math.abs(t.left - sitio.left) < 2 && t.modo === sitio.modo) return;
    this.setState({ tip: { top: sitio.top, left: sitio.left, w: W, modo: sitio.modo, cy: cy } });
  }

  centrar() {
    const st = this.step();
    if (!st) return;
    const el = document.querySelector('[data-guide="' + st.target + '"]');
    if (!el) return;
    const vh = window.innerHeight;
    const W = Math.min(340, window.innerWidth - 32);
    const H = this.altoTip();
    const cont = this.contenedor(el);
    if (cont) this.encuadrar(cont);
    const alto = cont ? cont.clientHeight : vh;
    const base = cont ? cont.scrollTop : window.scrollY;
    const cTop = cont ? cont.getBoundingClientRect().top : 0;
    const absTop = base + el.getBoundingClientRect().top - cTop;
    const poner = (y) => { if (cont) cont.scrollTop = y; else window.scrollTo(0, y); };
    const visible = () => {
      const r = el.getBoundingClientRect();
      const lim0 = cont ? Math.max(110, cTop + 14) : 130;
      const lim1 = cont ? Math.min(vh - 96, cTop + alto - 14) : (vh - 150);
      return r.top > lim0 && r.bottom < lim1;
    };
    if (this.elegirSitio(el, W, H).choques < 100 && visible()) {
      this.ajustarVentana(el); setTimeout(this._m, 240); return;
    }
    const objetivos = [alto * 0.30, Math.max(70, alto - H - 120), alto * 0.45, 40, alto * 0.6];
    let ganador = null;
    for (let i = 0; i < objetivos.length; i++) {
      const y = Math.max(0, absTop - objetivos[i]);
      poner(y);
      if (this.elegirSitio(el, W, H).choques < 100 && visible()) { ganador = y; break; }
    }
    poner(base);
    if (ganador === null) {
      if (visible()) { setTimeout(this._m, 240); return; }
      ganador = Math.max(0, absTop - alto * 0.32);
    }
    poner(ganador);
    this.ajustarVentana(el);
    setTimeout(this._m, 240);
  }

  onDonde = () => {
    const st = this.step();
    if (!st) return;
    const el = document.querySelector('[data-guide="' + st.target + '"]');
    if (!el) { this.nudge('El objetivo todavía no está en pantalla.'); return; }
    this._lastPaso = null;
    this.centrar();
    el.setAttribute('data-guide-flash', 'true');
    setTimeout(() => el.removeAttribute('data-guide-flash'), 1300);
    setTimeout(this._m, 560);
  };

  renderVals() {
    const s = this.state;
    const movil = s.vista === 'movil';
    const tc = s.tc, rp = s.rp;
    const me = this.metodoEfectivo();
    const c = this.cuenta();
    const lista = this.listaCuentas();
    const res = this.resultado();

    const opciones = (k) => s.fins.map((f, iF) => {
      const on = s[k].sel.indexOf(f.codigo) >= 0;
      const atraso = f.estado === 'con_atraso';
      const gk = 'cli-' + k + '-fin-' + iF;
      return {
        codigo: f.codigo, vehiculo: f.vehiculo, gkey: gk,
        estado: atraso ? 'Con atraso' : 'Al día', pillStyle: this.pill(atraso),
        marca: on ? '✓' : '', toggle: this.guard(gk, () => this.toggleFin(k, f.codigo)),
        style: {
          display: 'flex', alignItems: 'center', gap: '11px', padding: '12px 14px', cursor: 'pointer',
          background: on ? 'var(--pivca-orange-50)' : '#fff',
          borderBottom: '1px solid var(--border-default)'
        },
        boxStyle: {
          width: '17px', height: '17px', flex: 'none',
          borderRadius: this.modoUnico(k) ? '999px' : '4px',
          border: '1px solid ' + (on ? 'var(--pivca-orange-500)' : 'var(--border-strong)'),
          background: on ? 'var(--pivca-orange-400)' : '#fff', color: '#fff',
          fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }
      };
    });

    const conceptos = (k) => {
      const prim = this.primario(k);
      return [
        { id: 'exigible', label: prim.label },
        { id: 'total', label: 'Deuda total al día' },
        { id: 'otro', label: 'Otro monto' }
      ].map((d, iC) => {
        const on = s[k].concepto === d.id;
        const calc = this.esCalculado(d.id);
        const gk = 'cli-' + k + '-concepto-' + iC;
        return {
          label: d.label, gkey: gk,
          elegir: this.guard(gk, () => this.elegirConcepto(k, d.id)),
          style: this.tarjetaOpcion(on), radioStyle: this.radio(on),
          monto: calc ? this.fmt(this.calculado(k, d.id)) : 'Tú defines el monto',
          montoStyle: {
            fontFamily: calc ? 'var(--font-mono)' : 'var(--font-sans)',
            fontSize: calc ? '15px' : '12px', fontWeight: calc ? 700 : 500,
            color: on ? 'var(--pivca-orange-600)' : (calc ? 'var(--pivca-ink-900)' : 'var(--pivca-stone-500)')
          }
        };
      });
    };

    const resumenSel = (k) => {
      const els = this.elegidos(k);
      if (!els.length) return 'Selecciona un financiamiento';
      if (els.length === 1) return els[0].codigo + ' · ' + els[0].vehiculo;
      return els.length + ' financiamientos seleccionados';
    };

    const errTC = this.erroresTC();
    const errRP = this.erroresRP();
    const tcBloqueado = tc.estado !== 'editando';
    const rpBloqueado = rp.estado === 'verificando';
    const franq = this.franquicia();
    const soportada = franq === 'Visa' || franq === 'Mastercard';
    const reglaRef = this.reglaReferencia(me);

    const camposRem = [];
    if (me === 'zelle') {
      camposRem.push({ key: 'remNombre', label: 'Nombre del emisor', placeholder: 'Nombre en la cuenta Zelle' });
      camposRem.push({ key: 'remCorreo', label: 'Email de origen Zelle', placeholder: 'correo@dominio.com' });
    } else if (me === 'zinli') {
      camposRem.push({ key: 'remUsuario', label: 'Usuario o correo del emisor', placeholder: 'usuario Zinli o correo' });
    } else if (me === 'deposito') {
      camposRem.push({ key: 'remNombre', label: 'Nombre del depositante (opcional)', placeholder: 'Quién hizo el depósito' });
    }

    const d = c ? (c.datos || {}) : {};
    const oculta = !!(c && c.metodo === 'cripto' && !rp.confirmoRed);
    let panelFilas = null;
    if (c && c.metodo === 'deposito') {
      panelFilas = [
        { label: 'Banco', valor: d.banco, copiable: false, dato: false },
        { label: 'Número de cuenta', valor: d.numeroCuenta, copiable: true, dato: true },
        { label: 'Titular', valor: d.titular, copiable: true, dato: false },
        { label: 'RIF', valor: d.rif, copiable: true, dato: true },
        { label: 'Tipo de cuenta', valor: d.tipoCuenta, copiable: false, dato: false }
      ];
    } else if (c && c.metodo === 'zelle') {
      panelFilas = [{ label: 'Correo Zelle', valor: d.correo, copiable: true, dato: true }];
    } else if (c && c.metodo === 'zinli') {
      panelFilas = [
        { label: 'Identificador Zinli', valor: d.identificador, copiable: true, dato: true },
        { label: 'Beneficiario', valor: d.beneficiario, copiable: true, dato: false }
      ];
    }
    if (panelFilas) {
      panelFilas = panelFilas.map((f, i) => ({
        label: f.label, valor: f.valor, copiable: f.copiable,
        valorStyle: f.dato
          ? { fontFamily: 'var(--font-mono)', fontSize: '13.5px', fontWeight: 600, lineHeight: 1.4, color: 'var(--pivca-ink-900)', wordBreak: 'break-all' }
          : { fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, lineHeight: 1.45, color: 'var(--pivca-ink-900)', overflowWrap: 'anywhere' },
        botonLabel: s.copiado === 'p' + i ? 'Copiado' : 'Copiar',
        botonStyle: this.copiarChip('p' + i, false),
        copiar: () => this.copiar(f.valor, 'p' + i)
      }));
    }

    const defsEscenario = [
      { id: 'aplicado', label: 'Aprobado y aplicado' },
      { id: 'conciliacion', label: 'Aprobado, en conciliación' },
      { id: 'rechazado', label: 'Rechazado por el emisor' },
      { id: 'no_confirmado', label: 'No confirmado' },
      { id: 'parcial', label: 'Fallo parcial de asignación' },
      { id: 'ref_duplicada', label: 'Referencia duplicada' },
      { id: 'error_catalogo', label: 'Error de carga del catálogo' }
    ];

    /* ---------- recorrido guiado, acceso y escenario ---------- */
    const pasoGuia = this.step();
    const totalGuia = this.guion().length;
    const terminado = s.fase === 'app' && !s.libre && s.paso >= totalGuia;
    const hechosGuia = Math.min(s.paso, totalGuia);
    const desenlaces = DESENLACES_CLI[s.carril] || [];
    const escenarioOk = desenlaces.some(d => d.id === s.escenario) ? s.escenario : desenlaces[0].id;

    const tip = s.tip;
    const tipStyle = tip ? {
      position: 'fixed', zIndex: 220, top: tip.top + 'px', left: tip.left + 'px', width: tip.w + 'px',
      animation: 'pvTipIn 220ms cubic-bezier(0.22,1,0.36,1) both'
    } : null;
    const FLECHA = {
      below: { top: '-5px', left: '22px' },
      above: { top: 'calc(100% - 6px)', left: '22px' },
      right: { top: (tip ? tip.cy : 0) + 'px', left: '-5px' },
      left: { top: (tip ? tip.cy : 0) + 'px', left: 'calc(100% - 6px)' }
    };
    const flecha = FLECHA[tip ? tip.modo : 'below'] || FLECHA.below;

    const tarjetaEscenario = (sel) => ({
      display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', cursor: 'pointer',
      border: '1px solid ' + (sel ? 'var(--pivca-orange-400)' : 'var(--border-default)'),
      background: sel ? 'var(--pivca-orange-50)' : '#fff',
      borderRadius: '10px', padding: '14px 16px', fontFamily: 'var(--font-sans)'
    });

    const valsGuia = {
      esEscenario: s.fase === 'escenario',
      esLogin: s.fase === 'login',
      esApp: s.fase === 'app' && !terminado,
      esFin: terminado,
      cierreTexto: s.carril === 'reporte'
        ? 'Declaraste un pago hecho por fuera y lo mandaste a conciliar. A partir de aquí PIVCA lo verifica contra el movimiento real del banco: el cliente no tiene que hacer nada más, sólo guardar el número de reporte por si hay que consultarlo.'
        : 'Cobraste una cuota con tarjeta y viste el desenlace. PIVCA no almacena los datos de la tarjeta: el cargo lo procesa la pasarela, y lo que vuelve al portal es el resultado y la referencia.',
      practicado: s.carril === 'reporte' ? [
        { t: 'Elegiste el financiamiento y declaraste cuánto pagaste' },
        { t: 'Viste los cuatro métodos que admite el portal: depósito, Zelle, cripto y Zinli' },
        { t: 'Comprobaste que las cuentas de PIVCA se listan por la fecha del pago, no por un interruptor' },
        { t: 'Copiaste los datos de la cuenta sin transcribirlos a mano' },
        { t: 'Adjuntaste el comprobante y enviaste el reporte a conciliación' }
      ] : [
        { t: 'Elegiste el financiamiento y el monto ya calculado por el sistema' },
        { t: 'Viste que se puede repartir un pago entre varios financiamientos' },
        { t: 'Pagaste con tarjeta y esperaste el desenlace de la pasarela' },
        { t: 'Leíste la referencia: es lo que el cliente comunica si hay que revisar algo' },
        { t: 'Comprobaste que PIVCA no guarda los datos de la tarjeta' }
      ],

      carriles: CARRILES.map(c => ({
        label: c.label, desc: c.desc,
        style: tarjetaEscenario(s.carril === c.id),
        elegir: this.guard('cli-scn-carril', () => this.setState({ carril: c.id }))
      })),
      desenlaces: desenlaces.map(d => ({
        label: d.label, desc: d.desc,
        style: tarjetaEscenario(escenarioOk === d.id),
        elegir: this.guard('cli-scn-desenlace', () => this.setState({ escenario: d.id }))
      })),
      resumenEscenario: (CARRILES.find(c => c.id === s.carril) || CARRILES[0]).label + ' · '
        + (desenlaces.find(d => d.id === escenarioOk) || desenlaces[0]).label,
      comenzar: this.guard('cli-scn-comenzar', () => {
        escribirHash(s.carril, escenarioOk);
        this.setState({ escenario: escenarioOk, tab: s.carril === 'reporte' ? 'reporte' : 'tdc', fase: 'login' });
      }, true),

      email: s.email,
      clave: s.pass,
      claveTipo: s.verPass ? 'text' : 'password',
      ojoIcono: s.verPass ? 'Ocultar' : 'Ver',
      recordar: s.recordar,
      hayLoginErr: !!s.loginErr,
      loginErr: s.loginErr,
      loginBorde: s.loginErr ? '#B23A2D' : 'var(--border-strong)',
      loginFondo: s.loginErr ? '#FDF5F4' : 'var(--pivca-stone-50)',
      loginLabel: s.entrando ? 'Entrando…' : 'Iniciar sesión →',
      onEmail: (e) => this.setState({ email: e.target.value, loginErr: '' }),
      onClave: (e) => this.setState({ pass: e.target.value, loginErr: '' }),
      onRecordar: (e) => this.setState({ recordar: !!e.target.checked }),
      onLoginKey: (e) => { if (e.key === 'Enter') this.guard('cli-login', () => this.entrar(), true)(); },
      onOjo: () => this.setState({ verPass: !s.verPass }),
      entrar: this.guard('cli-login', () => this.entrar(), true),
      inicial: ((s.email || CRED.email).trim().charAt(0) || 'j').toUpperCase(),
      usuarioCorreo: s.email || CRED.email,
      menuUsuario: s.menuUsuario,
      toggleUsuario: () => this.setState({ menuUsuario: !s.menuUsuario }),
      salir: this.salir,

      libre: s.libre,
      libreLabel: s.libre ? 'Seguir la guía' : 'Explorar libremente',
      onLibre: () => this.setState(x => ({ libre: !x.libre, toast: null })),
      onReiniciar: () => this.reiniciar(false),
      onRepetir: () => this.reiniciar(true),

      hayGuia: !!pasoGuia,
      pasoLabel: pasoGuia ? ('Paso ' + (s.paso + 1) + ' de ' + totalGuia) : '',
      pasoTitulo: pasoGuia ? pasoGuia.titulo : '',
      guiaAncho: Math.round((hechosGuia / totalGuia) * 100) + '%',
      hayTip: !!pasoGuia && !!tipStyle,
      tipStyle: tipStyle,
      tipTexto: pasoGuia ? pasoGuia.tip : '',
      tipKicker: pasoGuia ? pasoGuia.kicker : '',
      flechaTop: flecha.top,
      flechaLeft: flecha.left,
      onDonde: this.onDonde,
      hayToast: !!s.toast,
      toastTexto: s.toast || '',

      ejemploTC: this.guard('cli-tc-ejemplo', this.ejemploTarjeta),
      ejemploRP: this.guard('cli-rp-ejemplo', this.ejemploReporte)
    };

    return Object.assign(valsGuia, {
      verdadero: true,
      hoyIso: this.hoyIso(),
      estilos: {
        escritorio: {
          minHeight: '100vh', fontFamily: 'var(--font-sans)', paddingTop: '34px',
          background: movil ? 'var(--pivca-stone-200)' : 'var(--pivca-stone-50)',
          padding: movil ? '26px 0' : '0'
        },
        app: {
          width: movil ? '390px' : '100%',
          margin: movil ? '0 auto' : '0',
          minHeight: movil ? '780px' : '100vh',
          background: 'var(--pivca-stone-50)',
          border: movil ? '1px solid var(--border-strong)' : 'none',
          borderRadius: movil ? '14px' : '0',
          overflow: movil ? 'clip' : 'visible',
          boxShadow: movil ? 'var(--shadow-lg)' : 'none',
          transition: 'width 300ms var(--ease-out)'
        },
        toggleWrap: {
          position: 'fixed', top: movil ? '14px' : '78px', right: movil ? '16px' : '22px', zIndex: 90,
          display: 'flex', alignItems: 'center', gap: '3px', padding: '3px',
          background: 'rgba(255,255,255,0.88)', border: '1px solid var(--border-default)',
          borderRadius: '999px', boxShadow: '0 1px 3px rgba(31,27,22,0.06)'
        },
        popover: {
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
          background: '#fff', border: '1px solid var(--border-strong)', borderRadius: '8px',
          boxShadow: 'var(--shadow-md)', maxHeight: '272px', overflowY: 'auto'
        },
        error: { fontSize: '12px', lineHeight: 1.4, color: 'var(--status-danger)', fontWeight: 500 },
        botonGhost: {
          background: '#fff', border: '1px solid var(--border-strong)', borderRadius: '6px',
          padding: '8px 14px', fontFamily: 'var(--font-sans)', fontSize: '12.5px', fontWeight: 600,
          color: 'var(--pivca-ink-900)', cursor: 'pointer'
        },
        botonIcono: {
          flex: 'none', width: '26px', height: '26px', borderRadius: '6px', border: 'none',
          background: 'var(--pivca-stone-100)', color: 'var(--pivca-stone-600)',
          fontSize: '15px', lineHeight: 1, cursor: 'pointer'
        }
      },

      navegacion: [
        { label: 'Home', activo: false }, { label: 'Pagar', activo: true },
        { label: 'Historial de pagos', activo: false }, { label: 'Perfil', activo: false }
      ].map(n => ({
        label: n.label,
        style: {
          fontSize: '14.5px', fontWeight: n.activo ? 600 : 400, whiteSpace: 'nowrap',
          color: n.activo ? 'var(--pivca-orange-500)' : 'var(--pivca-stone-700)',
          paddingBottom: '3px',
          borderBottom: '2px solid ' + (n.activo ? 'var(--pivca-orange-400)' : 'transparent'),
          cursor: n.activo ? 'default' : 'not-allowed'
        }
      })),

      pestanas: [
        { id: 'tdc', label: 'Pagar con TDC' },
        { id: 'reporte', label: 'Reportar pago' }
      ].map(t => {
        const on = s.tab === t.id;
        const gk = t.id === 'tdc' ? 'cli-tab-tdc' : 'cli-tab-rp';
        return {
          label: t.label, gkey: gk,
          ir: this.guard(gk, () => this.setState({ tab: t.id })),
          style: {
            display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none',
            padding: '11px 18px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            fontSize: '14.5px', fontWeight: on ? 600 : 500,
            color: on ? 'var(--pivca-orange-500)' : 'var(--pivca-stone-700)',
            borderBottom: '2px solid ' + (on ? 'var(--pivca-orange-400)' : 'transparent'),
            transition: 'color 160ms var(--ease-out)'
          }
        };
      }),

      cargandoFins: s.cargandoFins,
      errorFins: s.errorFins,
      recargarFins: () => this.cargarFins(),

      verFormularioTarjeta: s.tab === 'tdc' && tc.estado !== 'resultado',
      verFormularioReporte: s.tab === 'reporte' && rp.estado !== 'resultado' && rp.estado !== 'duplicado',
      res,

      tc: {
        abierto: tc.abierto,
        abrirLista: this.guard('cli-tc-fin', () => this.set('tc', { abierto: !tc.abierto })),
        opciones: opciones('tc'),
        resumen: resumenSel('tc'),
        errSel: this.visibleTC('sel'),
        haySeleccion: tc.sel.length > 0,
        conceptos: conceptos('tc'),
        aviso: tc.aviso,
        montoTexto: tc.concepto && tc.concepto !== 'otro' ? this.montoTexto(this.calculado('tc')) : tc.monto,
        montoRO: !!(tc.concepto && tc.concepto !== 'otro'),
        onMonto: (e) => this.set('tc', { monto: this.sanearMonto(e.target.value), tocados: { ...tc.tocados, monto: true } }),
        blurMonto: () => this.tocar('tc', 'monto'),
        errMonto: this.visibleTC('monto'),
        sello: tc.concepto && tc.concepto !== 'otro'
          ? 'Calculado al ' + this.fechaCorta(new Date()) + ' · válido hasta las 23:59'
          : null,
        tipoDoc: tc.tipoDoc,
        onTipoDoc: (e) => this.set('tc', { tipoDoc: e.target.value }),
        doc: tc.doc,
        onDoc: (e) => this.set('tc', { doc: this.digitos(e.target.value).slice(0, 9) }),
        blurDoc: () => this.tocar('tc', 'doc'),
        errDoc: this.visibleTC('doc'),
        titular: tc.titular,
        onTitular: (e) => this.set('tc', { titular: e.target.value.slice(0, 60) }),
        blurTitular: () => this.tocar('tc', 'titular'),
        errTitular: this.visibleTC('titular'),
        numero: tc.numero,
        onNumero: (e) => this.set('tc', { numero: this.digitos(e.target.value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }),
        blurNumero: () => this.tocar('tc', 'numero'),
        errNumero: this.visibleTC('numero'),
        franquicia: franq ? (soportada ? franq : 'No soportada') : null,
        venc: tc.venc,
        onVenc: (e) => {
          const v = this.digitos(e.target.value).slice(0, 4);
          this.set('tc', { venc: v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v });
        },
        blurVenc: () => this.tocar('tc', 'venc'),
        errVenc: this.visibleTC('venc'),
        cvv: tc.cvv,
        onCvv: (e) => this.set('tc', { cvv: this.digitos(e.target.value).slice(0, 4) }),
        blurCvv: () => this.tocar('tc', 'cvv'),
        errCvv: this.visibleTC('cvv'),
        apoyo: this.composicion('tc') === 'mixta'
          ? 'Pagas lo vencido de tus financiamientos en atraso y la cuota del mes de los que están al día.'
          : null,
        desglose: this.bloqueDesglose({
          filas: this.desglose('tc'),
          total: this.montoFinal('tc'),
          totalLabel: 'Total a debitar',
          mixto: this.composicion('tc') === 'mixta',
          margen: '6px',
          nota: tc.concepto === 'otro'
            ? 'Un ejecutivo de PIVCA determinará cómo se aplica este monto al financiamiento.'
            : null
        }),
        bloqueado: tcBloqueado,
        procesando: tc.estado === 'procesando',
        iconoBoton: tc.estado === 'editando',
        botonOff: tcBloqueado || !this.seleccionValida('tc'),
        botonLabel: tc.estado === 'procesando' ? 'Procesando…'
          : this.seleccionValida('tc') ? 'Pagar ' + this.fmt(this.montoFinal('tc')) : 'Pagar',
        notaBoton: tc.estado === 'procesando'
          ? 'No cierres esta ventana.'
          : (tc.enviado && Object.keys(errTC).length) ? 'Revisa los campos marcados.' : null,
        pagar: this.guard('cli-tc-pagar', () => this.pagar())
      },

      rp: {
        abierto: rp.abierto,
        abrirLista: this.guard('cli-rp-fin', () => this.set('rp', { abierto: !rp.abierto })),
        opciones: opciones('rp'),
        resumen: resumenSel('rp'),
        errSel: this.visibleRP('sel'),
        haySeleccion: rp.sel.length > 0,
        conceptos: conceptos('rp'),
        aviso: rp.aviso,
        apoyo: this.composicion('rp') === 'mixta'
          ? 'Declaras lo vencido de tus financiamientos en atraso y la cuota del mes de los que están al día.'
          : null,
        desglose: this.bloqueDesglose({
          filas: this.desglose('rp'),
          total: rp.concepto === 'otro' ? this.montoFinal('rp') : this.calculado('rp'),
          totalLabel: rp.concepto === 'otro' ? 'Total declarado' : 'Total calculado',
          mixto: this.composicion('rp') === 'mixta',
          margen: '6px',
          nota: rp.concepto === 'otro'
            ? 'Un ejecutivo de PIVCA determinará cómo se aplica este monto al financiamiento.'
            : 'Referencia de lo calculado hoy. El monto que declaras arriba es el que Tesorería verifica.',
          aviso: (rp.concepto && rp.concepto !== 'otro' && Math.abs(this.montoFinal('rp') - this.calculado('rp')) > 0.005)
            ? 'El monto declarado (' + this.fmt(this.montoFinal('rp')) + ') difiere del calculado (' + this.fmt(this.calculado('rp')) + '). Puedes continuar: verificaremos el pago realmente recibido.'
            : null
        }),
        montoTexto: rp.monto,
        onMonto: (e) => this.set('rp', { monto: this.sanearMonto(e.target.value), tocados: { ...rp.tocados, monto: true } }),
        blurMonto: () => this.tocar('rp', 'monto'),
        errMonto: this.visibleRP('monto'),
        fecha: rp.fecha,
        fechaLarga: this.fechaCorta(rp.fecha),
        onFecha: (e) => this.set('rp', { fecha: e.target.value, tocados: { ...rp.tocados, fecha: true } }),
        blurFecha: () => this.tocar('rp', 'fecha'),
        errFecha: this.visibleRP('fecha'),
        metodoLabel: rp.metodo === 'deposito' ? 'Depósito' : rp.metodo === 'transferencia' ? 'Transferencia' : 'Selecciona el método',
        metodoAbierto: rp.metodoAbierto,
        abrirMetodo: this.guard('cli-rp-metodo', () => this.set('rp', { metodoAbierto: !rp.metodoAbierto })),
        metodos: [
          { id: 'deposito', label: 'Depósito' },
          { id: 'transferencia', label: 'Transferencia' }
        ].map((m, iM) => ({
          label: m.label, gkey: 'cli-rp-metodo-' + iM,
          elegir: this.guard('cli-rp-metodo-' + iM, () => this.set('rp', { metodo: m.id, tipo: null, metodoAbierto: false, referencia: '', cuentaId: null })),
          style: {
            padding: '12px 14px', cursor: 'pointer', fontSize: '14px',
            color: 'var(--pivca-ink-900)', borderBottom: '1px solid var(--border-default)',
            background: rp.metodo === m.id ? 'var(--pivca-orange-50)' : '#fff'
          }
        })),
        errMetodo: this.visibleRP('metodo'),
        esTransferencia: rp.metodo === 'transferencia',
        tipoLabel: rp.tipo === 'zelle' ? 'Zelle' : rp.tipo === 'cripto' ? 'Cripto (USDT)' : rp.tipo === 'zinli' ? 'Zinli' : 'Selecciona el tipo',
        tipoAbierto: rp.tipoAbierto,
        abrirTipo: () => this.set('rp', { tipoAbierto: !rp.tipoAbierto }),
        tipos: [
          { id: 'zelle', label: 'Zelle' },
          { id: 'cripto', label: 'Cripto (USDT)' },
          { id: 'zinli', label: 'Zinli' }
        ].map(t => ({
          label: t.label,
          elegir: () => this.set('rp', { tipo: t.id, tipoAbierto: false, referencia: '', cuentaId: null }),
          style: {
            padding: '12px 14px', cursor: 'pointer', fontSize: '14px',
            color: 'var(--pivca-ink-900)', borderBottom: '1px solid var(--border-default)',
            background: rp.tipo === t.id ? 'var(--pivca-orange-50)' : '#fff'
          }
        })),
        hayCuentas: !!me && !!rp.fecha && !this.errorFecha(),
        etiquetaCuenta: me === 'zelle' ? 'Correo Zelle de PIVCA' : 'Cuenta de PIVCA',
        cuentasCargando: rp.cuentas.estado === 'cargando',
        cuentasError: rp.cuentas.estado === 'error' ? rp.cuentas.mensaje : null,
        reconsultar: () => { this._clave = null; this.sincronizarCuentas(); },
        selectorCuentas: rp.cuentas.estado === 'listo' && lista.length > 1,
        cuentaAbierta: rp.cuentaAbierta,
        abrirCuenta: this.guard('cli-rp-cuenta', () => this.set('rp', { cuentaAbierta: !rp.cuentaAbierta })),
        cuentaLabel: c ? this.principal(c) : 'Selecciona la cuenta destino',
        cuentas: lista.map((x, iX) => ({
          principal: this.principal(x), secundario: this.secundario(x),
          gkey: 'cli-rp-cuenta-' + iX,
          elegir: this.guard('cli-rp-cuenta-' + iX, () => this.set('rp', { cuentaId: x.id, cuentaAbierta: false, confirmoRed: false })),
          style: {
            display: 'flex', padding: '12px 14px', cursor: 'pointer',
            borderBottom: '1px solid var(--border-default)',
            background: rp.cuentaId === x.id ? 'var(--pivca-orange-50)' : '#fff'
          }
        })),
        cuentaUnica: rp.cuentas.estado === 'listo' && lista.length === 1,
        cuentaUnicaTexto: lista.length === 1 ? this.principal(lista[0]) : '',
        sinCuentas: rp.cuentas.estado === 'listo' && lista.length === 0,
        sinCuentasTexto: 'No hay cuentas de este método vigentes el ' + this.fechaCorta(rp.fecha) + '. Revisa la fecha o elige otro método.',
        pideDatos: !!c,
        etiquetaReferencia: me === 'cripto' ? 'Hash de la transacción' : 'Referencia de transacción',
        placeholderReferencia: me === 'cripto' ? '64 caracteres hexadecimales' : 'Ej. 84372615378',
        pistaReferencia: reglaRef.pista,
        referencia: rp.referencia,
        onReferencia: (e) => this.set('rp', { referencia: e.target.value.replace(/\s/g, '') }),
        blurReferencia: () => this.tocar('rp', 'referencia'),
        errReferencia: this.visibleRP('referencia'),
        camposRemitente: camposRem.map(f => ({
          label: f.label, placeholder: f.placeholder, valor: rp[f.key],
          onChange: (e) => this.set('rp', { [f.key]: e.target.value }),
          onBlur: () => this.tocar('rp', f.key),
          error: this.visibleRP(f.key),
          style: this.campo(this.visibleRP(f.key))
        })),
        tercero: rp.tercero,
        onTercero: (e) => this.set('rp', { tercero: e.target.checked }),
        sinArchivo: !rp.archivo,
        archivo: !!rp.archivo,
        archivoNombre: rp.archivo ? rp.archivo.nombre : '',
        archivoPeso: rp.archivo ? (rp.archivo.size / 1024).toFixed(0) + ' KB' : '',
        quitarArchivo: () => this.set('rp', { archivo: null, errArchivo: null }),
        errArchivo: rp.errArchivo || this.visibleRP('archivo'),
        onArchivo: (e) => {
          const r = this.archivoValido(e.target.files && e.target.files[0]);
          this.set('rp', { archivo: r.archivo, errArchivo: r.error });
        },
        onDragOver: (e) => { e.preventDefault(); if (!rp.arrastrando) this.set('rp', { arrastrando: true }); },
        onDragLeave: () => this.set('rp', { arrastrando: false }),
        onDrop: (e) => {
          e.preventDefault();
          const r = this.archivoValido(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]);
          this.set('rp', { archivo: r.archivo, errArchivo: r.error, arrastrando: false });
        },
        avisoDup: !!rp.avisoDup,
        avisoDupTexto: rp.avisoDup
          ? 'El reporte ' + rp.avisoDup.numero + ' declara ' + this.fmt(rp.avisoDup.monto) + ' el '
            + this.fechaCorta(rp.avisoDup.fecha) + ' sobre el mismo financiamiento, con la referencia '
            + rp.avisoDup.referencia + '. Si son dos pagos distintos, puedes continuar.'
          : null,
        confirmadoPosible: rp.confirmadoPosible,
        onConfirmarPosible: (e) => this.set('rp', { confirmadoPosible: e.target.checked }),
        continuarOff: !rp.confirmadoPosible,
        continuarDup: () => this.set('rp', { avisoDup: null }, () => this.enviarReporte()),
        revisarDatos: () => this.set('rp', { avisoDup: null, enviado: false }),
        verificando: rpBloqueado,
        bloqueado: rpBloqueado,
        iconoBoton: rp.estado === 'editando',
        botonOff: rpBloqueado,
        botonLabel: rpBloqueado ? 'Verificando…' : 'Reportar pago',
        notaBoton: rp.errorEnvio
          ? rp.errorEnvio
          : (rp.enviado && Object.keys(errRP).length && !rpBloqueado) ? 'Revisa los campos marcados.' : null,
        enviar: this.guard('cli-rp-enviar', () => this.enviarReporte())
      },

      panel: c ? {
        titulo: this.principal(c),
        cripto: c.metodo === 'cripto',
        red: d.red,
        confirmada: rp.confirmoRed,
        textoConfirmar: 'Confirmo que enviaré USDT por la red ' + d.red,
        onConfirmar: (e) => this.set('rp', { confirmoRed: e.target.checked }),
        oculta,
        direccion: oculta ? '•••• •••• •••• •••• ••••' : d.direccionWallet,
        direccionStyle: {
          fontFamily: 'var(--font-mono)', fontSize: oculta ? '14px' : '12.5px', fontWeight: 600,
          lineHeight: 1.5, wordBreak: 'break-all', padding: '10px 12px', borderRadius: '8px',
          background: oculta ? 'var(--pivca-stone-100)' : 'var(--pivca-orange-50)',
          border: '1px solid ' + (oculta ? 'var(--border-strong)' : 'var(--pivca-orange-300)'),
          color: oculta ? 'var(--pivca-stone-500)' : 'var(--pivca-ink-900)'
        },
        copiarWalletStyle: { ...this.copiarChip('wallet', oculta), alignSelf: 'flex-start' },
        copiarWalletLabel: s.copiado === 'wallet' ? 'Dirección copiada' : 'Copiar dirección',
        copiarWallet: () => { if (!oculta) this.copiar(d.direccionWallet, 'wallet'); },
        qr: c.metodo === 'cripto' && rp.confirmoRed,
        filas: panelFilas,
        avisoZelle: c.metodo === 'zelle'
      } : null,
      qrRef: this.qrRef,

      est: {
        finTC: this.trigger(this.visibleTC('sel'), tc.abierto),
        finTCTexto: this.textoTrigger(tc.sel.length > 0),
        chevTC: this.chev(tc.abierto),
        montoTC: this.campo(this.visibleTC('monto'), { mono: true, ro: !!(tc.concepto && tc.concepto !== 'otro'), icono: !!(tc.concepto && tc.concepto !== 'otro') }),
        selectDoc: {
          flex: 'none', width: '72px', height: '46px', padding: '0 8px', borderRadius: '8px',
          border: '1px solid transparent', background: 'var(--pivca-stone-100)',
          fontFamily: 'var(--font-sans)', fontSize: '14.5px', color: 'var(--pivca-ink-900)', cursor: 'pointer'
        },
        doc: this.campo(this.visibleTC('doc')),
        titular: this.campo(this.visibleTC('titular')),
        numero: this.campo(this.visibleTC('numero'), { mono: true, icono: true }),
        franquicia: {
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap',
          background: soportada ? 'var(--pivca-ink-900)' : '#FBEEEB',
          color: soportada ? '#fff' : 'var(--status-danger)'
        },
        venc: this.campo(this.visibleTC('venc'), { mono: true }),
        cvv: this.campo(this.visibleTC('cvv'), { mono: true }),
        botonTC: this.botonPrimario(tcBloqueado || !this.seleccionValida('tc')),
        notaTC: { fontSize: '12px', color: tc.enviado && Object.keys(errTC).length ? 'var(--status-danger)' : 'var(--pivca-stone-500)' },

        finRP: this.trigger(this.visibleRP('sel'), rp.abierto),
        finRPTexto: this.textoTrigger(rp.sel.length > 0),
        chevRP: this.chev(rp.abierto),
        montoRP: this.campo(this.visibleRP('monto'), { mono: true }),
        fecha: this.campo(this.visibleRP('fecha'), { mono: true }),
        metodo: this.trigger(this.visibleRP('metodo'), rp.metodoAbierto),
        metodoTexto: this.textoTrigger(!!rp.metodo),
        chevMetodo: this.chev(rp.metodoAbierto),
        tipo: this.trigger(null, rp.tipoAbierto),
        tipoTexto: this.textoTrigger(!!rp.tipo),
        chevTipo: this.chev(rp.tipoAbierto),
        cuenta: this.trigger(null, rp.cuentaAbierta),
        cuentaTexto: this.textoTrigger(!!c),
        chevCuenta: this.chev(rp.cuentaAbierta),
        referencia: this.campo(this.visibleRP('referencia'), { mono: true }),
        zona: {
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '7px', padding: '26px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
          border: '1px dashed ' + (rp.arrastrando ? 'var(--pivca-orange-400)' : 'var(--border-strong)'),
          background: rp.arrastrando ? 'var(--pivca-orange-50)' : '#fff',
          transition: 'background 160ms var(--ease-out), border-color 160ms var(--ease-out)'
        },
        colDerecha: {
          flex: '0 0 330px', width: '330px', display: 'flex', flexDirection: 'column', gap: '18px',
          position: 'sticky', top: '84px',
          order: movil && c ? 0 : 2
        },
        botonRP: this.botonPrimario(rpBloqueado),
        notaRP: { fontSize: '12px', color: rp.errorEnvio || (rp.enviado && Object.keys(errRP).length) ? 'var(--status-danger)' : 'var(--pivca-stone-500)' },
        botonContinuar: this.botonPrimario(!rp.confirmadoPosible),
        botonEscenario: {
          display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.16)', borderRadius: '6px', padding: '6px 10px',
          fontFamily: 'var(--font-sans)', fontSize: '11.5px', fontWeight: 600,
          color: 'rgba(255,255,255,0.86)', cursor: 'pointer', maxWidth: '210px'
        }
      },

      vistas: [
        { id: 'escritorio', label: 'Escritorio' },
        { id: 'movil', label: 'Móvil' }
      ].map(v => ({
        label: v.label, ir: () => this.setState({ vista: v.id }),
        style: {
          border: 'none', borderRadius: '999px', padding: '5px 12px', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.02em',
          background: s.vista === v.id ? 'var(--pivca-orange-50)' : 'transparent',
          color: s.vista === v.id ? 'var(--pivca-orange-700)' : 'var(--pivca-stone-500)'
        }
      })),
      escenariosAbiertos: s.escenariosAbiertos,
      toggleEscenarios: () => this.setState({ escenariosAbiertos: !s.escenariosAbiertos }),
      escenarioLabel: (defsEscenario.find(e => e.id === s.escenario) || defsEscenario[0]).label,
      escenarios: defsEscenario.map(e => ({
        label: e.label,
        elegir: () => this.setState({ escenario: e.id, escenariosAbiertos: false }),
        style: {
          textAlign: 'left', border: 'none', borderRadius: '5px', padding: '8px 10px', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
          background: s.escenario === e.id ? 'var(--pivca-orange-400)' : 'transparent',
          color: s.escenario === e.id ? '#fff' : 'rgba(255,255,255,0.72)'
        }
      }))
    });
  }
}
