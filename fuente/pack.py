# -*- coding: utf-8 -*-
"""Rearma el HTML de una pieza a partir de demo/_app.jsx y demo/_template.html.

  python pack.py            -> serve/index.html
  python pack.py --completo -> conserva las 18 Montserrat (bundle original)
"""
import base64, gzip, io, json, os, re, sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
BASE = os.path.dirname(os.path.abspath(__file__))
# Dos disposiciones: la de trabajo (demo/ + serve/) y la que se publica, con
# este script dentro de fuente/ y el index.html en la carpeta de arriba.
if os.path.isdir(os.path.join(BASE, 'demo')):
    D = os.path.join(BASE, 'demo')
    OUT = os.path.join(BASE, 'serve', 'index.html')
else:
    D = BASE
    OUT = os.path.abspath(os.path.join(BASE, os.pardir, 'index.html'))
# El envoltorio sale del bundle original si sigue a mano; si no, del último
# index.html construido (las inyecciones de la cabeza son idempotentes).
SRC = r"C:\Users\bcariaco\Downloads\Pactto - Demo Guiada Concesionarios.html"
if not os.path.exists(SRC):
    SRC = OUT

PODAR = '--completo' not in sys.argv

ACENTO = '#EF712A'          # el naranja real del portal (HomeView.vue)
ACENTO_HOVER = '#D9601C'
ACENTO_RGBA = 'rgba(239,113,42,'

# Montserrat que se queda: 400/500/600/700/800 normal + 400 italic.
# El resto (100/200/300/900 y ocho itálicas) no lo usa ninguna regla.
FUENTES_QUE_SE_QUEDAN = {
    '84b8ae71-0cb5-4d84-853e-4ba96a69345c',  # Regular 400
    '9fe31c53-7cf6-44ea-beaa-1ce77a5359a4',  # Medium 500
    '236395da-f2b2-4e1d-80ab-3b950e580543',  # SemiBold 600
    'abadd995-d0be-4124-981c-4cf4d394456a',  # Bold 700
    '2d00f91f-79a1-48b5-9c48-3a704f8e0a5c',  # ExtraBold 800
    '287f36ff-9a6c-4f41-acfe-74e6a2013b70',  # Italic 400  (regla `em {}`)
}

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='14' fill='%23EF712A'/%3E"
           "%3Cpath d='M22 48V16h13c6.6 0 11 4.2 11 10.4S41.6 37 35 37h-6v11z' fill='%23fff'/%3E"
           "%3C/svg%3E")

# Dominio publicado. og:image tiene que ser absoluta: los rastreadores de
# WhatsApp y LinkedIn no resuelven rutas relativas de forma fiable.
DOMINIO = 'https://paccto-online.vercel.app'

TITULO = 'Pactto · Demo guiada para concesionarios'
DESC = ('Recorre el Portal Referido como lo hará tu equipo: carga de recaudos, '
        'asistente de solicitud y expediente. Entorno de demostración con datos ficticios.')

# ── 1 · plantilla = marcado + lógica ──────────────────────────────────
tpl = io.open(os.path.join(D, '_template.html'), encoding='utf-8').read()
app = io.open(os.path.join(D, '_app.jsx'), encoding='utf-8').read()

abre = tpl.find('<script type="text/x-dc"')
assert abre > 0
ini = tpl.find('>', abre) + 1
fin = tpl.find('</script>', ini)
tpl = tpl[:ini] + app + tpl[fin:]

# ── 2 · acento de marca ───────────────────────────────────────────────
tpl = tpl.replace('#F58634', ACENTO).replace('rgba(245,134,52,', ACENTO_RGBA)
tpl = tpl.replace('#E4761F', ACENTO_HOVER)

# ── 3 · manifiesto (podado o no) ──────────────────────────────────────
shell = io.open(SRC, encoding='utf-8').read()


def bloque(tipo):
    ab = '<script type="__bundler/%s">' % tipo
    i = shell.index(ab) + len(ab)
    j = shell.index('</script>', i)
    return i, j


mi, mj = bloque('manifest')
manifest = json.loads(shell[mi:mj].strip())

quitadas = []
if PODAR:
    for uuid, a in list(manifest.items()):
        if a.get('mime') in ('font/ttf', 'font/otf') and uuid not in FUENTES_QUE_SE_QUEDAN:
            crudo = base64.b64decode(a['data'])
            peso = len(gzip.decompress(crudo)) if a.get('compressed') else len(crudo)
            quitadas.append((uuid, peso))
            del manifest[uuid]

# Fuera todo @font-face que apunte a algo que ya no está en el manifiesto. Se
# decide contra el manifiesto y no contra lo que acabamos de borrar, porque al
# reconstruir desde un index.html ya podado no habría nada que borrar y esas
# reglas quedarían con un url() muerto (404 en cada carga).
vivos = set(manifest.keys())
UUID = re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')


def vivo(m):
    b = m.group(0)
    for u in UUID.findall(b):
        if u not in vivos:
            return ''
    return b


antes = tpl.count('@font-face')
tpl = re.sub(r'@font-face\s*\{[^}]*\}', vivo, tpl)
print('@font-face: %d -> %d' % (antes, tpl.count('@font-face')))
for u in UUID.findall(tpl):
    assert u in vivos, 'referencia muerta: ' + u

# ── 4 · cabeza del envoltorio: título, favicon y tarjeta para compartir ─
CABEZA = """  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>%s</title>
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
""" % (TITULO, DESC, FAVICON, ACENTO, TITULO, DESC, DOMINIO, TITULO, DESC, DOMINIO)

if '<title>Bundled Page</title>' in shell:
    shell = shell.replace('  <title>Bundled Page</title>\n', '')
    assert shell.count('  <meta charset="utf-8">\n') == 1
    shell = shell.replace('  <meta charset="utf-8">\n', '  <meta charset="utf-8">\n' + CABEZA)

# la pantalla de carga también en el naranja correcto
shell = shell.replace('#E97132', ACENTO)

# ── 5 · reinyectar manifiesto y plantilla ─────────────────────────────
# Ojo: la plantilla lleva dentro su propio </script> (el de la lógica x-dc).
# Sin escapar la barra, el parser cerraría el <script> contenedor ahí mismo.
def json_para_script(o):
    return json.dumps(o, separators=(',', ':')).replace('</', '<\\u002F')


mi, mj = bloque('manifest')
shell = shell[:mi] + '\n' + json_para_script(manifest) + '\n  ' + shell[mj:]
ti, tj = bloque('template')
shell = shell[:ti] + '\n' + json_para_script(tpl) + '\n  ' + shell[tj:]

os.makedirs(os.path.dirname(OUT), exist_ok=True)
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(shell)

mb = os.path.getsize(OUT) / 1048576.0
print('index.html -> %.2f MB' % mb)
if quitadas:
    print('fuentes fuera: %d (%.2f MB sin comprimir)'
          % (len(quitadas), sum(p for _, p in quitadas) / 1048576.0))
