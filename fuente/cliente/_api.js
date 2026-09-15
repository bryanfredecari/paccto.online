/* ============================================================================
   CAPA DE DATOS SIMULADA — Portal de Usuario Final · Módulo de pagos
   ----------------------------------------------------------------------------
   Este archivo representa las RESPUESTAS DE API del backend de PIVCA.
   Ningún componente de UI debe hardcodear estos datos: todo se consume
   mediante las funciones asíncronas expuestas al final del archivo.

   Contratos que el equipo de desarrollo debe implementar:
     GET  /api/cliente/financiamientos                -> financiamientosDelCliente()
     GET  /api/pagos/cuentas?metodo=&fecha=           -> cuentasVigentesEnFecha()
     GET  /api/pagos/cuentas?metodo=&fecha=hoy        -> cuentasVigentesHoy()

   Regla clave del catálogo: la vigencia se resuelve por FECHA
   (vigenteDesde / vigenteHasta), NUNCA por un booleano "activa".
   ============================================================================ */

/* --- Simulación de red -------------------------------------------------- */

const _sim = { latenciaMs: 600, fallar: false };

export function configurarSimulacion(parcial) {
  Object.assign(_sim, parcial || {});
  return { ..._sim };
}

function responder(fabricaValor, etiqueta) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (_sim.fallar) {
        reject(new Error('503 · El servicio de ' + etiqueta + ' no respondió. Intenta de nuevo.'));
      } else {
        resolve(fabricaValor());
      }
    }, _sim.latenciaMs);
  });
}

/* --- 2.1 Financiamientos del cliente ------------------------------------
   codigo: tipo(1 natural / 2 jurídica) - documento - producto - solicitud - versión */

export const FINANCIAMIENTOS = [
  {
    codigo: '1-29827910-01-001-01',
    vehiculo: 'Corolla Cross Gris 2026',
    estado: 'al_dia',
    cuotaDelMes: 486.20,
    deudaTotalAlDia: 8742.60,
    montoVencido: 0,
    proximoVencimiento: '2026-08-05'
  },
  {
    codigo: '1-29827910-01-002-01',
    vehiculo: 'Changan Alsvin Blanco 2025',
    estado: 'con_atraso',
    cuotaDelMes: 612.75,
    deudaTotalAlDia: 14305.40,
    montoVencido: 1338.90,
    proximoVencimiento: '2026-07-15'
  },
  {
    codigo: '1-29827910-04-017-02',
    vehiculo: 'JMC Vigus Plata 2026',
    estado: 'al_dia',
    cuotaDelMes: 351.00,
    deudaTotalAlDia: 5980.25,
    montoVencido: 0,
    proximoVencimiento: '2026-08-12'
  }
];

/* --- 2.2 Catálogo de cuentas PIVCA --------------------------------------
   Una cuenta es vigente en una fecha F si  vigenteDesde <= F  y
   (vigenteHasta === null || F <= vigenteHasta).
   La cuenta zelle-04 tiene la vigencia cerrada a propósito. */

export const CUENTAS_PIVCA = [
  {
    id: 'dep-bnc-01',
    metodo: 'deposito',
    vigenteDesde: '2024-03-01',
    vigenteHasta: null,
    datos: {
      banco: 'Banco Nacional de Crédito (BNC)',
      numeroCuenta: '0191-0102-45-2100067890',
      titular: 'Promotora de Inversiones y Valores, C.A.',
      rif: 'J-40155873-0',
      tipoCuenta: 'Corriente'
    }
  },
  {
    id: 'dep-sofitasa-01',
    metodo: 'deposito',
    vigenteDesde: '2025-01-15',
    vigenteHasta: null,
    datos: {
      banco: 'Banco Sofitasa',
      numeroCuenta: '0137-0045-88-0001234567',
      titular: 'Promotora de Inversiones y Valores, C.A.',
      rif: 'J-40155873-0',
      tipoCuenta: 'Corriente'
    }
  },
  {
    id: 'zelle-01',
    metodo: 'zelle',
    vigenteDesde: '2025-06-01',
    vigenteHasta: null,
    datos: { correo: 'pagos.autos@pivca.com', beneficiario: 'Pivca Corp LLC' }
  },
  {
    id: 'zelle-02',
    metodo: 'zelle',
    vigenteDesde: '2025-09-10',
    vigenteHasta: null,
    datos: { correo: 'cobranzas@pivca.com', beneficiario: 'Pivca Corp LLC' }
  },
  {
    id: 'zelle-03',
    metodo: 'zelle',
    vigenteDesde: '2026-02-20',
    vigenteHasta: null,
    datos: { correo: 'mt.rangel.pivca@gmail.com', beneficiario: 'Maria T Rangel' }
  },
  {
    id: 'zelle-04',
    metodo: 'zelle',
    vigenteDesde: '2025-04-01',
    vigenteHasta: '2026-07-21',
    datos: { correo: 'tesoreria@pivca.com', beneficiario: 'Pivca Corp LLC' }
  },
  {
    id: 'cripto-usdt-01',
    metodo: 'cripto',
    vigenteDesde: '2025-11-05',
    vigenteHasta: null,
    datos: { red: 'TRC-20', direccionWallet: 'TQ5nRfL8kXbVJm2yD7wPzHc4eA9sUqNtVb' }
  },
  {
    id: 'zinli-01',
    metodo: 'zinli',
    vigenteDesde: '2026-01-08',
    vigenteHasta: null,
    datos: { identificador: '+58 414 213 7788', beneficiario: 'PIVCA C.A.' }
  }
];

/* --- Utilidades de fecha ------------------------------------------------ */

function aDia(valor) {
  const d = valor instanceof Date ? new Date(valor.getTime()) : new Date(String(valor) + 'T00:00:00');
  d.setHours(0, 0, 0, 0);
  return d;
}

export function esVigenteEnFecha(cuenta, fecha) {
  const f = aDia(fecha);
  if (aDia(cuenta.vigenteDesde) > f) return false;
  if (cuenta.vigenteHasta && aDia(cuenta.vigenteHasta) < f) return false;
  return true;
}

/* --- 2.3 Consultas con latencia y estados de carga / error -------------- */

export function financiamientosDelCliente() {
  return responder(() => FINANCIAMIENTOS.map(f => ({ ...f })), 'financiamientos');
}

export function cuentasVigentesEnFecha(metodo, fecha) {
  return responder(() => CUENTAS_PIVCA
    .filter(c => (metodo ? c.metodo === metodo : true))
    .filter(c => esVigenteEnFecha(c, fecha))
    .map(c => ({ ...c, datos: { ...c.datos } })), 'cuentas PIVCA');
}

export function cuentasVigentesHoy(metodo) {
  return cuentasVigentesEnFecha(metodo, new Date());
}

/* --- Formatos (es-VE: coma decimal, punto de millar) -------------------- */

export function formatoMoneda(n) {
  const v = Number(n) || 0;
  const p = Math.abs(v).toFixed(2).split('.');
  return (v < 0 ? '−' : '') + '$' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1];
}

export function formatoFecha(valor) {
  const d = valor instanceof Date ? valor : new Date(String(valor) + 'T00:00:00');
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return dd + '/' + mm + '/' + d.getFullYear();
}

export const METODOS = ['deposito', 'zelle', 'cripto', 'zinli'];

/* --- Reportes ya declarados (para detección de duplicados) ---------------
   GET /api/pagos/reportes?referencia=&cuenta=   -> buscarReportePorReferencia()
   GET /api/pagos/reportes?monto=&fecha=&fin=    -> buscarPosibleDuplicado()
   Duplicado DURO  = misma referencia + misma cuenta destino  -> bloquea.
   Duplicado BLANDO = mismo monto + fecha + financiamiento, referencia distinta -> avisa. */

export const REPORTES_PREVIOS = [
  {
    numero: 'RP-2026-004812', referencia: 'ZL884213', cuentaId: 'zelle-01', metodo: 'zelle',
    monto: 486.20, fecha: '2026-07-18', codigo: '1-29827910-01-001-01', estado: 'en_conciliacion'
  },
  {
    numero: 'RP-2026-004960', referencia: 'BNC7741', cuentaId: 'dep-bnc-01', metodo: 'deposito',
    monto: 486.20, fecha: '2026-07-16', codigo: '1-29827910-01-001-01', estado: 'reportado'
  }
];

export function buscarReportePorReferencia(referencia, cuentaId) {
  const ref = String(referencia || '').trim().toUpperCase();
  return responder(() => {
    const r = REPORTES_PREVIOS.find(x => x.referencia.toUpperCase() === ref && x.cuentaId === cuentaId);
    return r ? { ...r } : null;
  }, 'reportes');
}

export function buscarPosibleDuplicado(criterio) {
  const c = criterio || {};
  const codigos = c.codigos || [];
  const ref = String(c.referencia || '').trim().toUpperCase();
  return responder(() => {
    const r = REPORTES_PREVIOS.find(x =>
      Math.abs(x.monto - Number(c.monto || 0)) < 0.005 &&
      x.fecha === c.fecha &&
      codigos.indexOf(x.codigo) >= 0 &&
      x.referencia.toUpperCase() !== ref
    );
    return r ? { ...r } : null;
  }, 'reportes');
}

export function nuevoNumeroReporte() {
  return 'RP-2026-' + String(5000 + Math.floor(Math.random() * 900)).padStart(6, '0');
}

export function nuevaReferenciaPasarela() {
  return 'MS-' + Date.now().toString(36).toUpperCase().slice(-6) + '-' + Math.floor(100 + Math.random() * 900);
}
