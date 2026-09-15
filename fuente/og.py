# -*- coding: utf-8 -*-
"""Genera og.png (1200x630) con las Montserrat que ya vienen en el bundle."""
import os, sys
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
BASE = os.path.dirname(os.path.abspath(__file__))
if os.path.isdir(os.path.join(BASE, 'demo')):
    D = os.path.join(BASE, 'demo')
    OUT = os.path.join(BASE, 'serve', 'og.png')
else:
    D = BASE
    OUT = os.path.abspath(os.path.join(BASE, os.pardir, 'og.png'))

def fuente(uuid, nombre):
    # En la carpeta de trabajo las tipografías salen del bundle desempaquetado;
    # en la publicada viven en fuente/tipografias/ con su nombre real.
    a = os.path.join(D, uuid + '.bin')
    return a if os.path.exists(a) else os.path.join(D, 'tipografias', nombre)


BOLD = fuente('abadd995-d0be-4124-981c-4cf4d394456a', 'Montserrat-Bold.ttf')
BLACK = fuente('5bb116a5-9498-4d38-b5ff-065021bf0286', 'Montserrat-Black.ttf')
MED = fuente('9fe31c53-7cf6-44ea-beaa-1ce77a5359a4', 'Montserrat-Medium.ttf')

TINTA = (31, 27, 22)
NARANJA = (239, 113, 42)
CREMA = (244, 243, 239)
GRIS = (150, 146, 138)

img = Image.new('RGB', (1200, 630), TINTA)
d = ImageDraw.Draw(img)

# franja de acento a la izquierda
d.rectangle([0, 0, 14, 630], fill=NARANJA)

f_kicker = ImageFont.truetype(MED, 22)
f_titulo = ImageFont.truetype(BLACK, 76)
f_sub = ImageFont.truetype(BOLD, 34)
f_pie = ImageFont.truetype(MED, 24)

x = 86
d.text((x, 118), 'PORTAL REFERIDO', font=f_kicker, fill=NARANJA)
d.text((x, 168), 'Pactto', font=f_titulo, fill=CREMA)
d.text((x, 272), 'Demo guiada para concesionarios', font=f_sub, fill=CREMA)
d.text((x, 336), 'Recorre el portal como lo hará tu equipo: carga de',
       font=f_pie, fill=GRIS)
d.text((x, 372), 'recaudos, asistente de solicitud y expediente.',
       font=f_pie, fill=GRIS)

# línea + pie
d.rectangle([x, 452, x + 92, 456], fill=NARANJA)
d.text((x, 486), 'Entorno de demostración · datos ficticios',
       font=ImageFont.truetype(MED, 21), fill=GRIS)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, 'PNG', optimize=True)
print('og.png ->', OUT, os.path.getsize(OUT), 'bytes')
