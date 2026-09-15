# -*- coding: utf-8 -*-
"""Rearma los HTML del sitio a partir de las fuentes de `fuente/`.

    python pack.py              -> reconstruye los dos portales y la portada
    python pack.py cliente      -> sólo uno
    python pack.py --completo   -> conserva las 18 Montserrat de cada bundle

Cada portal es un único HTML con todo embebido (React, iconos, tipografías).
El envoltorio sale del bundle original del canvas si sigue a mano; si no, del
propio HTML ya construido — las inyecciones de la cabeza son idempotentes.
"""
import base64, gzip, io, json, os, re, shutil, sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

FUENTE = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(FUENTE, os.pardir))

PODAR = '--completo' not in sys.argv
PEDIDOS = [a for a in sys.argv[1:] if not a.startswith('--')]

ACENTO = '#EF712A'          # el naranja real del portal (HomeView.vue)
ACENTO_HOVER = '#D9601C'
DOMINIO = 'https://paccto-online.vercel.app'

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='14' fill='%23EF712A'/%3E"
           "%3Cpath d='M22 48V16h13c6.6 0 11 4.2 11 10.4S41.6 37 35 37h-6v11z' fill='%23fff'/%3E"
           "%3C/svg%3E")

PORTALES = {
    'concesionario': {
        'original': r"C:\Users\bcariaco\Downloads\Pactto - Demo Guiada Concesionarios.html",
        'salida': os.path.join(RAIZ, 'concesionario', 'index.html'),
        'titulo': 'Pactto · Demo para concesionarios',
        'desc': ('Recorre el Portal Referido como lo hará tu equipo: carga de recaudos, '
                 'asistente de solicitud y expediente. Entorno de demostración con datos ficticios.'),
    },
    'cliente': {
        'original': r"C:\Users\bcariaco\Downloads\Pactto - Demo Portal de Cliente Final.html",
        'salida': os.path.join(RAIZ, 'cliente', 'index.html'),
        'titulo': 'Pactto · Demo para clientes',
        'desc': ('Así paga tu cliente: con tarjeta al momento o reportando un pago ya hecho. '
                 'Entorno de demostración con datos ficticios.'),
    },
}

UUID = re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')


def cabeza(titulo, desc):
    return """  <title>%s</title>
  <meta name="description" content="%s">
  <link rel="icon" href="%s">
  <meta name="theme-color" content="%s">
  <!-- Tarjeta al compartir el enlace. Los rastreadores de WhatsApp/LinkedIn no
       ejecutan JavaScript: leen estas etiquetas del HTML servido, por eso viven
       aquí y no en la plantilla. og:image apunta a DOMINIO (pack.py). -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Pactto">
  <meta property="og:title" content="%s">
  <meta property="og:description" content="%s">
  <meta property="og:image" content="%s/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="%s">
  <meta name="twitter:description" content="%s">
  <meta name="twitter:image" content="%s/og.png">
""" % (titulo, desc, FAVICON, ACENTO, titulo, desc, DOMINIO, titulo, desc, DOMINIO)


def se_queda(bloque):
    """Montserrat 400/500/600/700/800 normal + la itálica 400 (regla `em {}`).
    Los demás pesos no los usa ninguna regla de ninguno de los dos portales."""
    fam = re.search(r'font-family:\s*["\']?([^;"\']+)', bloque)
    if not fam or 'Montserrat' not in fam.group(1):
        return True
    w = re.search(r'font-weight:\s*(\d+)', bloque)
    st = re.search(r'font-style:\s*(\w+)', bloque)
    peso = w.group(1) if w else '400'
    estilo = st.group(1) if st else 'normal'
    if estilo == 'normal':
        return peso in ('400', '500', '600', '700', '800')
    return peso == '400'


def construir(nombre):
    cfg = PORTALES[nombre]
    D = os.path.join(FUENTE, nombre)
    SAL = cfg['salida']

    src = cfg['original']
    if not os.path.exists(src):
        src = SAL
    if not os.path.exists(src):
        print('  %-14s SIN FUENTE (ni bundle original ni HTML previo)' % nombre)
        return

    tpl = io.open(os.path.join(D, '_template.html'), encoding='utf-8').read()
    app = io.open(os.path.join(D, '_app.jsx'), encoding='utf-8').read()

    # la lógica vive en su fichero; aquí se vuelve a meter en la plantilla
    abre = tpl.find('<script type="text/x-dc"')
    assert abre > 0
    ini = tpl.find('>', abre) + 1
    fin = tpl.find('</script>', ini)
    tpl = tpl[:ini] + app + tpl[fin:]

    # acento de marca
    tpl = tpl.replace('#F58634', ACENTO).replace('rgba(245,134,52,', 'rgba(239,113,42,')
    tpl = tpl.replace('#E4761F', ACENTO_HOVER)

    shell = io.open(src, encoding='utf-8').read()

    def bloque(tipo):
        ab = '<script type="__bundler/%s">' % tipo
        i = shell.index(ab) + len(ab)
        return i, shell.index('</script>', i)

    mi, mj = bloque('manifest')
    manifest = json.loads(shell[mi:mj].strip())

    # ── poda de tipografías ───────────────────────────────────────────
    quitadas = []
    if PODAR:
        muertas = set()
        for b in re.findall(r'@font-face\s*\{[^}]*\}', tpl):
            if not se_queda(b):
                muertas.update(UUID.findall(b))
        for u in muertas:
            a = manifest.pop(u, None)
            if a:
                crudo = base64.b64decode(a['data'])
                quitadas.append(len(gzip.decompress(crudo)) if a.get('compressed') else len(crudo))

    # Fuera todo @font-face que apunte a algo que ya no está en el manifiesto.
    # Se decide contra el manifiesto, no contra lo que acabamos de borrar: al
    # reconstruir desde un HTML ya podado no habría nada que borrar y esas
    # reglas quedarían con un url() muerto (404 en cada carga).
    vivos = set(manifest.keys())

    def vivo(m):
        b = m.group(0)
        return '' if any(u not in vivos for u in UUID.findall(b)) else b

    antes = tpl.count('@font-face')
    tpl = re.sub(r'@font-face\s*\{[^}]*\}', vivo, tpl)
    for u in UUID.findall(tpl):
        assert u in vivos, 'referencia muerta: ' + u

    # ── cabeza del envoltorio ─────────────────────────────────────────
    if '<title>Bundled Page</title>' in shell:
        shell = shell.replace('  <title>Bundled Page</title>\n', '')
        assert shell.count('  <meta charset="utf-8">\n') == 1
        shell = shell.replace('  <meta charset="utf-8">\n',
                              '  <meta charset="utf-8">\n'
                              '  <meta name="viewport" content="width=device-width, initial-scale=1">\n'
                              + cabeza(cfg['titulo'], cfg['desc']))
    shell = shell.replace('#E97132', ACENTO)

    # ── reinyectar ────────────────────────────────────────────────────
    # La plantilla lleva dentro su propio </script> (el de la lógica x-dc):
    # sin escapar la barra, el parser cerraría el <script> contenedor ahí mismo.
    def para_script(o):
        return json.dumps(o, separators=(',', ':')).replace('</', '<\\u002F')

    mi, mj = bloque('manifest')
    shell = shell[:mi] + '\n' + para_script(manifest) + '\n  ' + shell[mj:]
    ti, tj = bloque('template')
    shell = shell[:ti] + '\n' + para_script(tpl) + '\n  ' + shell[tj:]

    os.makedirs(os.path.dirname(SAL), exist_ok=True)
    io.open(SAL, 'w', encoding='utf-8', newline='\n').write(shell)
    print('  %-14s %5.2f MB · @font-face %d→%d%s' % (
        nombre, os.path.getsize(SAL) / 1048576.0, antes, tpl.count('@font-face'),
        (' · fuera %d (%.2f MB)' % (len(quitadas), sum(quitadas) / 1048576.0)) if quitadas else ''))


def portada():
    origen = os.path.join(FUENTE, 'portada.html')
    destino = os.path.join(RAIZ, 'index.html')
    html = io.open(origen, encoding='utf-8').read()
    html = html.replace('__FAVICON__', FAVICON).replace('__DOMINIO__', DOMINIO)
    io.open(destino, 'w', encoding='utf-8', newline='\n').write(html)
    print('  %-14s %5.1f KB' % ('portada', os.path.getsize(destino) / 1024.0))


print('Construyendo:')
for nombre in (PEDIDOS or list(PORTALES)):
    construir(nombre)
if not PEDIDOS:
    portada()
