# Pactto · Demos guiadas

Dos prototipos navegables del sistema de financiamiento de PIVCA, uno por cada
lado del mostrador. Sin backend: todo ocurre en el navegador, con datos
ficticios.

| Ruta | Portal | Para quién |
|---|---|---|
| `/` | Portada | Elige por dónde entrar |
| `/concesionario/` | Portal Referido | El asesor del concesionario |
| `/cliente/` | Portal usuario | El cliente final |

La idea es el efecto dominó: se lo mostramos al concesionario, y él se lo
muestra a su cliente. Al cerrar cada recorrido hay un enlace al otro portal.

## Credenciales

Las mismas para los dos, y para todo el que reciba el enlace:

```
agente@autollanos.com.ve
Pactto2026
```

Entrar en un portal vale para el otro (misma sesión, mismo dominio).

> **Esto no es una puerta de seguridad.** La clave viaja dentro del HTML: quien
> abra «ver código fuente» la encuentra. Es parte del recorrido, no una
> protección. Si alguna vez hace falta cerrar la URL de verdad, hay que ponerle
> un middleware con Basic Auth o la protección por contraseña de Vercel.

## Desplegar

Publicado en **https://paccto-online.vercel.app** desde este repositorio. Vercel
sirve los HTML tal cual: sin framework, sin comando de build, sin directorio de
salida. Cada push a `main` vuelve a desplegar.

Si cambia el dominio hay que tocar `DOMINIO` en `fuente/pack.py` y reconstruir:
`og:image` tiene que ser una URL absoluta o WhatsApp y LinkedIn no muestran la
tarjeta al compartir el enlace.

## Enlaces por escenario

El hash de la URL escoge con qué practicar y entra directo al login.

**Concesionario** — perfil (`natural` / `juridica`) y desenlace
(`enviar` / `devuelto` / `rechazada` / `aprobada`), en cualquier orden:

| Enlace | Qué practica |
|---|---|
| `/concesionario/#natural/enviar` | Persona natural, cargar y enviar |
| `/concesionario/#juridica/enviar` | Persona jurídica, cargar y enviar |
| `/concesionario/#natural/devuelto` | Le devolvieron un recaudo |
| `/concesionario/#natural/rechazada` | Le rechazaron la solicitud |
| `/concesionario/#natural/aprobada` | Le aprobaron la solicitud |

**Cliente** — carril (`tarjeta` / `reporte`) y desenlace:

| Enlace | Qué practica |
|---|---|
| `/cliente/#tarjeta/asignado` | Pago con tarjeta aplicado al momento |
| `/cliente/#tarjeta/por-asignar` | Pasó el cargo, falta asignarlo |
| `/cliente/#tarjeta/rechazado` | El emisor no autorizó |
| `/cliente/#tarjeta/no-confirmado` | La pasarela no respondió |
| `/cliente/#tarjeta/mixto` | Unos tramos se asignaron y otros no |
| `/cliente/#reporte/por-conciliar` | Reportar un pago ya hecho |
| `/cliente/#reporte/duplicada` | Esa referencia ya se reportó |
| `/cliente/#reporte/catalogo` | Las cuentas de PIVCA no cargan |

Los enlaces antiguos a la raíz (`/#natural/enviar`) siguen valiendo: la portada
los reenvía al portal del concesionario.

## Cómo se comportan

- **Recorrido guiado.** Señala qué pulsar en cada paso. «Explorar libremente»
  lo apaga y deja todos los controles abiertos; al reactivarlo se retoma donde
  se dejó.
- **Sesión recordada.** Con «Recordar mi sesión» marcado, recargar no borra el
  avance. Sólo se guarda con la sesión ya iniciada —nunca la contraseña—, así
  que «Reiniciar» y «Cerrar sesión» dejan el navegador limpio.
- **Móvil.** Los dos funcionan en pantalla de teléfono sin desbordes.

## Editarlo después

Cada portal es un solo HTML de ~2 MB con todo embebido (React, iconos,
tipografías). No se editan a mano. Las fuentes están en `fuente/`:

| Archivo | Qué es |
|---|---|
| `fuente/<portal>/_app.jsx` | Lógica: datos, recorrido, validaciones |
| `fuente/<portal>/_template.html` | Maquetado y CSS |
| `fuente/cliente/_api.js` | Capa de datos simulada, con los contratos de API |
| `fuente/cliente/_qr.js` | Generador de QR para las direcciones de wallet |
| `fuente/portada.html` | La portada |
| `fuente/pack.py` | Reconstruye los tres HTML |
| `fuente/og.py` | Genera `og.png` |

```bash
cd fuente && python pack.py
```

Reconstruye los dos portales y la portada. `python pack.py cliente` hace sólo
uno. El envoltorio sale del bundle original del canvas si está a mano y, si no,
del propio HTML ya construido: no hace falta nada más que este repositorio.
