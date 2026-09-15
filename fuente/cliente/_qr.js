/* ============================================================================
   QR mínimo — versión 3, nivel de corrección L, modo byte, un solo bloque.
   Suficiente para una dirección de wallet (hasta 53 bytes). Sin dependencias
   ni red: el QR se genera en el cliente a partir de la dirección del catálogo.
   ============================================================================ */

const EXP = new Array(512);
const LOG = new Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function mul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

function generador(n) {
  let p = [1];
  for (let i = 0; i < n; i++) {
    const r = new Array(p.length + 1).fill(0);
    for (let j = 0; j < p.length; j++) { r[j] ^= mul(p[j], 1); r[j + 1] ^= mul(p[j], EXP[i]); }
    p = r;
  }
  return p;
}

function corregir(datos, n) {
  const gen = generador(n);
  const res = new Array(n).fill(0);
  for (let i = 0; i < datos.length; i++) {
    const factor = datos[i] ^ res[0];
    res.shift(); res.push(0);
    if (factor !== 0) for (let j = 0; j < n; j++) res[j] ^= mul(gen[j + 1], factor);
  }
  return res;
}

const MASCARAS = [
  (r, c) => (r + c) % 2 === 0,
  (r, c) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) === 0,
  (r, c) => (((r * c) % 2 + (r * c) % 3) % 2) === 0,
  (r, c) => (((r + c) % 2 + (r * c) % 3) % 2) === 0
];

function bitsFormato(mascara) {
  const datos = (0b01 << 3) | mascara;      // nivel L = 01
  let rem = datos << 10;
  for (let i = 4; i >= 0; i--) if ((rem >> (10 + i)) & 1) rem ^= 0x537 << i;
  return ((datos << 10) | (rem & 0x3ff)) ^ 0x5412;
}

function penalizacion(m, size) {
  let p = 0;
  const corridas = (linea) => {
    let run = 1;
    for (let i = 1; i < size; i++) {
      if (linea[i] === linea[i - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p += 1; }
      else run = 1;
    }
  };
  for (let r = 0; r < size; r++) corridas(m[r]);
  for (let c = 0; c < size; c++) corridas(m.map(f => f[c]));
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) p += 3;
    }
  }
  return p;
}

export function qrMatriz(texto) {
  const bytes = new TextEncoder().encode(String(texto || ''));
  const SIZE = 29, DATOS = 55, ECC = 15;
  if (!bytes.length || bytes.length > DATOS - 2) return null;

  const bits = [];
  const push = (v, n) => { for (let i = n - 1; i >= 0; i--) bits.push((v >> i) & 1); };
  push(4, 4); push(bytes.length, 8);
  bytes.forEach(b => push(b, 8));
  push(0, Math.min(4, DATOS * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const cw = [];
  for (let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  const relleno = [0xEC, 0x11];
  let k = 0;
  while (cw.length < DATOS) cw.push(relleno[k++ % 2]);
  const todos = cw.concat(corregir(cw, ECC));

  const m = Array.from({ length: SIZE }, () => new Array(SIZE).fill(0));
  const fn = Array.from({ length: SIZE }, () => new Array(SIZE).fill(false));
  const set = (r, c, v) => { if (r < 0 || c < 0 || r >= SIZE || c >= SIZE) return; m[r][c] = v; fn[r][c] = true; };

  const buscador = (r0, c0) => {
    for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
      const dentro = r >= 0 && r <= 6 && c >= 0 && c <= 6;
      let v = 0;
      if (dentro) {
        const borde = (r === 0 || r === 6 || c === 0 || c === 6);
        const centro = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        v = (borde || centro) ? 1 : 0;
      }
      set(r0 + r, c0 + c, v);
    }
  };
  buscador(0, 0); buscador(0, SIZE - 7); buscador(SIZE - 7, 0);

  for (let i = 8; i < SIZE - 8; i++) { set(6, i, i % 2 === 0 ? 1 : 0); set(i, 6, i % 2 === 0 ? 1 : 0); }
  for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) {
    set(22 + r, 22 + c, Math.max(Math.abs(r), Math.abs(c)) !== 1 ? 1 : 0);
  }
  set(SIZE - 8, 8, 1);
  for (let i = 0; i <= 8; i++) { if (!fn[i][8]) set(i, 8, 0); if (!fn[8][i]) set(8, i, 0); }
  for (let i = 0; i < 8; i++) { set(8, SIZE - 1 - i, 0); set(SIZE - 1 - i, 8, 0); }

  const flujo = [];
  todos.forEach(b => { for (let i = 7; i >= 0; i--) flujo.push((b >> i) & 1); });
  let bi = 0, arriba = true;
  for (let col = SIZE - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let i = 0; i < SIZE; i++) {
      const row = arriba ? SIZE - 1 - i : i;
      for (let j = 0; j < 2; j++) {
        const c = col - j;
        if (fn[row][c]) continue;
        m[row][c] = bi < flujo.length ? flujo[bi++] : 0;
      }
    }
    arriba = !arriba;
  }

  let mejor = null;
  for (let k2 = 0; k2 < 8; k2++) {
    const cand = m.map(f => f.slice());
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (!fn[r][c] && MASCARAS[k2](r, c)) cand[r][c] ^= 1;
    }
    const bits15 = bitsFormato(k2);
    const bit = (i) => (bits15 >> i) & 1;
    for (let i = 0; i <= 5; i++) cand[i][8] = bit(i);
    cand[7][8] = bit(6); cand[8][8] = bit(7); cand[8][7] = bit(8);
    for (let i = 9; i < 15; i++) cand[8][14 - i] = bit(i);
    for (let i = 0; i < 8; i++) cand[8][SIZE - 1 - i] = bit(i);
    for (let i = 8; i < 15; i++) cand[SIZE - 15 + i][8] = bit(i);
    cand[SIZE - 8][8] = 1;
    const p = penalizacion(cand, SIZE);
    if (!mejor || p < mejor.p) mejor = { p, cand };
  }
  return mejor.cand;
}

export function dibujarQr(canvas, texto, opciones) {
  if (!canvas) return false;
  const matriz = qrMatriz(texto);
  const o = opciones || {};
  const quiet = o.quiet == null ? 3 : o.quiet;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!matriz) return false;
  const n = matriz.length + quiet * 2;
  const escala = Math.floor(Math.min(canvas.width, canvas.height) / n);
  const lado = escala * n;
  const off = Math.floor((canvas.width - lado) / 2);
  ctx.fillStyle = o.fondo || '#FFFFFF';
  ctx.fillRect(off, off, lado, lado);
  ctx.fillStyle = o.tinta || '#1F1B16';
  for (let r = 0; r < matriz.length; r++) {
    for (let c = 0; c < matriz.length; c++) {
      if (matriz[r][c]) ctx.fillRect(off + (c + quiet) * escala, off + (r + quiet) * escala, escala, escala);
    }
  }
  return true;
}
