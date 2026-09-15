# Pactto · Demo guiada para concesionarios

Prototipo navegable del **Portal Referido**. No tiene backend: todo ocurre en el
navegador, con datos ficticios. Sirve para que un concesionario recorra el flujo
—login, listado, carga de recaudos, asistente de solicitud y expediente— antes
de tener acceso al sistema real.

## Credenciales

Las mismas para todo el que reciba el enlace:

```
agente@autollanos.com.ve
Pactto2026
```

> **Esto no es una puerta de seguridad.** La clave viaja dentro del HTML: quien
> abra «ver código fuente» la encuentra. Es parte del recorrido, no una
> protección. Si alguna vez hace falta cerrar la URL de verdad, hay que ponerle
> un middleware con Basic Auth o la protección por contraseña de Vercel.

## Desplegar

No hay build. Sube la carpeta a un repositorio y conéctalo a Vercel:

```bash
git init && git add . && git commit -m "Demo guiada para concesionarios"
git remote add origin https://github.com/bryanfredecari/<repo>.git
git push -u origin main
```

En Vercel: **Add New → Project → importar el repo → Deploy**. Sin framework, sin
comando de build, sin directorio de salida. Se sirve `index.html` tal cual.

**Un ajuste después del primer despliegue:** en `index.html`, cambia

```html
<meta property="og:image" content="og.png">
```

por la URL absoluta que te dé Vercel:

```html
<meta property="og:image" content="https://TU-DOMINIO.vercel.app/og.png">
```

Es lo que hace que al compartir el enlace por WhatsApp salga la tarjeta con
imagen. Lo mismo para `twitter:image`.

## Enlaces por escenario

El hash de la URL escoge con qué practicar y entra directo al login:

| Enlace | Qué practica |
|---|---|
| `…/` | Pantalla de escenarios (elige el usuario) |
| `…/#natural/enviar` | Persona natural, cargar y enviar la solicitud |
| `…/#juridica/enviar` | Persona jurídica, cargar y enviar |
| `…/#natural/devuelto` | Le devolvieron un recaudo |
| `…/#natural/rechazada` | Le rechazaron la solicitud |
| `…/#natural/aprobada` | Le aprobaron la solicitud |

Cualquier combinación de perfil (`natural` / `juridica`) y desenlace
(`enviar` / `devuelto` / `rechazada` / `aprobada`) funciona, en cualquier orden y
también sueltos: `#aprobada` vale.

## Cómo se comporta

- **Recorrido guiado.** Señala qué pulsar en cada paso. El botón «Explorar
  libremente» de la barra superior lo apaga y deja todos los controles abiertos;
  al volver a encenderlo se retoma en el mismo paso.
- **Sesión recordada.** Con «Recordar mi sesión» marcado, recargar la página no
  borra el avance. «Reiniciar» y «Cerrar sesión» lo limpian.
- **Móvil.** Funciona en pantalla de teléfono sin desbordes.

## Editarlo después

`index.html` es un solo archivo de 2 MB con todo embebido (React, iconos,
tipografías). No se edita a mano. Las fuentes están en `fuente/`:

| Archivo | Qué es |
|---|---|
| `fuente/_app.jsx` | Toda la lógica: datos, recorrido, validaciones |
| `fuente/_template.html` | Maquetado y CSS |
| `fuente/pack.py` | Vuelve a armar `index.html` a partir de los dos anteriores |
| `fuente/og.py` | Genera `og.png` |

Para reconstruir hay que copiar `fuente/` y `index.html` a una carpeta con esta
misma estructura y correr `python pack.py` (Python 3). El script toma el
`index.html` existente como envoltorio, así que no hace falta el bundle
original.
