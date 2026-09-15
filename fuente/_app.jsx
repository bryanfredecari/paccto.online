
const GUION_BASE = [
  { phase: 'scenario', target: 'scn-perfil',   titulo: 'Elegir el perfil del cliente', kicker: 'Paso 1',
    tip: 'Elige el perfil del cliente con el que vas a practicar.' },
  { phase: 'scenario', target: 'scn-desenlace', titulo: 'Elegir el desenlace',           kicker: 'Paso 2',
    tip: 'Ahora elige el desenlace. No depende del perfil: son dos ejes distintos.' },
  { phase: 'scenario', target: 'scn-comenzar',  titulo: 'Arrancar el recorrido',         kicker: 'Paso 3',
    tip: 'Pulsa «Comenzar» para entrar al portal con ese escenario.' },
  { phase: 'login',    target: 'login-submit',  titulo: 'Iniciar sesión',                kicker: 'Paso 4',
    tip: 'Escribe el correo y la contraseña que te entregaron, y pulsa «Iniciar sesión».' },
  { phase: 'app',      target: 'list-filters',  titulo: 'Filtrar por estatus',           kicker: 'Paso 5',
    tip: 'Estas pastillas filtran la lista. Pulsa «Borrador» para ver sólo lo que aún no se ha enviado.' },
  { phase: 'app',      target: 'list-nueva',    titulo: 'Crear una solicitud nueva',     kicker: 'Paso 6',
    tip: 'Pulsa «+ Nueva solicitud» para empezar un expediente en blanco.' }
];

const EXP_GUION = [
  { target: 'exp-filtro-devueltos', titulo: 'Separar lo devuelto de lo solicitado',
    tip: 'Aquí tienes dos cosas distintas. Un recaudo devuelto se sustituye. Un recaudo solicitado se carga por primera vez. Empieza por los devueltos.' },
  { target: 'exp-sustituir', titulo: 'Sustituir el balance personal',
    tip: 'El analista lo devolvió por ilegible. Pulsa «Sustituir archivo»: no se borra el anterior, se agrega una versión nueva.' },
  { target: 'exp-versiones', titulo: 'Consultar las versiones anteriores',
    tip: 'El archivo anterior queda consultable con usuario, fecha y hora. Pulsa el enlace para verlo.' },
  { target: 'exp-filtro-todos', titulo: 'Volver al expediente completo',
    tip: 'Lo devuelto ya está resuelto. Pulsa «Todos» para atender el recaudo solicitado.' },
  { target: 'exp-fiador-up', titulo: 'Cargar el primer recaudo del fiador',
    tip: 'Este recaudo no existía: el analista lo solicitó. Aquí no hay nada que sustituir, se carga por primera vez.' },
  { target: 'exp-fiador-bulk', titulo: 'Cargar los cinco que faltan',
    tip: 'En la práctica los subes uno por uno. Aquí pulsa este botón y se cargan los cinco restantes.' },
  { target: 'exp-fiador-datos', titulo: 'Llenar los datos del fiador',
    tip: 'Los seis archivos no bastan: el analista también necesita los datos del fiador escritos.' },
  { target: 'exp-cerrar', titulo: 'Cerrar el expediente',
    tip: 'Los pendientes quedaron en cero y la solicitud sigue en revisión del analista de crédito. Pulsa para terminar.' }
];

const EXP_GUION_APR = [
  { target: 'exp-l2-up', titulo: 'Cargar la factura del vehículo',
    tip: 'Con la aprobación se habilitó la Lista 2. Antes se veía en modo informativo; ahora los botones están activos. Carga la factura.' },
  { target: 'exp-l2-bulk', titulo: 'Cargar los dos que faltan',
    tip: 'Certificado de origen y contrato firmado. Ojo con el contrato: PIVCA lo envía por correo, tú lo subes ya firmado. No se genera desde el portal.' },
  { target: 'exp-registrales', titulo: 'Llenar los datos registrales',
    tip: 'Faltan los seriales y datos del vehículo. Sin ellos no se liquida: pulsa para llenarlos con el ejemplo.' },
  { target: 'exp-cerrar', titulo: 'Cerrar el expediente',
    tip: 'Expediente completo y listo para liquidar. Fíjate que la solicitud sigue en APROBADA: cargar la Lista 2 no cambia su estado.' }
];

const EXP_GUION_NEG = [
  { target: 'exp-filtro-todos', titulo: 'Revisar el expediente completo',
    tip: 'Aunque la solicitud esté rechazada, el expediente queda consultable: puedes revisar todo lo que cargaste.' },
  { target: 'exp-filtro-revision', titulo: 'Ver qué quedó en revisión',
    tip: 'Ningún recaudo admite carga ni sustitución: los botones quedan deshabilitados. Sólo puedes consultar.' },
  { target: 'exp-cerrar', titulo: 'Cerrar el expediente',
    tip: 'Cierra el expediente para ver qué puede hacer el concesionario a continuación.' }
];

const GUION_WIZARD = {
  recaudos: [
    { target: 'wz-up-cedula', titulo: 'Cargar la cédula del cliente', tip: 'Pulsa aquí para cargar la cédula del cliente.' },
    { target: 'wz-bulk', titulo: 'Cargar el resto de los recaudos', tip: 'En la práctica los subes uno por uno. Aquí pulsa este botón y se cargan todos los obligatorios de golpe.' },
    { target: 'wz-next', titulo: 'Pasar a los datos de la solicitud', tip: 'Ya están los obligatorios. Pulsa «Siguiente» para continuar.' }
  ],
  datos: [
    { target: 'wz-next', titulo: 'Revisar los datos del concesionario', tip: 'Estos campos los trae el portal y no se editan. Pulsa «Siguiente».' }
  ],
  personal: [
    { target: 'wz-fill', titulo: 'Llenar la información personal', tip: 'Pulsa «Llenar con datos de ejemplo» para completar la sección de golpe. Fíjate en el estado civil: queda en Casado.' },
    { target: 'wz-next', titulo: 'Continuar al cónyuge', tip: 'Al declarar Casado se activó la sección del cónyuge. Pulsa «Siguiente».' }
  ],
  conyuge: [
    { target: 'wz-fill', titulo: 'Llenar los datos del cónyuge', tip: 'Llena la sección del cónyuge con datos de ejemplo.' },
    { target: 'wz-next', titulo: 'Continuar a ubicación', tip: 'Pulsa «Siguiente» para seguir con la dirección del cliente.' }
  ],
  ubicacion: [
    { target: 'wz-fill', titulo: 'Llenar ubicación y vivienda', tip: 'Llena la dirección. Estado, ciudad y municipio van en cascada.' },
    { target: 'wz-next', titulo: 'Continuar a lo laboral', tip: 'Pulsa «Siguiente».' }
  ],
  laboral: [
    { target: 'wz-dependiente', titulo: 'Indicar cómo genera ingresos', tip: 'El cliente cobra nómina: elige «Dependiente».' },
    { target: 'wz-fill', titulo: 'Llenar el empleo actual', tip: 'Completa los datos de la empresa con el ejemplo.' },
    { target: 'wz-next', titulo: 'Continuar a ingresos', tip: 'Pulsa «Siguiente».' }
  ],
  ingresos: [
    { target: 'wz-fill', titulo: 'Declarar ingresos y egresos', tip: 'Carga el ejemplo y mira cómo se calcula el capital disponible.' },
    { target: 'wz-next', titulo: 'Continuar a crédito', tip: 'Pulsa «Siguiente».' }
  ],
  credito: [
    { target: 'wz-sincreditos', titulo: 'Declarar que no hay créditos vigentes', tip: 'Este cliente no tiene créditos activos. Marca la casilla.' },
    { target: 'wz-next', titulo: 'Continuar al vehículo', tip: 'Pulsa «Siguiente».' }
  ],
  fiador: [
    { target: 'wz-fill', titulo: 'Llenar los datos del fiador', tip: 'Aquí se escribe a mano y el sistema nunca prellena. Para la demo, pulsa el botón de ejemplo.' },
    { target: 'wz-next', titulo: 'Continuar a condiciones', tip: 'Pulsa «Siguiente».' }
  ],
  vehiculo: [
    { target: 'wz-fill', titulo: 'Elegir el vehículo del catálogo', tip: 'Carga el ejemplo. Verás que la versión sólo se habilita cuando hay modelo elegido.' },
    { target: 'wz-next', titulo: 'Continuar al fiador', tip: 'Pulsa «Siguiente».' }
  ],
  condiciones: [
    { target: 'wz-fill', titulo: 'Definir monto, plazo y garantías', tip: 'El monto sale de precio menos inicial. Carga el ejemplo y quédate en 36 meses.' },
    { target: 'wz-next', titulo: 'Ir a la revisión final', tip: 'Pulsa «Siguiente» para revisar todo antes de enviar.' }
  ],
  revision: [
    { target: 'wz-enviar', titulo: 'Enviar la solicitud a PIVCA', tip: 'Todo está completo. Pulsa para enviar el expediente al core de PIVCA.' }
  ]
};

const BADGE = {
  'BORRADOR':                       { bg: '#E7EAEE', fg: '#4A5561' },
  'REVISIÓN ANALISTA DE PRODUCTOS':  { bg: '#E3EDF6', fg: '#2C5F8A' },
  'REVISIÓN ANALISTA DE CRÉDITO':    { bg: '#E3EDF6', fg: '#2C5F8A' },
  'APROBADA':                        { bg: '#E4F0E6', fg: '#2F7A3A' },
  'RECHAZADA':                       { bg: '#F8E6E3', fg: '#B23A2D' },
  'EXPIRADA':                        { bg: '#F2EAE8', fg: '#9B7B76' }
};

const SOLICITUDES = [
  { id: 'ID-001255', estado: 'BORRADOR', nombre: null, vehiculo: null, edad: 'Hace 3 días', pct: 35, docs: true },
  { id: 'ID-001254', estado: 'BORRADOR', nombre: 'MARÍA FERNANDA OCHOA', vehiculo: 'TOYOTA COROLLA 2026', edad: 'Hace 4 días', pct: 72, docs: true },
  { id: 'ID-001251', estado: 'REVISIÓN ANALISTA DE PRODUCTOS', nombre: 'INVERSIONES CARABOBO C.A.', vehiculo: 'MAXUS T60 2025', edad: 'Hace 6 días', ia: true },
  { id: 'ID-001248', estado: 'REVISIÓN ANALISTA DE CRÉDITO', nombre: 'JOSÉ GREGORIO MENDOZA', vehiculo: 'FORD RANGER XLT 2026', edad: 'Hace 8 días', ia: true, docs: true, exp: true, expCaso: 'devuelto' },
  { id: 'ID-001243', estado: 'APROBADA', nombre: 'LUIS ALBERTO PERNÍA', vehiculo: 'CHANGAN CS35 PLUS 2026', edad: 'Hace 12 días', exp: true, expCaso: 'aprobada' },
  { id: 'ID-001239', estado: 'RECHAZADA', nombre: 'YOHANNA RIVAS BLANCO', vehiculo: 'HYUNDAI ACCENT 2025', edad: 'Hace 16 días', exp: true, expCaso: 'negada' },
  { id: 'ID-001231', estado: 'EXPIRADA', nombre: 'DISTRIBUIDORA EL TIGRE S.A.', vehiculo: 'JETOUR X70 2025', edad: 'Hace 34 días' },
  { id: 'ID-001228', estado: 'APROBADA', nombre: 'CARLOS EDUARDO BRICEÑO', vehiculo: 'MG ZS COMFORT 2026', edad: 'Hace 41 días' }
];

const PERFILES = [
  { id: 'natural',  label: 'Persona natural',  desc: 'Cédula, ingresos y referencias personales' },
  { id: 'juridica', label: 'Persona jurídica', desc: 'RIF, acta constitutiva y balances' }
];

const DESENLACES = [
  { id: 'enviar',   label: 'Solo cargar y enviar la solicitud', desc: 'El recorrido base, hasta el envío a PIVCA' },
  { id: 'devuelto', label: 'Me devolvieron un recaudo',         desc: 'Un documento vuelve con observación y hay que reemplazarlo' },
  { id: 'negada',   label: 'Me rechazaron la solicitud',        desc: 'Cómo se comunica y qué se puede hacer después' },
  { id: 'aprobada', label: 'Me aprobaron la solicitud',         desc: 'Aprobación, condiciones y pasos de cierre' }
];

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'borrador', label: 'Borrador', estado: 'BORRADOR' },
  { id: 'docs', label: 'Docs. pendientes' },
  { id: 'ia', label: 'Validación IA' },
  { id: 'prod', label: 'Revisión analista de productos', estado: 'REVISIÓN ANALISTA DE PRODUCTOS' },
  { id: 'cred', label: 'Revisión analista de crédito', estado: 'REVISIÓN ANALISTA DE CRÉDITO' },
  { id: 'aprobada', label: 'Aprobada', estado: 'APROBADA' },
  { id: 'rechazada', label: 'Rechazada', estado: 'RECHAZADA' },
  { id: 'expirada', label: 'Expirada', estado: 'EXPIRADA' }
];

const PER_PAGE = 5;
const HOY = '14/09/2026';

const CLAS = {
  obligatorio: { label: 'Obligatorio', bg: '#FFE9D6', fg: '#B75E15' },
  opcional:    { label: 'Opcional',    bg: '#EAE8E2', fg: '#6B6862' },
  aplica:      { label: 'Si aplica',   bg: '#E3EDF6', fg: '#2C5F8A' }
};

const DOCS = [
  { id: 'cedula', nombre: 'Cédula de identidad', clas: 'obligatorio', ayuda: 'Ambas caras, legible y vigente.', file: 'cedula_cliente.pdf' },
  { id: 'rif', nombre: 'Registro de Información Fiscal (RIF)', clas: 'obligatorio', ayuda: 'Vigente, emitido por el SENIAT.', file: 'rif_cliente.pdf' },
  { id: 'islr', nombre: 'Declaración de ISLR', clas: 'obligatorio', ayuda: 'Un (1) ejercicio fiscal basta. Añade más si los tienes.', file: 'islr_2025.pdf', multi: true },
  { id: 'constancia', nombre: 'Constancia de trabajo o certificación de ingresos', clas: 'obligatorio', ayuda: 'Con sello y firma, no mayor a 30 días.', file: 'constancia_trabajo.pdf' },
  { id: 'estados', nombre: 'Estado de cuenta bancario (últimos 3 meses)', clas: 'obligatorio', ayuda: 'Los tres meses completos, en un solo archivo.', file: 'estado_cuenta_mar2026.pdf' },
  { id: 'refpers', nombre: 'Referencias personales (mínimo 2)', clas: 'obligatorio', ayuda: 'Dos personas que no vivan con el cliente.', file: 'referencias_personales.pdf' },
  { id: 'refbanc', nombre: 'Referencia bancaria', clas: 'obligatorio', ayuda: 'Emitida por el banco donde recibe su nómina.', file: 'referencia_bancaria.pdf' },
  { id: 'servicio', nombre: 'Recibo de servicio', clas: 'obligatorio', ayuda: 'Luz, agua o internet a nombre del cliente.', file: 'recibo_servicio.pdf' },
  { id: 'balance', nombre: 'Balance personal firmado por contador público', clas: 'obligatorio', ayuda: 'Con número de CPC visible.', file: 'balance_personal.pdf' },
  { id: 'fondos', nombre: 'Declaración jurada de origen y destino de fondos', clas: 'obligatorio', ayuda: 'Usa la plantilla de PIVCA, firmada por el cliente.', file: 'declaracion_fondos.pdf', plantilla: true },
  { id: 'conocimientos', nombre: 'Declaración de conocimientos del crédito', clas: 'obligatorio', ayuda: 'Confirma que el cliente entendió las condiciones.', file: 'declaracion_conocimientos.pdf', plantilla: true },
  { id: 'polizavida', nombre: 'Planilla de solicitud de póliza de vida', clas: 'obligatorio', ayuda: 'Se consigna y queda cargada. No pasa por validación de IA.', file: 'poliza_vida.pdf', plantilla: true, noIA: true },
  { id: 'polizaveh', nombre: 'Planilla de solicitud de póliza de vehículo', clas: 'obligatorio', ayuda: 'Se consigna y queda cargada. No pasa por validación de IA.', file: 'poliza_vehiculo.pdf', plantilla: true, noIA: true },
  { id: 'domiciliacion', nombre: 'Autorización de domiciliación de cargo en cuenta', clas: 'opcional', ayuda: 'Se consigna y queda cargada. No pasa por validación de IA.', file: 'domiciliacion.pdf', plantilla: true, noIA: true },
  { id: 'proforma', nombre: 'Factura proforma / cotización', clas: 'opcional', ayuda: 'La emite el concesionario con el precio del vehículo.', file: 'proforma_vehiculo.pdf' },
  { id: 'cedulaconyuge', nombre: 'Cédula del cónyuge', clas: 'aplica', grupo: 'conyuge', ayuda: 'Se exige si el estado civil es casado o concubino.', file: 'cedula_conyuge.pdf' },
  { id: 'rifconyuge', nombre: 'RIF del cónyuge', clas: 'aplica', grupo: 'conyuge', ayuda: 'Se exige si el estado civil es casado o concubino.', file: 'rif_conyuge.pdf' },
  { id: 'actaestado', nombre: 'Acta de matrimonio, capitulaciones, sentencia de divorcio o acta de defunción', clas: 'aplica', grupo: 'conyuge', ayuda: 'El documento que corresponda al estado civil declarado.', file: 'acta_matrimonio.pdf' }
];

const DOCS_FIADOR = [
  { id: 'cedula', nombre: 'Cédula', file: 'fiador_cedula.pdf' },
  { id: 'rif', nombre: 'RIF', file: 'fiador_rif.pdf' },
  { id: 'constancia', nombre: 'Constancia de trabajo', file: 'fiador_constancia.pdf' },
  { id: 'balance', nombre: 'Balance personal', file: 'fiador_balance.pdf' },
  { id: 'estados', nombre: 'Estados de cuenta', file: 'fiador_estados_cuenta.pdf' },
  { id: 'islr', nombre: 'Declaración de ISLR', file: 'fiador_islr.pdf' }
];

const DOCS_JURIDICA = [
  { id: 'docconstitutivo', nombre: 'Documento constitutivo', clas: 'obligatorio', ayuda: 'Registro mercantil con todas sus modificaciones vigentes.', file: 'documento_constitutivo.pdf' },
  { id: 'actaautorizacion', nombre: 'Acta de autorización', clas: 'obligatorio', ayuda: 'Acta que faculta al representante legal a solicitar el financiamiento.', file: 'acta_autorizacion.pdf' },
  { id: 'rifempresa', nombre: 'RIF de la empresa', clas: 'obligatorio', ayuda: 'Vigente, emitido por el SENIAT.', file: 'rif_empresa.pdf' },
  { id: 'cedularep', nombre: 'Cédula de los representantes legales', clas: 'obligatorio', ayuda: 'De cada firmante autorizado, ambas caras.', file: 'cedulas_representantes.pdf' },
  { id: 'rifrep', nombre: 'RIF de los representantes legales', clas: 'obligatorio', ayuda: 'De cada firmante autorizado.', file: 'rif_representantes.pdf' },
  { id: 'islr', nombre: 'Declaración de ISLR de la empresa — últimas tres', clas: 'obligatorio', ayuda: 'Las tres últimas declaraciones con sus comprobantes de pago.', file: 'islr_empresa_2023_2025.pdf', multi: true },
  { id: 'estadosfin', nombre: 'Estados financieros auditados', clas: 'obligatorio', ayuda: 'Los dos últimos ejercicios, firmados por contador público.', file: 'estados_financieros.pdf' },
  { id: 'balance', nombre: 'Balance general firmado por contador público', clas: 'obligatorio', ayuda: 'Con número de CPC visible.', file: 'balance_general.pdf' },
  { id: 'estados', nombre: 'Estado de cuenta bancario (últimos 3 meses)', clas: 'obligatorio', ayuda: 'Los tres meses completos, en un solo archivo.', file: 'estado_cuenta_empresa.pdf' },
  { id: 'refbanc', nombre: 'Referencia bancaria', clas: 'obligatorio', ayuda: 'Del banco donde la empresa mueve su operación.', file: 'referencia_bancaria.pdf' },
  { id: 'refcom', nombre: 'Referencias comerciales', clas: 'obligatorio', ayuda: 'De proveedores o clientes con los que opera.', file: 'referencias_comerciales.pdf' },
  { id: 'reportecomercial', nombre: 'Reporte comercial', clas: 'obligatorio', ayuda: 'Emitido por una central de riesgo o buró comercial.', file: 'reporte_comercial.pdf' },
  { id: 'servicio', nombre: 'Recibo de servicio', clas: 'obligatorio', ayuda: 'De la sede, a nombre de la empresa.', file: 'recibo_servicio_sede.pdf' },
  { id: 'fondos', nombre: 'Declaración jurada de origen y destino de fondos', clas: 'obligatorio', ayuda: 'Usa la plantilla de PIVCA, firmada por el representante legal.', file: 'declaracion_fondos.pdf', plantilla: true },
  { id: 'conocimientos', nombre: 'Declaración de conocimientos del crédito', clas: 'obligatorio', ayuda: 'Confirma que la empresa entendió las condiciones.', file: 'declaracion_conocimientos.pdf', plantilla: true },
  { id: 'polizavida', nombre: 'Planilla de solicitud de póliza de vida', clas: 'obligatorio', ayuda: 'Se consigna y queda cargada. No pasa por validación de IA.', file: 'poliza_vida.pdf', plantilla: true, noIA: true },
  { id: 'polizaveh', nombre: 'Planilla de solicitud de póliza de vehículo', clas: 'obligatorio', ayuda: 'Se consigna y queda cargada. No pasa por validación de IA.', file: 'poliza_vehiculo.pdf', plantilla: true, noIA: true },
  { id: 'domiciliacion', nombre: 'Autorización de domiciliación de cargo en cuenta', clas: 'opcional', ayuda: 'Se consigna y queda cargada. No pasa por validación de IA.', file: 'domiciliacion.pdf', plantilla: true, noIA: true },
  { id: 'proforma', nombre: 'Factura proforma / cotización', clas: 'opcional', ayuda: 'La emite el concesionario con el precio del vehículo.', file: 'proforma_vehiculo.pdf' },
  { id: 'balanceapertura', nombre: 'Balance de apertura', clas: 'aplica', ayuda: 'Sólo para empresas de reciente creación, sin ejercicios cerrados.', file: 'balance_apertura.pdf' }
];

const JUR_SEC = {
  personal: { nombre: 'Información de la empresa', corto: 'Empresa', icon: 'building-2', peso: 9,
    titulo: 'Información de la empresa',
    sub: 'Datos de la compañía, su representante legal y el contacto por donde PIVCA le escribe.' },
  ubicacion: { nombre: 'Ubicación y sede', corto: 'Sede', peso: 7,
    titulo: 'Ubicación y sede',
    sub: 'Dirección fiscal y condición de la sede donde opera la empresa.' },
  laboral: { nombre: 'Actividad económica', corto: 'Actividad', icon: 'factory', peso: 5,
    titulo: 'Actividad económica',
    sub: 'A qué se dedica la empresa y de qué tamaño es su operación.' },
  fiador: { opcional: false, nombre: 'Datos del fiador', corto: 'Fiador', peso: 5,
    titulo: 'Datos del fiador',
    sub: 'Obligatorio en persona jurídica: mínimo un fiador, con sus datos escritos a mano y sus seis recaudos cargados.' }
};

const BLOQUES_JUR = {
  personal: [
    { titulo: 'Datos de la empresa', campos: [
      { label: 'Razón social', v: 'INVERSIONES CARABOBO C.A.' },
      { label: 'RIF', v: 'J-405512889' },
      { label: 'Fecha de constitución', v: '14/03/2016' },
      { label: 'Objeto social', v: 'Comercio de repuestos y servicios automotrices' }
    ] },
    { titulo: 'Representante legal', campos: [
      { label: 'Primer nombre', v: 'MARIANA' },
      { label: 'Primer apellido', v: 'VILLEGAS' },
      { label: 'Cédula / Pasaporte', v: 'V — 15.774.220' },
      { label: 'RIF', v: 'V-157742209' },
      { label: 'Cargo', v: 'Directora general' },
      { label: 'Teléfono celular', v: '0414-9982310' }
    ] },
    { titulo: 'Contacto de la empresa', campos: [
      { label: 'Correo electrónico', v: 'administracion@invcarabobo.com' },
      { label: 'Teléfono', v: '0241-8745520' },
      { label: 'Persona de contacto', v: 'JOSÉ RANGEL — Administración' }
    ] }
  ],
  ubicacion: [
    { titulo: 'Ubicación', cascada: true },
    { titulo: 'Detalles de la dirección fiscal', campos: [
      { label: 'Zona industrial / sector', v: 'Zona Industrial Castillito' },
      { label: 'Calle / avenida', v: 'Av. Paseo Cabriales' },
      { label: 'Edificio / galpón', v: 'Galpón 14-B' },
      { label: 'Piso', v: '1' },
      { label: 'Oficina', v: 'Of. 3' }
    ] },
    { titulo: 'Detalles de la sede', campos: [
      { label: 'Condición de la sede', v: 'Alquilada' },
      { label: 'Años en la sede', v: '7' },
      { label: 'Canon mensual', v: '$1.250,00' }
    ] }
  ],
  laboral: [
    { titulo: 'Operación', campos: [
      { label: 'Sector económico', v: 'Comercio automotriz' },
      { label: 'Años de operación', v: '10' },
      { label: 'Número de empleados', v: '34' },
      { label: 'Ingresos anuales declarados', v: '$1.240.000,00' }
    ] }
  ]
};

const POST_DOCS = [
  { nombre: 'Factura del vehículo' },
  { nombre: 'Certificado de origen' },
  { nombre: 'Contrato firmado' }
];

const SECCIONES = [
  { id: 'recaudos', nombre: 'Recaudos', corto: 'Recaudos', icon: 'folder-open', peso: 0,
    titulo: 'Recaudos del expediente',
    sub: 'Carga los documentos del cliente. Los marcados como obligatorios impiden enviar la solicitud; los demás se pueden consignar después.' },
  { id: 'datos', nombre: 'Datos de la solicitud', corto: 'Datos', icon: 'file-text', peso: 2,
    titulo: 'Datos de la solicitud',
    sub: 'Los trae el portal desde tu usuario de concesionario. No se editan aquí.' },
  { id: 'personal', nombre: 'Información personal', corto: 'Personal', icon: 'user', peso: 8,
    titulo: 'Información personal',
    sub: 'Identidad, datos demográficos y contacto del solicitante.' },
  { id: 'conyuge', nombre: 'Datos del cónyuge', corto: 'Cónyuge', icon: 'users', peso: 5, cond: 'casado',
    titulo: 'Datos del cónyuge',
    sub: 'Esta sección aparece porque el estado civil declarado es casado o concubino.' },
  { id: 'ubicacion', nombre: 'Ubicación y vivienda', corto: 'Ubicación', icon: 'map-pin', peso: 7,
    titulo: 'Ubicación y vivienda',
    sub: 'Dirección de habitación y condición de la vivienda.' },
  { id: 'laboral', nombre: 'Información laboral', corto: 'Laboral', icon: 'briefcase', peso: 5,
    titulo: 'Información laboral',
    sub: 'Cómo genera ingresos el solicitante.' },
  { id: 'ingresos', nombre: 'Ingresos y egresos', corto: 'Ingresos', icon: 'wallet', peso: 6,
    titulo: 'Ingresos y egresos',
    sub: 'De aquí sale el capital disponible con el que el analista calcula la cuota.' },
  { id: 'credito', nombre: 'Operaciones crediticias y cuentas bancarias', corto: 'Crédito', icon: 'landmark', peso: 4,
    titulo: 'Operaciones crediticias y cuentas bancarias',
    sub: 'Declara los créditos vigentes del cliente y las cuentas donde recibe sus ingresos.' },
  { id: 'vehiculo', nombre: 'Datos del vehículo', corto: 'Vehículo', icon: 'car', peso: 6,
    titulo: 'Datos del vehículo',
    sub: 'Marca, modelo, año y versión salen del catálogo del concesionario. No hay texto libre.' },
  { id: 'fiador', nombre: 'Datos del fiador', corto: 'Fiador', icon: 'user-check', peso: 4, opcional: true,
    titulo: 'Datos del fiador',
    sub: 'Si aplica. Se llena a mano y cada fiador trae su propio juego de recaudos.' },
  { id: 'condiciones', nombre: 'Condiciones del financiamiento', corto: 'Condiciones', icon: 'percent', peso: 5,
    titulo: 'Condiciones del financiamiento',
    sub: 'Monto, plazo y garantías con las que el cliente solicita el crédito.' },
  { id: 'revision', nombre: 'Revisión final', corto: 'Revisión', icon: 'clipboard-check', peso: 0,
    titulo: 'Verifica la información ingresada antes de enviar la solicitud al core de PIVCA',
    sub: 'Las secciones en rojo tienen faltantes obligatorios. Las blancas ya están listas.' }
];

const BLOQUES = {
  datos: [
    { titulo: 'Origen de la solicitud', campos: [
      { label: 'Tipo de financiamiento', v: 'PIVCA AUTO' },
      { label: 'Fecha de solicitud', v: HOY },
      { label: 'Número de solicitud', v: 'ID-001256' }
    ] },
    { titulo: 'Concesionario', campos: [
      { label: 'Concesionario', v: 'ASESORES FINANCIEROS MIRANDA' },
      { label: 'Ejecutivo', v: 'LUIS MISLE' },
      { label: 'Código concesionario', v: '502111050' }
    ] }
  ],
  personal: [
    { titulo: 'Identidad', campos: [
      { label: 'Primer nombre', v: 'CARLOS' },
      { label: 'Segundo nombre', v: 'ANDRÉS' },
      { label: 'Primer apellido', v: 'LINARES' },
      { label: 'Segundo apellido', v: 'GUEVARA' },
      { label: 'Cédula / Pasaporte', v: 'V — 18.442.907' },
      { label: 'RIF', v: 'V-184429075' }
    ] },
    { titulo: 'Datos demográficos', campos: [
      { label: 'Fecha de nacimiento', v: '12/04/1988' },
      { label: 'Estado civil', k: 'estadoCivil', select: true },
      { label: 'Sexo', v: 'Masculino' },
      { label: 'Cargas familiares', v: '2' },
      { label: 'Nacionalidad', v: 'Venezolana' },
      { label: 'País de nacimiento', v: 'Venezuela' }
    ] },
    { titulo: 'Antecedentes y contacto', campos: [
      { label: 'Ocupación / profesión', v: 'Ingeniero industrial' },
      { label: 'Nivel académico', v: 'Universitario' },
      { label: 'Correo electrónico', v: 'carlos.linares@correo.com' },
      { label: 'Teléfono celular', v: '0414-3128877' }
    ] }
  ],
  conyuge: [
    { titulo: 'Identidad del cónyuge', campos: [
      { label: 'Primer nombre', v: 'ANDREÍNA' },
      { label: 'Primer apellido', v: 'SALAZAR' },
      { label: 'Cédula / Pasaporte', v: 'V — 19.887.201' },
      { label: 'RIF', v: 'V-198872015' }
    ] },
    { titulo: 'Datos del cónyuge', campos: [
      { label: 'Fecha de nacimiento', v: '03/09/1990' },
      { label: 'Nacionalidad', v: 'Venezolana' },
      { label: 'Ocupación / profesión', v: 'Abogada' },
      { label: 'Teléfono celular', v: '0424-7719003' }
    ] }
  ],
  ubicacion: [
    { titulo: 'Ubicación', cascada: true },
    { titulo: 'Detalles de la dirección', campos: [
      { label: 'Urbanización / sector', v: 'Urb. Santa Fe Norte' },
      { label: 'Calle / avenida', v: 'Av. José María Vargas' },
      { label: 'Edificio / casa', v: 'Res. Alto Prado' },
      { label: 'Piso', v: '4' },
      { label: 'Apartamento', v: '4-B' }
    ] },
    { titulo: 'Detalles de la vivienda', campos: [
      { label: 'Condición de la vivienda', v: 'Alquilada' },
      { label: 'Años de residencia', v: '6' },
      { label: 'Cuota mensual', v: '$480,00' }
    ] }
  ],
  laboralDep: [
    { titulo: 'Empleo actual', campos: [
      { label: 'Empresa', v: 'TECNOSERVICIOS ANDINOS C.A.' },
      { label: 'Cargo', v: 'Jefe de planta' },
      { label: 'Fecha de ingreso', v: '01/02/2019' },
      { label: 'Teléfono laboral', v: '0212-9915540' },
      { label: 'Dirección de la empresa', v: 'Zona Industrial La Trinidad, Galpón 7' }
    ] }
  ],
  laboralInd: [
    { titulo: 'Actividad propia', campos: [
      { label: 'Actividad económica', v: 'Comercio de repuestos' },
      { label: 'RIF de la actividad', v: 'J-405512889' },
      { label: 'Años en la actividad', v: '8' },
      { label: 'Dirección fiscal', v: 'Av. Principal de Boleíta, Local 12' }
    ] }
  ]
};

const UBICACION = [
  { estado: 'Distrito Capital', ciudades: [ { ciudad: 'Caracas', municipios: ['Libertador'] } ] },
  { estado: 'Miranda', ciudades: [
    { ciudad: 'Los Teques', municipios: ['Guaicaipuro', 'Carrizal'] },
    { ciudad: 'Baruta', municipios: ['Baruta', 'El Hatillo'] },
    { ciudad: 'Guarenas', municipios: ['Plaza', 'Zamora'] } ] },
  { estado: 'Carabobo', ciudades: [
    { ciudad: 'Valencia', municipios: ['Valencia', 'Naguanagua', 'San Diego'] },
    { ciudad: 'Puerto Cabello', municipios: ['Puerto Cabello'] } ] },
  { estado: 'Zulia', ciudades: [
    { ciudad: 'Maracaibo', municipios: ['Maracaibo', 'San Francisco'] },
    { ciudad: 'Cabimas', municipios: ['Cabimas'] } ] }
];

const CATALOGO = [
  { marca: 'TOYOTA', modelos: [
    { modelo: 'Corolla', anios: ['2025', '2026'], versiones: ['XLI 1.8 CVT', 'SE-G 2.0 CVT', 'GR-S 2.0 CVT'], precio: 24900 },
    { modelo: 'Hilux', anios: ['2025', '2026'], versiones: ['SR 2.4 4x2', 'SRV 2.8 4x4', 'SRX 2.8 4x4'], precio: 46500 } ] },
  { marca: 'FORD', modelos: [
    { modelo: 'Ranger', anios: ['2025', '2026'], versiones: ['XL 2.2', 'XLT 3.2', 'Limited 3.2'], precio: 44200 },
    { modelo: 'Explorer', anios: ['2026'], versiones: ['XLT', 'Limited', 'ST'], precio: 58900 } ] },
  { marca: 'CHANGAN', modelos: [
    { modelo: 'CS35 Plus', anios: ['2025', '2026'], versiones: ['Comfort', 'Luxury'], precio: 21400 },
    { modelo: 'Alsvin', anios: ['2025', '2026'], versiones: ['Comfort', 'Luxury'], precio: 16800 } ] },
  { marca: 'MG', modelos: [
    { modelo: 'ZS', anios: ['2025', '2026'], versiones: ['Comfort', 'Luxury'], precio: 20900 },
    { modelo: 'MG5', anios: ['2026'], versiones: ['Comfort', 'Deluxe'], precio: 18600 } ] }
];

const FIADOR_CAMPOS = [
  { k: 'nombres', label: 'Nombres', ph: 'Como aparece en la cédula', v: 'RAFAEL ANTONIO' },
  { k: 'apellidos', label: 'Apellidos', ph: 'Como aparece en la cédula', v: 'CAMACHO ROJAS' },
  { k: 'tipodoc', label: 'Tipo de documento', ph: 'V / E / P', v: 'V' },
  { k: 'numdoc', label: 'Número de documento', ph: '00.000.000', v: '12.554.318' },
  { k: 'nacimiento', label: 'Fecha de nacimiento', ph: 'DD/MM/AAAA', v: '22/07/1975' },
  { k: 'nacionalidad', label: 'Nacionalidad', ph: 'Venezolana', v: 'Venezolana' },
  { k: 'ocupacion', label: 'Ocupación', ph: 'Profesión u oficio', v: 'Comerciante' },
  { k: 'correo', label: 'Correo electrónico', ph: 'nombre@correo.com', v: 'rafael.camacho@correo.com' },
  { k: 'telefono', label: 'Teléfono', ph: '0000-0000000', v: '0412-5583014' },
  { k: 'direccion', label: 'Dirección', ph: 'Dirección de habitación', v: 'Urb. El Marqués, Calle 5, Qta. Aurora' },
  { k: 'relacion', label: 'Relación con el solicitante', ph: 'Hermano, socio, amigo…', v: 'Tío materno' }
];

const INGRESOS = [ { label: 'Salario base', v: 1850 }, { label: 'Otros ingresos', v: 420 } ];
const EGRESOS = [ { label: 'Vivienda / alquiler', v: 480 }, { label: 'Cuotas y deudas', v: 260 }, { label: 'Servicios', v: 145 }, { label: 'Otros gastos', v: 190 } ];

const EST_DOC = {
  validado:   { label: 'Verificado',  bg: '#E4F0E6', fg: '#2F7A3A', bc: '#DCE9DE' },
  revision:   { label: 'En revisión', bg: '#E3EDF6', fg: '#2C5F8A', bc: '#D3E3F0' },
  devuelto:   { label: 'Devuelto',    bg: '#F8E6E3', fg: '#B23A2D', bc: '#E8B9B1' },
  solicitado: { label: 'Solicitado',  bg: '#FFE9D6', fg: '#B75E15', bc: '#F0C9A6' },
  pendiente:  { label: 'Pendiente',   bg: '#F4F3EF', fg: '#8E8B82', bc: '#EAE8E2' },
  cargado:    { label: 'Cargado',     bg: '#E4F0E6', fg: '#2F7A3A', bc: '#DCE9DE' }
};

const EXP_REVISION = ['islr', 'estados', 'refbanc', 'servicio'];

const EXP_STEPPER = [
  { n: '1', label: 'Solicitud' },
  { n: '2', label: 'Revisión' },
  { n: '3', label: 'Validación' },
  { n: '4', label: 'Aprobado' }
];

const EXP_CASOS = {
  devuelto: {
    id: 'ID-001248', nombre: 'JOSÉ GREGORIO MENDOZA', correo: 'jg.mendoza@correo.com',
    estado: 'REVISIÓN ANALISTA DE CRÉDITO', vehiculo: 'FORD RANGER XLT 2026',
    badgeBg: '#E3EDF6', badgeFg: '#2C5F8A'
  },
  negada: {
    id: 'ID-001239', nombre: 'YOHANNA RIVAS BLANCO', correo: 'y.rivas@correo.com',
    estado: 'RECHAZADA', vehiculo: 'HYUNDAI ACCENT 2025',
    badgeBg: '#F8E6E3', badgeFg: '#B23A2D', fecha: '02/09/2026'
  },
  aprobada: {
    id: 'ID-001243', nombre: 'LUIS ALBERTO PERNÍA', correo: 'l.pernia@correo.com',
    estado: 'APROBADA', vehiculo: 'CHANGAN CS35 PLUS 2026',
    badgeBg: '#E4F0E6', badgeFg: '#2F7A3A', fecha: '08/09/2026'
  }
};

const LISTA2 = [
  { id: 'facturaveh', nombre: 'Factura del vehículo', ayuda: 'La emite el concesionario a nombre del cliente.', file: 'factura_vehiculo.pdf' },
  { id: 'certorigen', nombre: 'Certificado de origen del vehículo', ayuda: 'Emitido por la ensambladora o el importador.', file: 'certificado_origen.pdf' },
  { id: 'contrato', nombre: 'Contrato firmado', ayuda: 'PIVCA le envía el contrato por correo electrónico. Gestione la firma con el cliente y cárguelo aquí firmado.', file: 'contrato_firmado.pdf', soloCarga: true }
];

const REGISTRALES = [
  { label: 'Serial de carrocería', v: '8XA1234567890' },
  { label: 'Serial del motor', v: 'HR16-889241' },
  { label: 'N.I.V.', v: 'LS5A3AJE8NA123456' },
  { label: 'Serial del chasis', v: 'LS5A3AJE8NA123456' },
  { label: 'Placa', v: 'AB123CD' },
  { label: 'Color', v: 'Gris grafito' },
  { label: 'Peso', v: '1.320 kg' },
  { label: 'Capacidad', v: '450 kg' },
  { label: 'Número de puestos', v: '5' },
  { label: 'Fecha de factura', v: '12/09/2026' }
];

const EXP_STEPPER_NEG = [
  { n: '1', label: 'Solicitud' },
  { n: '2', label: 'Revisión' },
  { n: '3', label: 'Rechazada' }
];

const USUARIO = 'Luis Misle · Asesores Financieros Miranda';

// ── Acceso al prototipo ────────────────────────────────────────
// Credencial única: la misma para todo el que reciba el enlace. No hay
// registro ni recuperación. Y no es una puerta de verdad — quien abra el
// código fuente encuentra la clave. Es una demostración, no un sistema.
const CRED = { email: 'agente@autollanos.com.ve', pass: 'Pactto2026' };

const LS_KEY = 'pactto.demo.v1';

const PERFIL_HASH = { natural: 'natural', juridica: 'juridica', pn: 'natural', pj: 'juridica' };
const DESENLACE_HASH = {
  enviar: 'enviar', devuelto: 'devuelto', negada: 'negada',
  rechazada: 'negada', aprobada: 'aprobada'
};

// #aprobada · #juridica/rechazada · #natural/devuelto — un enlace por
// escenario. Si viene uno manda él: descarta lo guardado y entra al login.
function leerHash() {
  try {
    const raw = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
    if (!raw) return null;
    const out = {};
    raw.split(/[\/,+&]/).forEach(t => {
      const k = decodeURIComponent(t.trim());
      if (PERFIL_HASH[k]) out.perfil = PERFIL_HASH[k];
      if (DESENLACE_HASH[k]) out.desenlace = DESENLACE_HASH[k];
    });
    if (!out.perfil && !out.desenlace) return null;
    out.phase = 'login';
    out.paso = 3;
    return out;
  } catch (e) { return null; }
}

function olvidar() { try { window.localStorage.removeItem(LS_KEY); } catch (e) {} }

function leerGuardado() {
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    // La versión corta el paso: un estado de una build anterior no se restaura.
    if (!d || d.v !== 1 || !d.s || d.s.phase === 'scenario' || d.s.phase === 'login') return null;
    return Object.assign({}, d.s, { tip: null, toast: null, entrando: false, loginErr: '', pass: '', menuUsuario: false });
  } catch (e) { return null; }
}

function guardar(st) {
  try {
    // Sólo se recuerda una sesión iniciada: en la pantalla de escenarios y en
    // la de login no hay nada que guardar, y así «Cerrar sesión» deja limpio.
    if (!st.recordar || st.phase === 'scenario' || st.phase === 'login') { olvidar(); return; }
    const c = Object.assign({}, st);
    // Ni la geometría del tooltip (se recalcula sola) ni la contraseña.
    delete c.tip; delete c.toast; delete c.entrando; delete c.loginErr;
    delete c.pass; delete c.menuUsuario;
    window.localStorage.setItem(LS_KEY, JSON.stringify({ v: 1, s: c }));
  } catch (e) {}
}

function estadoInicial() {
  const h = leerHash();
  const g = leerGuardado();
  if (!h) return g;
  // El enlace sólo manda si pide un escenario distinto del que ya viene en
  // curso. Si coincide, recargar la página no debe devolverte al login.
  if (g && g.perfil === (h.perfil || g.perfil) && g.desenlace === (h.desenlace || g.desenlace)) return g;
  olvidar();
  return h;
}

function escribirHash(perfil, desenlace) {
  try {
    const d = desenlace === 'negada' ? 'rechazada' : desenlace;
    window.history.replaceState(null, '',
      window.location.pathname + window.location.search + '#' + perfil + '/' + d);
  } catch (e) {}
}

const money = (n) => '$' + n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

class Component extends DCLogic {
  state = Object.assign({
    phase: 'scenario',
    paso: 0,
    perfil: 'natural',
    desenlace: 'enviar',
    filtro: 'todos',
    query: '',
    page: 0,
    verPass: false,
    toast: null,
    tip: null,
    wstep: 0,
    tipo: null,
    docs: {},
    fiadorDocs: {},
    islrExtra: 0,
    otros: [],
    llenos: {},
    estadoCivil: '',
    ubic: { estado: '', ciudad: '', municipio: '' },
    laboralTipo: null,
    sinCreditos: false,
    ops: [],
    cuentas: [],
    fiadores: [{ n: 1, datos: {} }],
    veh: { marca: '', modelo: '', anio: '', version: '' },
    plazo: null,
    proforma: false,
    postAbierto: false,
    modal: null,
    nuevas: [],
    expFiltro: 'todos',
    expCaso: 'devuelto',
    expDocs: {},
    expFi: {},
    expFiadorDatos: false,
    expVersiones: false,
    expL2: {},
    expRegistrales: false,
    sel: null,
    expDocPage: 0,
    email: '',
    pass: '',
    loginErr: '',
    entrando: false,
    recordar: true,
    menuUsuario: false,
    libre: false
  }, estadoInicial());

  // ── secciones aplicables ───────────────────────────────
  casado() {
    const e = this.state.estadoCivil;
    return e === 'Casado' || e === 'Concubino';
  }

  esJuridica() { return this.state.tipo === 'juridica'; }

  pasos() {
    const jur = this.esJuridica();
    return SECCIONES
      .filter(s => s.cond !== 'casado' || (!jur && this.casado()))
      .map(s => (jur && JUR_SEC[s.id]) ? Object.assign({}, s, JUR_SEC[s.id]) : s);
  }

  secActual() {
    const p = this.pasos();
    return p[Math.min(this.state.wstep, p.length - 1)];
  }

  // ── guion ──────────────────────────────────────────────
  guion() {
    if (this.state.desenlace === 'aprobada') {
      const a = GUION_BASE.slice(0, 4);
      a.push({ phase: 'app', target: 'card-ID-001243', titulo: 'Abrir la solicitud aprobada',
        tip: 'Esta solicitud fue aprobada. Ábrela: con la aprobación se habilitan recaudos nuevos.' });
      EXP_GUION_APR.forEach(e => a.push({ phase: 'app', target: e.target, titulo: e.titulo, tip: e.tip }));
      return a.map((e, i) => Object.assign({}, e, { kicker: 'Paso ' + (i + 1) }));
    }
    if (this.state.desenlace === 'negada') {
      const n = GUION_BASE.slice(0, 4);
      n.push({ phase: 'app', target: 'pag-next', titulo: 'Pasar a la página siguiente',
        tip: 'La solicitud rechazada no está en la primera página. Pulsa la flecha para avanzar.' });
      n.push({ phase: 'app', target: 'card-ID-001239', titulo: 'Abrir la solicitud rechazada',
        tip: 'Esta solicitud volvió con badge RECHAZADA. Ábrela para ver la decisión.' });
      EXP_GUION_NEG.forEach(e => n.push({ phase: 'app', target: e.target, titulo: e.titulo, tip: e.tip }));
      return n.map((e, i) => Object.assign({}, e, { kicker: 'Paso ' + (i + 1) }));
    }
    if (this.state.desenlace === 'devuelto') {
      const d = GUION_BASE.slice(0, 4);
      d.push({ phase: 'app', target: 'filtro-docs', titulo: 'Buscar lo que tiene pendientes',
        tip: 'El portal te avisó de un recaudo devuelto. Pulsa «Docs. pendientes» para aislar esas solicitudes.' });
      d.push({ phase: 'app', target: 'card-ID-001248', titulo: 'Abrir el expediente',
        tip: 'Abre la solicitud de José Gregorio Mendoza para ver qué le falta.' });
      EXP_GUION.forEach(e => d.push({ phase: 'app', target: e.target, titulo: e.titulo, tip: e.tip }));
      return d.map((e, i) => Object.assign({}, e, { kicker: 'Paso ' + (i + 1) }));
    }
    const g = GUION_BASE.slice();
    const perfil = this.state.perfil;
    g.push({ phase: 'tipo', target: 'tipo-' + perfil, titulo: 'Elegir el tipo de solicitante',
      tip: perfil === 'natural'
        ? 'Este cliente es un particular. Elige «Persona natural».'
        : 'Este cliente es una empresa. Elige «Persona jurídica».' });
    g.push({ phase: 'tipo', target: 'tipo-siguiente', titulo: 'Continuar al asistente',
      tip: 'Pulsa «Siguiente» para abrir el expediente en blanco.' });
    const jur = this.esJuridica();
    this.pasos().forEach((s, i) => {
      let entries = GUION_WIZARD[s.id] || [];
      if (jur) {
        if (s.id === 'laboral') entries = entries.filter(e => e.target !== 'wz-dependiente');
        if (s.id === 'personal') entries = entries.map(e => e.target === 'wz-fill'
          ? { target: 'wz-fill', titulo: 'Llenar los datos de la empresa', tip: 'Pulsa «Llenar con datos de ejemplo» para completar razón social, RIF y representante legal.' }
          : { target: 'wz-next', titulo: 'Continuar a la sede', tip: 'En persona jurídica no hay sección de cónyuge. Pulsa «Siguiente».' });
        if (s.id === 'fiador') entries = entries.map(e => e.target === 'wz-fill'
          ? { target: 'wz-fill', titulo: 'Llenar los datos del fiador', tip: 'Aquí el fiador es obligatorio: sin sus datos y sus seis recaudos la solicitud no se puede enviar.' }
          : e);
        if (s.id === 'recaudos') entries = entries.map(e => {
          if (e.target === 'wz-bulk') return { target: 'wz-bulk', titulo: 'Cargar el resto de los recaudos', tip: 'Son 23 obligatorios, incluidos los seis del fiador. Pulsa aquí y se cargan todos de golpe.' };
          if (e.target === 'wz-up-cedula') return { target: 'wz-up-cedula', titulo: 'Cargar el documento constitutivo', tip: 'Pulsa aquí para cargar el documento constitutivo de la empresa.' };
          return e;
        });
      }
      entries.forEach(e => {
        g.push({ phase: 'wizard', w: i, target: e.target, titulo: e.titulo, tip: e.tip });
      });
      if (s.id === 'conyuge') {
        g.push({ phase: 'wizard', w: 0, target: 'wz-bulk', titulo: 'Cargar los recaudos del cónyuge',
          tip: 'Al declarar casado, tres recaudos del cónyuge pasaron de «si aplica» a obligatorio. Cárgalos aquí antes de seguir.' });
      }
    });
    g.push({ phase: 'wizard', target: 'modal-listado', titulo: 'Volver al listado',
      tip: 'Pulsa para ver tu solicitud ya en el listado, con su nuevo estatus.' });
    g.push({ phase: 'app', target: 'card-nueva', titulo: 'Ver la solicitud en revisión',
      tip: 'Ahí está: ya no es un borrador, está en revisión del analista de productos. Pulsa la tarjeta para cerrar el recorrido.' });
    return g.map((e, i) => Object.assign({}, e, { kicker: 'Paso ' + (i + 1) }));
  }

  step() {
    if (this.props.guiaActiva === false) return null;
    if (this.state.libre) return null;
    const g = this.guion();
    const s = g[this.state.paso];
    if (!s) return null;
    if (s.phase !== this.state.phase) return null;
    if (s.phase === 'wizard' && this.state.modal && s.target !== 'modal-listado') return null;
    if (s.phase === 'wizard' && !this.state.modal && s.target === 'modal-listado') return null;
    if (s.w != null && s.w !== this.state.wstep) {
      const dest = this.pasos()[s.w];
      if (!dest) return null;
      return Object.assign({}, s, {
        target: 'wznav-' + dest.id, redirect: true,
        tip: 'Regresa a «' + dest.nombre + '» para seguir el recorrido.'
      });
    }
    return s;
  }

  next() {
    const n = this.guion().length;
    this.setState(s => ({ paso: Math.min(s.paso + 1, n) }));
  }

  nudge(msg) {
    if (this._tt) clearTimeout(this._tt);
    this.setState({ toast: msg || 'Ese control existe, pero ahora practicamos otra cosa.' });
    this._tt = setTimeout(() => this.setState({ toast: null }), 2800);
  }

  // key → handler. `strict` actions only fire when they are the current target.
  // Si el handler devuelve false la acción no se dio por cumplida y el guion
  // no avanza — así un login con credenciales erradas no cuenta como paso.
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

  // ── acceso ─────────────────────────────────────────────
  entrar() {
    const st = this.state;
    if (st.entrando) return false;
    const mail = (st.email || '').trim().toLowerCase();
    const clave = st.pass || '';
    if (!mail || !clave) {
      this.setState({ loginErr: 'Escribe tu correo y tu contraseña.' });
      return false;
    }
    if (mail !== CRED.email || clave !== CRED.pass) {
      this.setState({ loginErr: 'Correo o contraseña incorrectos.' });
      return false;
    }
    this.setState({ entrando: true, loginErr: '' });
    setTimeout(() => this.setState({ phase: 'app', entrando: false }), 420);
    return true;
  }

  salir = () => {
    olvidar();
    this.setState({
      phase: 'login', paso: 3, menuUsuario: false,
      email: '', pass: '', loginErr: '', entrando: false, verPass: false
    });
  };

  // ── recaudos ───────────────────────────────────────────
  recaudos() {
    const jur = this.esJuridica();
    const casado = this.casado();
    const base = (jur ? DOCS_JURIDICA : DOCS).map(d => Object.assign({}, d, {
      clasEf: (!jur && d.grupo === 'conyuge' && casado) ? 'obligatorio' : d.clas
    }));
    const fi = DOCS_FIADOR.map(d => ({
      id: 'fi-' + d.id, nombre: 'Fiador — ' + d.nombre, file: d.file,
      clas: jur ? 'obligatorio' : 'aplica', clasEf: jur ? 'obligatorio' : 'aplica',
      fiador: true,
      ayuda: jur ? 'Obligatorio: la solicitud no se envía sin al menos un fiador completo.' : 'Se exige sólo si la operación lleva fiador.'
    }));
    return base.concat(fi);
  }

  docSt(id) {
    return (this.state.docs[id] || {}).st || 'pendiente';
  }

  subir(id, file, delay) {
    this.setState(s => ({ docs: Object.assign({}, s.docs, { [id]: { st: 'cargando' } }) }));
    setTimeout(() => {
      this.setState(s => ({ docs: Object.assign({}, s.docs, { [id]: { st: 'cargado', file: file, fecha: HOY } }) }));
    }, delay || 1000);
  }

  bulk = () => {
    const pend = this.recaudos().filter(d => d.clasEf === 'obligatorio' && this.docSt(d.id) === 'pendiente');
    pend.forEach((d, i) => setTimeout(() => this.subir(d.id, d.file, 700), i * 110));
  };

  quitar(id) {
    this.setState(s => {
      const n = Object.assign({}, s.docs);
      delete n[id];
      return { docs: n };
    });
  }

  // ── llenado por sección ────────────────────────────────
  llena(id) {
    const st = this.state;
    if (id === 'recaudos') return this.recaudos().every(d => d.clasEf !== 'obligatorio' || this.docSt(d.id) === 'cargado');
    if (id === 'datos') return true;
    if (id === 'laboral') return this.esJuridica() ? !!st.llenos.laboral : (!!st.laboralTipo && !!st.llenos.laboral);
    if (id === 'credito') return st.sinCreditos || st.ops.length > 0;
    if (id === 'ubicacion') return !!st.llenos.ubicacion && !!st.ubic.municipio;
    if (id === 'vehiculo') return !!(st.veh.marca && st.veh.modelo && st.veh.anio && st.veh.version);
    if (id === 'condiciones') return !!st.llenos.condiciones && !!st.plazo;
    if (id === 'fiador') return !!st.llenos.fiador;
    if (id === 'revision') return true;
    return !!st.llenos[id];
  }

  fill = () => {
    const sec = this.secActual();
    if (!sec) return;
    const id = sec.id;
    if (id === 'personal') {
      if (this.esJuridica()) this.setState(s => ({ llenos: Object.assign({}, s.llenos, { personal: true }) }));
      else this.setState(s => ({ llenos: Object.assign({}, s.llenos, { personal: true }), estadoCivil: 'Casado' }));
    } else if (id === 'ubicacion') {
      this.setState(s => ({
        llenos: Object.assign({}, s.llenos, { ubicacion: true }),
        ubic: { estado: 'Miranda', ciudad: 'Baruta', municipio: 'Baruta' }
      }));
    } else if (id === 'laboral') {
      this.setState(s => ({ laboralTipo: s.laboralTipo || 'dep', llenos: Object.assign({}, s.llenos, { laboral: true }) }));
    } else if (id === 'vehiculo') {
      this.setState(s => ({
        veh: { marca: 'TOYOTA', modelo: 'Corolla', anio: '2026', version: 'SE-G 2.0 CVT' },
        llenos: Object.assign({}, s.llenos, { vehiculo: true })
      }));
    } else if (id === 'condiciones') {
      this.setState(s => ({ plazo: s.plazo || 36, llenos: Object.assign({}, s.llenos, { condiciones: true }) }));
    } else if (id === 'fiador') {
      this.setState(s => ({
        fiadores: s.fiadores.map((f, i) => i === 0 ? Object.assign({}, f, { datos: FIADOR_CAMPOS.reduce((a, c) => (a[c.k] = c.v, a), {}) }) : f),
        llenos: Object.assign({}, s.llenos, { fiador: true })
      }));
    } else {
      this.setState(s => ({ llenos: Object.assign({}, s.llenos, { [id]: true }) }));
    }
  };

  // ── expediente ─────────────────────────────────────────
  precio() {
    const v = this.state.veh;
    const m = (CATALOGO.find(c => c.marca === v.marca) || { modelos: [] }).modelos.find(x => x.modelo === v.modelo);
    return m ? m.precio : 0;
  }

  inicial() { return Math.round(this.precio() * 0.35); }

  pctExpediente() {
    let tot = 0, ok = 0;
    this.recaudos().forEach(d => {
      if (d.clasEf !== 'obligatorio') return;
      tot += 1;
      if (this.docSt(d.id) === 'cargado') ok += 1;
    });
    this.pasos().forEach(s => {
      if (!s.peso) return;
      tot += s.peso;
      if (this.llena(s.id)) ok += s.peso;
    });
    return tot ? Math.round(ok / tot * 100) : 0;
  }

  faltantes() {
    const dur = [], luego = [];
    this.recaudos().forEach(d => {
      const cargado = this.docSt(d.id) === 'cargado';
      if (cargado) return;
      const nombre = d.nombre;
      if (d.clasEf === 'obligatorio') dur.push({ t: nombre });
      else if (d.clasEf === 'aplica') luego.push({ t: nombre + ' — sólo si el caso del cliente lo requiere' });
      else luego.push({ t: nombre + ' — opcional' });
    });
    this.pasos().forEach(s => {
      if (!s.peso || this.llena(s.id)) return;
      if (s.opcional) luego.push({ t: s.nombre + ' — se consigna si la operación lleva fiador' });
      else dur.push({ t: s.nombre + ' — sección incompleta' });
    });
    return { dur: dur, luego: luego };
  }

  enviar = () => {
    const f = this.faltantes();
    if (f.dur.length) { this.setState({ modal: 'faltan' }); return; }
    const v = this.state.veh;
    this.setState({
      modal: 'ok',
      nuevas: [{
        id: 'ID-001256', estado: 'REVISIÓN ANALISTA DE PRODUCTOS',
        nombre: this.esJuridica() ? 'INVERSIONES CARABOBO C.A.' : 'CARLOS ANDRÉS LINARES GUEVARA',
        vehiculo: (v.marca + ' ' + v.modelo + ' ' + v.anio).toUpperCase(), edad: 'Hace un momento', ia: true, nueva: true
      }]
    });
  };

  irA(id) {
    const i = this.pasos().findIndex(s => s.id === id);
    if (i >= 0) this.setState({ wstep: i, modal: null });
  }

  // ── expediente ─────────────────────────────────────────
  expEstado(idDoc) {
    const o = this.state.expDocs[idDoc];
    if (o) return o.st;
    if (idDoc === 'balance') return 'devuelto';
    return EXP_REVISION.indexOf(idDoc) >= 0 ? 'revision' : 'validado';
  }

  sustituir = () => {
    this.setState(s => ({ expDocs: Object.assign({}, s.expDocs, { balance: { st: 'cargando' } }) }));
    setTimeout(() => {
      this.setState(s => ({
        expDocs: Object.assign({}, s.expDocs, { balance: { st: 'revision', file: 'balance_personal_v2.pdf', fecha: HOY } }),
        expFiltro: s.expFiltro === 'devueltos' ? 'revision' : s.expFiltro,
        expDocPage: 0
      }));
    }, 900);
  };

  subirFiador(idDoc, file, delay) {
    this.setState(s => ({ expFi: Object.assign({}, s.expFi, { [idDoc]: { st: 'cargando' } }) }));
    setTimeout(() => {
      this.setState(s => ({ expFi: Object.assign({}, s.expFi, { [idDoc]: { st: 'cargado', file: file, fecha: HOY } }) }));
    }, delay || 900);
  }

  fiadorBulk = () => {
    const pend = DOCS_FIADOR.filter(d => !(this.state.expFi[d.id] || {}).st);
    pend.forEach((d, i) => setTimeout(() => this.subirFiador(d.id, d.file, 650), i * 130));
  };

  subirL2(idDoc, file, delay) {
    this.setState(s => ({ expL2: Object.assign({}, s.expL2, { [idDoc]: { st: 'cargando' } }) }));
    setTimeout(() => {
      this.setState(s => ({ expL2: Object.assign({}, s.expL2, { [idDoc]: { st: 'cargado', file: file, fecha: HOY } }) }));
    }, delay || 900);
  }

  l2Bulk = () => {
    const pend = LISTA2.filter(d => !(this.state.expL2[d.id] || {}).st);
    pend.forEach((d, i) => setTimeout(() => this.subirL2(d.id, d.file, 650), i * 150));
  };

  l2Listos() {
    return LISTA2.filter(d => (this.state.expL2[d.id] || {}).st === 'cargado').length;
  }

  expPendientes() {
    const dev = this.expEstado('balance') === 'devuelto' ? 1 : 0;
    const fiOk = DOCS_FIADOR.every(d => (this.state.expFi[d.id] || {}).st === 'cargado') && this.state.expFiadorDatos;
    const sol = fiOk ? 0 : 1;
    return { dev: dev, sol: sol, total: dev + sol, pre: dev + sol, post: 0, resuelto: dev + sol === 0 };
  }

  expVals() {
    const st = this.state;
    const acento = this.props.acento || '#F58634';
    const sel = (this.state.nuevas.concat(SOLICITUDES)).find(x => x.id === st.sel);
    const caso = (sel && sel.expCaso) || st.expCaso || 'devuelto';
    const cli = EXP_CASOS[caso] || EXP_CASOS.devuelto;
    const neg = caso === 'negada';
    const apr = caso === 'aprobada';
    const verPerfil = !!(sel && sel.exp);
    const l2ok = this.l2Listos();
    const l2Falta = LISTA2.length - l2ok;
    const p = this.expPendientes();
    const balEst = this.expEstado('balance');

    const stepper = (neg ? EXP_STEPPER_NEG : EXP_STEPPER).map((n, i) => {
      const ultimo = i === (neg ? EXP_STEPPER_NEG.length : EXP_STEPPER.length) - 1;
      if (neg && i === 2) return {
        n: n.n, label: 'RECHAZADA', bg: '#B23A2D', fg: '#FFFFFF', bc: '#B23A2D',
        labelFg: '#B23A2D', labelFw: '700', lineBg: '#E4E2DC', showLine: !ultimo
      };
      const alcanzado = apr ? true : i < 2;
      const actual = apr ? false : i === 2;
      return {
        n: n.n, label: n.label.toUpperCase(),
        bg: alcanzado ? '#2F7A3A' : '#FFFFFF',
        fg: alcanzado ? '#FFFFFF' : '#8E8B82',
        bc: alcanzado ? '#2F7A3A' : (actual ? acento : '#D9D6CE'),
        labelFg: alcanzado ? '#2F5C36' : (actual ? '#1F1B16' : '#B8B5AC'),
        labelFw: actual ? '700' : '600',
        lineBg: (apr || i < 2) ? '#2F7A3A' : '#E4E2DC',
        showLine: !ultimo
      };
    });

    const FIL = [
      { id: 'todos', label: 'Todos', gkey: 'exp-filtro-todos' },
      { id: 'devueltos', label: 'Devueltos', gkey: 'exp-filtro-devueltos' },
      { id: 'revision', label: 'En revisión', gkey: 'exp-filtro-revision' }
    ];
    const filtros = FIL.map(fl => {
      const act = st.expFiltro === fl.id;
      return {
        label: fl.label, gkey: fl.gkey,
        bc: act ? acento : '#D9D6CE', bg: act ? acento : '#FFFFFF', fg: act ? '#FFFFFF' : '#6B6862',
        onClick: this.guard(fl.gkey, () => this.setState({ expFiltro: fl.id, expDocPage: 0 }))
      };
    });

    // ── filas de documentos (Lista 1) ──
    let filas = DOCS.filter(d => d.clas === 'obligatorio').map(d => {
      let e;
      if (neg) e = EXP_REVISION.indexOf(d.id) >= 0 ? 'revision' : 'validado';
      else if (apr) e = 'validado';
      else e = (d.id === 'balance' || EXP_REVISION.indexOf(d.id) >= 0) ? this.expEstado(d.id) : 'validado';
      const m = EST_DOC[e === 'cargando' ? 'pendiente' : e];
      const esBal = d.id === 'balance' && !neg && !apr;
      const dev = e === 'devuelto';
      return {
        id: d.id, nombre: d.nombre, estado: e,
        estLabel: m.label.toUpperCase(), estFg: m.fg, estBg: m.bg,
        fecha: dev ? '06/09/2026' : (esBal && e === 'revision' ? HOY : '09/09/2026'),
        bc: dev ? '#E8B9B1' : '#EAE8E2',
        bg: dev ? '#FEF8F7' : '#FFFFFF',
        icon: dev ? 'file-warning' : 'file-text',
        iconFg: dev ? '#B23A2D' : '#B8B5AC',
        motivo: dev ? 'Documento ilegible.' : null,
        sustituir: dev,
        cargando: e === 'cargando',
        verArchivo: !dev && e !== 'cargando',
        verVersiones: esBal && e === 'revision',
        versAbierto: esBal && e === 'revision' && st.expVersiones,
        check: e === 'validado',
        bloqueado: neg,
        onVer: this.guard('ver-' + d.id, () => this.nudge('Vista previa del archivo — en la demo no abrimos documentos.')),
        onVersiones: this.guard('exp-versiones', () => this.setState(s2 => ({ expVersiones: !s2.expVersiones })))
      };
    });
    if (!neg && !apr) filas = filas.filter(r => r.sustituir).concat(filas.filter(r => !r.sustituir));
    const fil = st.expFiltro;
    if (fil === 'devueltos') filas = filas.filter(r => r.estado === 'devuelto');
    if (fil === 'revision') filas = filas.filter(r => r.estado === 'revision');
    const POR = 5;
    const pags = Math.max(1, Math.ceil(filas.length / POR));
    const pag = Math.min(st.expDocPage, pags - 1);
    const visibles = filas.slice(pag * POR, pag * POR + POR);

    const fiadorDocs = DOCS_FIADOR.map((d, i) => {
      const o = st.expFi[d.id] || {};
      const e = o.st || 'pendiente';
      const m = EST_DOC[e === 'cargando' ? 'pendiente' : e];
      return {
        nombre: d.nombre, estLabel: m.label, estBg: m.bg, estFg: m.fg,
        bc: e === 'cargado' ? '#DCE9DE' : '#F0C9A6',
        cargado: e === 'cargado', file: o.file,
        showSubir: e === 'pendiente',
        upKey: i === 0 ? 'exp-fiador-up' : ('exp-up-' + d.id),
        onSubir: this.guard(i === 0 ? 'exp-fiador-up' : ('exp-up-' + d.id), () => this.subirFiador(d.id, d.file))
      };
    });

    const fiOk = DOCS_FIADOR.every(d => (st.expFi[d.id] || {}).st === 'cargado');

    return {
      expVerPerfil: verPerfil,
      expVacioPerfil: !verPerfil,
      expNombre: cli.nombre,
      expId: cli.id,
      expCorreo: cli.correo,
      expEstadoLabel: cli.estado,
      expEstadoBg: cli.badgeBg,
      expEstadoFg: cli.badgeFg,
      expUsuario: USUARIO,
      expStepper: stepper,
      expLineaIni: (apr || !neg) ? '#2F7A3A' : '#2F7A3A',
      expFiltros: filtros,

      expNegada: neg,
      expNegFecha: 'Decisión registrada el ' + (cli.fecha || HOY),
      expVerPend: !neg,
      expNota: neg
        ? 'El expediente queda consultable, pero no admite cargas ni sustituciones.'
        : (apr
          ? 'Cargar estos recaudos no cambia el estado de la solicitud: se mantiene en APROBADA.'
          : 'Cargar o sustituir un recaudo no cambia el estatus de la solicitud.'),

      expPendTotal: String(apr ? l2Falta : p.total),
      expPendDesglose: apr
        ? ('Pre-Aprobación: 0 · Post-Aprobación: ' + l2Falta)
        : ('Pre-Aprobación: ' + p.pre + ' · Post-Aprobación: ' + p.post),
      expDev: apr ? '0 devuelto' : (p.dev + ' devuelto'),
      expSol: apr ? (l2Falta + ' por liquidar') : (p.sol + ' solicitado'),
      expDevBg: (!apr && p.dev) ? '#F8E6E3' : '#F4F3EF', expDevFg: (!apr && p.dev) ? '#B23A2D' : '#8E8B82',
      expSolBg: (apr ? l2Falta : p.sol) ? '#FFE9D6' : '#F4F3EF', expSolFg: (apr ? l2Falta : p.sol) ? '#B75E15' : '#8E8B82',

      expFilas: visibles,
      expFilasRango: filas.length ? ('Mostrando ' + visibles.length + ' de ' + filas.length) : 'Sin documentos en este filtro',
      expFilasPagina: (pag + 1) + ' / ' + pags,
      onFilasPrev: this.guard('doc-prev', () => this.setState({ expDocPage: Math.max(0, pag - 1) })),
      onFilasNext: this.guard('doc-next', () => this.setState({ expDocPage: Math.min(pags - 1, pag + 1) })),
      onSustituir: this.guard('exp-sustituir', this.sustituir, true),

      expVerSolicitado: !neg && !apr,
      expFiadorDocs: fiadorDocs,
      expFiadorFalta: !fiOk,
      expFiadorCampos: FIADOR_CAMPOS.map(c => ({
        label: c.label, ph: c.ph, v: st.expFiadorDatos ? c.v : '',
        ro: st.expFiadorDatos, bg: st.expFiadorDatos ? '#FAFAF8' : '#FFFFFF',
        onChange: () => {}
      })),
      expFiadorDatosListos: st.expFiadorDatos,
      onFiadorBulk: this.guard('exp-fiador-bulk', this.fiadorBulk),
      onFiadorDatos: this.guard('exp-fiador-datos', () => {
        this.setState({ expFiadorDatos: true });
      }, true),

      expVerL2: !neg,
      expL2Chip: apr ? 'Habilitada' : 'Bloqueada',
      expL2ChipBg: apr ? '#E4F0E6' : '#F4F3EF',
      expL2ChipFg: apr ? '#2F7A3A' : '#8E8B82',
      expL2Nota: apr
        ? 'Estos recaudos no bloquean el envío de la solicitud; bloquean la liquidación del financiamiento.'
        : 'Modo informativo — la carga se habilita cuando la solicitud queda aprobada.',
      expL2Bulk: apr && l2Falta > 0,
      onL2Bulk: this.guard('exp-l2-bulk', this.l2Bulk),
      expL2Docs: LISTA2.map((d, i) => {
        const o = st.expL2[d.id] || {};
        const e = apr ? (o.st || 'pendiente') : 'bloqueado';
        const m = e === 'bloqueado'
          ? { label: 'Bloqueado', bg: '#F4F3EF', fg: '#B8B5AC' }
          : EST_DOC[e === 'cargando' ? 'pendiente' : e];
        return {
          nombre: d.nombre,
          ayuda: apr ? d.ayuda : 'Sin cargar',
          estLabel: m.label, estBg: m.bg, estFg: m.fg,
          bc: e === 'cargado' ? '#DCE9DE' : (apr ? '#F0C9A6' : '#EAE8E2'),
          cargando: e === 'cargando', cargado: e === 'cargado',
          file: o.file, fecha: o.fecha,
          showSubir: apr && e === 'pendiente',
          upKey: i === 0 ? 'exp-l2-up' : ('exp-l2-' + d.id),
          onSubir: this.guard(i === 0 ? 'exp-l2-up' : ('exp-l2-' + d.id), () => this.subirL2(d.id, d.file))
        };
      }),

      expRegNota: apr
        ? 'Obligatorios para liquidar. Se habilitaron junto con la Lista 2.'
        : 'Se habilita junto con la lista de documentos posteriores a la aprobación.',
      expRegBoton: apr && !st.expRegistrales,
      expRegistralesListos: st.expRegistrales,
      expRegistralesCampos: REGISTRALES.map(c => ({
        label: c.label,
        shown: (apr && st.expRegistrales) ? c.v : '—',
        fg: (apr && st.expRegistrales) ? '#1F1B16' : '#C2BFB6',
        fw: (apr && st.expRegistrales) ? '700' : '500'
      })),
      onRegistrales: this.guard('exp-registrales', () => {
        this.setState({ expRegistrales: true });
      }, true),

      expMonto: money(12000),
      expPlazo: '24 meses',
      expInicial: money(10500.01),
      expVehNombre: cli.vehiculo.replace(/ \d{4}$/, ''),
      expVehAnio: (cli.vehiculo.match(/\d{4}$/) || ['2026'])[0],

      expCerrarBox: neg || (apr && l2Falta === 0 && st.expRegistrales) || (!neg && !apr && p.resuelto),
      expCerrarBc: neg ? '#EAE8E2' : '#DCE9DE',
      expCerrarFg: neg ? '#8E8B82' : '#2F7A3A',
      expCerrarIcon: neg ? 'archive' : 'check',
      expCerrarKicker: neg ? 'Expediente cerrado' : (apr ? 'Expediente completo' : 'Sin pendientes'),
      expCerrarTexto: neg
        ? 'Queda archivado y consultable. No se reabre ni admite cargas nuevas.'
        : (apr
          ? 'Lista 2 cargada y datos registrales capturados: el expediente está listo para liquidar. La solicitud se mantiene en APROBADA.'
          : 'Resolviste el recaudo devuelto y el solicitado. La solicitud sigue en revisión del analista de crédito.'),

      onExpMenu: this.guard('exp-menu', () => this.nudge('Menú de acciones del expediente — fuera del alcance de esta demo.')),
      onExpCerrar: this.guard('exp-cerrar', () => this.setState({ phase: 'done' }), true)
    };
  }

  // ── medición del globo ─────────────────────────────────
  applyHalo() {
    document.querySelectorAll('[data-guide-active]').forEach(e => e.removeAttribute('data-guide-active'));
    const st = this.step();
    if (!st) return null;
    const el = document.querySelector('[data-guide="' + st.target + '"]');
    if (el) el.setAttribute('data-guide-active', 'true');
    // Red de seguridad: si el objetivo no está en pantalla, avisa una vez.
    if (!el) {
      this._perdido = (this._perdido || 0) + 1;
      if (this._perdido === 6 && this._avisado !== this.state.paso) {
        this._avisado = this.state.paso;
        this.nudge('El objetivo está oculto por un filtro. Pulsa «Todos» para verlo.');
      }
    } else { this._perdido = 0; }
    return el;
  }

  // Obstáculos = hojas con texto visible, fuera del objetivo y del cromo fijo.
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

  // Deja el panel con scroll propio dentro del viewport (scroll de ventana).
  encuadrar(cont) {
    const vh = window.innerHeight;
    const r = cont.getBoundingClientRect();
    if (r.top >= 128 && (r.bottom <= vh - 96 || r.height > vh - 224)) return;
    window.scrollTo(0, Math.max(0, window.scrollY + r.top - 128));
  }

  // Etapa 3: con el objetivo ya colocado dentro del panel, corrige la ventana.
  ajustarVentana(el) {
    const vh = window.innerHeight;
    const r = el.getBoundingClientRect();
    if (r.top >= 124 && r.bottom <= vh - 104) return;
    const d = r.top < 124 ? (r.top - 140) : (r.bottom - (vh - 118));
    window.scrollTo(0, Math.max(0, window.scrollY + d));
  }

  contenedor(el) {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const ov = getComputedStyle(p).overflowY;
      if ((ov === 'auto' || ov === 'scroll') && p.scrollHeight > p.clientHeight + 4) return p;
      p = p.parentElement;
    }
    return null;
  }

  elegirSitio(el, W, H) {
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const TOPE = 104;
    const topLat = Math.min(Math.max(TOPE, r.top), Math.max(TOPE, vh - H - 92));
    const lx = Math.max(12, Math.min(r.left - 4, vw - W - 12));
    const cand = [
      { mode: 'right', left: r.right + 14, top: topLat },
      { mode: 'left', left: r.left - 14 - W, top: topLat },
      { mode: 'below', left: lx, top: r.bottom + 14 },
      { mode: 'above', left: lx, top: r.top - 14 - H }
    ].filter(c => c.left >= 12 && c.left + W <= vw - 12 && c.top >= TOPE && c.top + H <= vh - 92);
    if (!cand.length) return { mode: 'below', left: lx, top: Math.max(TOPE, Math.min(r.bottom + 14, vh - H - 92)), choques: 99, r: r };
    const obs = this.obstaculos(el);
    let mejor = null;
    cand.forEach(c => {
      const box = { top: c.top, bottom: c.top + H, left: c.left, right: c.left + W };
      let n = 0;
      obs.forEach(o => { if (box.top < o.r.bottom && o.r.top < box.bottom && box.left < o.r.right && o.r.left < box.right) n += o.peso; });
      const s = Object.assign({}, c, { choques: n, r: r });
      if (!mejor || n < mejor.choques) mejor = s;
    });
    return mejor;
  }

  altoTip() {
    const el = document.querySelector('[data-tip]');
    const h = el ? el.getBoundingClientRect().height : 0;
    return h > 30 ? h : 118;
  }

  measure() {
    const el = this.applyHalo();
    if (!el) { if (this.state.tip) this.setState({ tip: null }); return; }
    // Si el usuario se desplazó y el objetivo salió de pantalla, oculta el globo
    // en lugar de arrastrar la vista: «¿Dónde pulso?» lo trae de vuelta.
    const rr = el.getBoundingClientRect();
    if (rr.bottom < 100 || rr.top > window.innerHeight - 92) {
      if (this.state.tip) this.setState({ tip: null });
      // Un solo reencuadre por paso, y sólo si el usuario no ha desplazado nada:
      // cubre los objetivos que aparecen después (tras una carga, por ejemplo).
      if (this._reenc !== this.state.paso && (this._uScroll || 0) < (this._pasoT || 0)) {
        this._reenc = this.state.paso;
        this.centrar();
      }
      return;
    }
    const W = Math.min(340, window.innerWidth - 32);
    const H = this.altoTip();
    const s = this.elegirSitio(el, W, H);
    const lateral = s.mode === 'right' || s.mode === 'left';
    const cy = lateral ? Math.round(Math.min(Math.max(16, s.r.top + s.r.height / 2 - s.top), H - 16)) : 0;
    const t = { top: Math.round(s.top), left: Math.round(s.left), w: W, mode: s.mode, cy: cy };
    const p = this.state.tip;
    if (!p || p.top !== t.top || p.left !== t.left || p.mode !== t.mode || p.w !== t.w || p.cy !== t.cy) this.setState({ tip: t });
  }

  paintIcons() {
    const L = window.lucide;
    if (!L || !L.createIcons) return;
    let need = false;
    document.querySelectorAll('span[data-lucide]').forEach(sp => {
      const n = sp.getAttribute('data-lucide');
      if (!n) return;
      if (sp.getAttribute('data-icon-set') === n) return;
      sp.innerHTML = '<i data-lucide-i="' + n + '"></i>';
      sp.setAttribute('data-icon-set', n);
      need = true;
    });
    if (!need) return;
    L.createIcons({ nameAttr: 'data-lucide-i', icons: L.icons || undefined, attrs: { width: '100%', height: '100%', 'stroke-width': 1.5 } });
    document.querySelectorAll('span[data-lucide] > svg').forEach(svg => {
      const sw = svg.parentNode.getAttribute('data-sw');
      if (sw) svg.setAttribute('stroke-width', sw);
      svg.style.display = 'block';
    });
  }

  componentDidMount() {
    if (this.props.acento) document.documentElement.style.setProperty('--pv-accent', this.props.acento);
    // Cambiar el hash con la página ya abierta debe llevarte a ese escenario
    // igual que abrir el enlace en frío. escribirHash() usa replaceState, que
    // no dispara este evento, así que no hay bucle.
    this._h = () => { if (leerHash()) window.location.reload(); };
    window.addEventListener('hashchange', this._h);
    this._m = () => this.measure();
    this._u = () => { this._uScroll = Date.now(); };
    window.addEventListener('wheel', this._u, { passive: true });
    window.addEventListener('touchmove', this._u, { passive: true });
    window.addEventListener('keydown', (e) => {
      if (['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) >= 0) this._u();
    });
    window.addEventListener('resize', this._m);
    window.addEventListener('scroll', this._m, true);
    this._iv = setInterval(() => { this.measure(); this.paintIcons(); }, 350);
    requestAnimationFrame(this._m);
    this.paintIcons();
    setTimeout(() => this.centrar(), 320);
  }

  componentDidUpdate(prev) {
    // Amortiguado: measure() toca el estado cada 350 ms y no queremos
    // escribir en localStorage a ese ritmo.
    if (this._sv) clearTimeout(this._sv);
    this._sv = setTimeout(() => guardar(this.state), 400);
    if (this.props.acento && prev.acento !== this.props.acento) {
      document.documentElement.style.setProperty('--pv-accent', this.props.acento);
    }
    this.applyHalo();
    this.paintIcons();
    if (this._lastPaso !== this.state.paso || this._lastW !== this.state.wstep) {
      this._lastPaso = this.state.paso;
      this._lastW = this.state.wstep;
      this._pasoT = Date.now();
      this._reenc = null;
      setTimeout(() => this.centrar(), 90);
    }
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

    // Etapa 1: el contenedor con scroll propio tiene que estar en pantalla.
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
      this.ajustarVentana(el);
      setTimeout(this._m, 240);
      return;
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

  componentWillUnmount() {
    if (this._sv) clearTimeout(this._sv);
    window.removeEventListener('hashchange', this._h);
    window.removeEventListener('wheel', this._u);
    window.removeEventListener('touchmove', this._u);
    window.removeEventListener('resize', this._m);
    window.removeEventListener('scroll', this._m, true);
    clearInterval(this._iv);
    if (this._tt) clearTimeout(this._tt);
  }

  onDonde = () => {
    const st = this.step();
    if (!st) return;
    const el = document.querySelector('[data-guide="' + st.target + '"]');
    if (!el) { this.nudge('El objetivo está oculto por un filtro. Pulsa «Todos» para verlo.'); return; }
    this._lastPaso = null;
    this.centrar();
    el.setAttribute('data-guide-flash', 'true');
    setTimeout(() => el.removeAttribute('data-guide-flash'), 1300);
    setTimeout(this._m, 560);
  };

  reset = (keepEscenario) => {
    if (this._tt) clearTimeout(this._tt);
    if (this._sv) clearTimeout(this._sv);
    olvidar();
    if (!keepEscenario) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {}
    }
    this.setState(s => ({
      phase: keepEscenario ? 'login' : 'scenario',
      paso: keepEscenario ? 3 : 0,
      email: '', pass: '', loginErr: '', entrando: false, menuUsuario: false, libre: false,
      filtro: 'todos', query: '', page: 0, verPass: false, toast: null, tip: null,
      wstep: 0, tipo: null, docs: {}, fiadorDocs: {}, islrExtra: 0, otros: [], llenos: {},
      estadoCivil: '', ubic: { estado: '', ciudad: '', municipio: '' }, laboralTipo: null,
      sinCreditos: false, ops: [], cuentas: [], fiadores: [{ n: 1, datos: {} }],
      veh: { marca: '', modelo: '', anio: '', version: '' }, plazo: null, proforma: false,
      postAbierto: false, modal: null, nuevas: [],
      expFiltro: 'todos', expCaso: 'devuelto', expDocs: {}, expFi: {}, expFiadorDatos: false,
      expVersiones: false, expL2: {}, expRegistrales: false, sel: null, expDocPage: 0
    }));
  };

  // ── datos derivados ────────────────────────────────────
  filtradas() {
    const { filtro, query } = this.state;
    const q = query.trim().toLowerCase();
    const def = FILTROS.find(f => f.id === filtro);
    return this.state.nuevas.concat(SOLICITUDES).filter(s => {
      if (def && def.estado && s.estado !== def.estado) return false;
      if (filtro === 'docs' && !s.docs) return false;
      if (filtro === 'ia' && !s.ia) return false;
      if (q && !((s.nombre || 'sin nombre') + ' ' + s.id + ' ' + (s.vehiculo || '')).toLowerCase().includes(q)) return false;
      return true;
    });
  }

  // ── valores del asistente ──────────────────────────────
  campo(f, lleno) {
    if (f.select) {
      return {
        isSelect: true, isBox: false, isInput: false, label: f.label,
        v: this.state.estadoCivil, disabled: false,
        opts: [{ v: '', t: 'Selecciona…' }].concat(['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Concubino'].map(x => ({ v: x, t: x }))),
        onChange: (e) => this.setState({ estadoCivil: e.target.value }),
        bc: this.state.estadoCivil ? '#D9D6CE' : '#F0C9A6', bg: '#FFFFFF', fg: '#1F1B16'
      };
    }
    return {
      isBox: true, isSelect: false, isInput: false, label: f.label,
      shown: lleno ? f.v : 'Sin capturar',
      bc: '#EAE8E2', bg: lleno ? '#FAFAF8' : '#FFFFFF',
      fg: lleno ? '#1F1B16' : '#C2BFB6', fw: lleno ? '600' : '500'
    };
  }

  selectCampo(label, v, opts, onChange, disabled, ph) {
    return {
      isSelect: true, isBox: false, isInput: false, label: label, v: v, disabled: !!disabled,
      opts: [{ v: '', t: disabled ? (ph || 'Selecciona un modelo primero') : 'Selecciona…' }].concat(opts.map(x => ({ v: x, t: x }))),
      onChange: onChange,
      bc: disabled ? '#EAE8E2' : (v ? '#D9D6CE' : '#F0C9A6'),
      bg: disabled ? '#F4F3EF' : '#FFFFFF',
      fg: disabled ? '#B8B5AC' : '#1F1B16'
    };
  }

  wizardVals() {
    const st = this.state;
    const acento = this.props.acento || '#F58634';
    const pasos = this.pasos();
    const sec = this.secActual() || SECCIONES[0];
    const id = sec.id;
    const juridica = st.tipo === 'juridica';
    const pct = this.pctExpediente();

    const wzNav = pasos.map((s, i) => {
      const act = i === st.wstep;
      const ok = this.llena(s.id) && s.peso;
      return {
        nombre: s.nombre, label: s.corto, gkey: 'wznav-' + s.id,
        bc: act ? acento : (ok ? '#CFE0D3' : '#D9D6CE'),
        bg: act ? acento : (ok ? '#F4FAF5' : '#FFFFFF'),
        fg: act ? '#FFFFFF' : (ok ? '#2F7A3A' : '#8E8B82'),
        onClick: this.guard('wznav-' + s.id, () => this.setState({ wstep: i }))
      };
    });

    // recaudos
    const recaudos = this.recaudos().map((d, di) => {
      const s = this.docSt(d.id);
      const c = CLAS[d.clasEf];
      const cargado = s === 'cargado';
      const extra = d.id === 'islr' ? st.islrExtra : 0;
      const primero = di === 0;
      return {
        gkey: 'doc-' + d.id, upKey: primero ? 'wz-up-cedula' : ('up-' + d.id),
        nombre: d.nombre, ayuda: d.ayuda,
        clasLabel: c.label, clasBg: c.bg, clasFg: c.fg,
        estLabel: cargado ? 'Cargado' : 'Pendiente',
        estBg: cargado ? '#E4F0E6' : '#F4F3EF', estFg: cargado ? '#2F7A3A' : '#8E8B82',
        bc: cargado ? '#DCE9DE' : (d.clasEf === 'obligatorio' ? '#F2DFCB' : '#EAE8E2'),
        cargando: s === 'cargando', cargado: cargado,
        file: (st.docs[d.id] || {}).file, fecha: (st.docs[d.id] || {}).fecha,
        showIA: cargado && !d.noIA,
        showSubir: s === 'pendiente',
        plantilla: !!d.plantilla && s === 'pendiente',
        showMas: !!d.multi && cargado,
        showExtras: !!d.multi && extra > 0,
        extrasT: extra === 1 ? '1 ejercicio adicional cargado' : extra + ' ejercicios adicionales cargados',
        onSubir: this.guard(primero ? 'wz-up-cedula' : ('up-' + d.id), () => this.subir(d.id, d.file)),
        onQuitar: this.guard('quitar-' + d.id, () => this.quitar(d.id)),
        onPlantilla: this.guard('plantilla-' + d.id, () => this.nudge('Plantilla descargada: ' + d.file.replace('.pdf', '_plantilla.pdf'))),
        onMas: this.guard('mas-' + d.id, () => this.setState(s2 => ({ islrExtra: s2.islrExtra + 1 })))
      };
    });

    const obl = this.recaudos().filter(d => d.clasEf === 'obligatorio');
    const oblOk = obl.filter(d => this.docSt(d.id) === 'cargado').length;

    // bloques
    let bloques = [], nota = null;
    if (id === 'datos') bloques = BLOQUES.datos.map(b => ({ titulo: b.titulo, campos: b.campos.map(f => this.campo(f, true)) }));
    if (id === 'personal') bloques = (juridica ? BLOQUES_JUR.personal : BLOQUES.personal).map(b => ({ titulo: b.titulo, campos: b.campos.map(f => this.campo(f, !!st.llenos.personal)) }));
    if (id === 'conyuge') bloques = BLOQUES.conyuge.map(b => ({ titulo: b.titulo, campos: b.campos.map(f => this.campo(f, !!st.llenos.conyuge)) }));
    if (id === 'ubicacion') {
      const est = UBICACION.find(u => u.estado === st.ubic.estado);
      const ciu = est && est.ciudades.find(c => c.ciudad === st.ubic.ciudad);
      bloques = (juridica ? BLOQUES_JUR.ubicacion : BLOQUES.ubicacion).map(b => {
        if (b.cascada) return { titulo: b.titulo, campos: [
          this.selectCampo('Estado', st.ubic.estado, UBICACION.map(u => u.estado),
            (e) => this.setState({ ubic: { estado: e.target.value, ciudad: '', municipio: '' } })),
          this.selectCampo('Ciudad', st.ubic.ciudad, est ? est.ciudades.map(c => c.ciudad) : [],
            (e) => this.setState(s2 => ({ ubic: { estado: s2.ubic.estado, ciudad: e.target.value, municipio: '' } })), !est, 'Selecciona un estado primero'),
          this.selectCampo('Municipio', st.ubic.municipio, ciu ? ciu.municipios : [],
            (e) => this.setState(s2 => ({ ubic: { estado: s2.ubic.estado, ciudad: s2.ubic.ciudad, municipio: e.target.value } })), !ciu, 'Selecciona una ciudad primero')
        ] };
        return { titulo: b.titulo, campos: b.campos.map(f => this.campo(f, !!st.llenos.ubicacion)) };
      });
    }
    if (id === 'laboral' && juridica) {
      bloques = BLOQUES_JUR.laboral.map(b => ({ titulo: b.titulo, campos: b.campos.map(f => this.campo(f, !!st.llenos.laboral)) }));
    } else if (id === 'laboral' && st.laboralTipo) {
      const src = st.laboralTipo === 'dep' ? BLOQUES.laboralDep : BLOQUES.laboralInd;
      bloques = src.map(b => ({ titulo: b.titulo, campos: b.campos.map(f => this.campo(f, !!st.llenos.laboral)) }));
    }
    if (id === 'conyuge') nota = 'Si cambias el estado civil a soltero, divorciado o viudo, esta sección desaparece y los recaudos del cónyuge vuelven a «si aplica».';
    if (id === 'datos') nota = 'Si algo de esto está mal, avisa a tu administrador de usuarios: se corrige en la ficha del concesionario, no en la solicitud.';
    if (id === 'ubicacion' && juridica) nota = 'La condición de la sede es obligatoria: el analista la cruza con el recibo de servicio que cargaste en recaudos.';
    if (id === 'personal' && juridica) nota = 'La cédula y el RIF del representante legal van en recaudos. Aquí sólo se capturan sus datos.';

    // vehículo
    const marca = CATALOGO.find(c => c.marca === st.veh.marca);
    const modelo = marca && marca.modelos.find(m => m.modelo === st.veh.modelo);
    const vehCampos = [
      this.selectCampo('Marca', st.veh.marca, CATALOGO.map(c => c.marca),
        (e) => this.setState({ veh: { marca: e.target.value, modelo: '', anio: '', version: '' } })),
      this.selectCampo('Modelo', st.veh.modelo, marca ? marca.modelos.map(m => m.modelo) : [],
        (e) => this.setState(s2 => ({ veh: { marca: s2.veh.marca, modelo: e.target.value, anio: '', version: '' } })), !marca, 'Selecciona una marca primero'),
      this.selectCampo('Año', st.veh.anio, modelo ? modelo.anios : [],
        (e) => this.setState(s2 => ({ veh: Object.assign({}, s2.veh, { anio: e.target.value }) })), !modelo, 'Selecciona un modelo primero'),
      this.selectCampo('Versión', st.veh.version, modelo ? modelo.versiones : [],
        (e) => this.setState(s2 => ({ veh: Object.assign({}, s2.veh, { version: e.target.value }) })), !modelo, 'Selecciona un modelo primero')
    ];
    const precio = this.precio(), ini = this.inicial();
    const box = (shown, ok) => ({ shown: shown, bc: '#EAE8E2', bg: ok ? '#FAFAF8' : '#FFFFFF', fg: ok ? '#1F1B16' : '#C2BFB6' });
    const comCampos = [
      Object.assign({ label: 'Precio del vehículo' }, box(precio ? money(precio) : 'Sin capturar', !!precio)),
      Object.assign({ label: 'Inicial (35%)' }, box(precio ? money(ini) : 'Sin capturar', !!precio))
    ];

    // condiciones
    const monto = precio - ini;
    const condCampos = [
      Object.assign({ label: 'Modalidad' }, box('Cuotas fijas', true)),
      Object.assign({ label: 'Monto solicitado' }, box(precio ? money(monto) : 'Falta el vehículo', !!precio))
    ];
    const plazos = [12, 24, 36, 48].map(p => ({
      label: p + ' meses',
      bc: st.plazo === p ? acento : '#D9D6CE',
      bg: st.plazo === p ? acento : '#FFFFFF',
      fg: st.plazo === p ? '#FFFFFF' : '#6B6862',
      onClick: this.guard('plazo-' + p, () => this.setState({ plazo: p }))
    }));

    // ingresos
    const li = !!st.llenos.ingresos;
    const ti = INGRESOS.reduce((a, r) => a + r.v, 0), te = EGRESOS.reduce((a, r) => a + r.v, 0);
    const cuota = st.plazo ? monto / st.plazo : 0;

    // fiador
    const fiadores = st.fiadores.map((f, i) => ({
      titulo: st.fiadores.length > 1 ? ('Fiador ' + (i + 1)) : 'Datos del fiador',
      showQuitar: i > 0,
      onQuitar: this.guard('quitar-fiador', () => this.setState(s2 => ({ fiadores: s2.fiadores.filter((x, j) => j !== i) }))),
      campos: FIADOR_CAMPOS.map(c => ({
        label: c.label, ph: c.ph, v: f.datos[c.k] || '',
        onChange: (e) => {
          const val = e.target.value;
          this.setState(s2 => ({ fiadores: s2.fiadores.map((x, j) => j === i ? Object.assign({}, x, { datos: Object.assign({}, x.datos, { [c.k]: val }) }) : x) }));
        }
      }))
    }));

    // revisión
    const revision = pasos.filter(s => s.id !== 'revision').map(s => {
      const ok = this.llena(s.id);
      const req = !s.opcional;
      const mal = !ok && req;
      let sub;
      if (s.id === 'recaudos') sub = ok ? (oblOk + ' de ' + obl.length + ' recaudos obligatorios cargados') : ('Faltan ' + (obl.length - oblOk) + ' recaudos obligatorios');
      else if (ok) sub = 'Información completa';
      else if (s.opcional) sub = 'Sin llenar — no bloquea el envío';
      else sub = 'Faltan campos obligatorios de esta sección';
      return {
        nombre: s.nombre, sub: sub, icon: s.icon, completo: ok,
        bg: mal ? '#FBF1EF' : '#FFFFFF',
        bc: mal ? '#F2DBD6' : '#EAE8E2',
        ic: mal ? '#B23A2D' : (ok ? '#2F7A3A' : '#B8B5AC'),
        subFg: mal ? '#9B4034' : '#8E8B82',
        btn: ok ? 'EDITAR' : 'REVISAR',
        btnBc: mal ? '#E8C7C0' : '#D9D6CE',
        btnFg: mal ? '#B23A2D' : '#46413A',
        onClick: this.guard('rev-' + s.id, () => this.irA(s.id))
      };
    });

    const f = this.faltantes();
    const showFill = ['personal', 'conyuge', 'ubicacion', 'ingresos', 'vehiculo', 'condiciones', 'fiador'].indexOf(id) >= 0
      || (id === 'laboral' && (juridica || !!st.laboralTipo));

    return {
      isTipo: st.phase === 'tipo',
      isWizard: st.phase === 'wizard',
      showTopbar: st.phase === 'app' || st.phase === 'tipo' || st.phase === 'wizard' || st.phase === 'expediente',

      tnBc: st.tipo === 'natural' ? acento : '#EAE8E2', tnBg: st.tipo === 'natural' ? '#FFF4EA' : '#FFFFFF',
      tnIc: st.tipo === 'natural' ? acento : '#B8B5AC',
      tjBc: st.tipo === 'juridica' ? acento : '#EAE8E2', tjBg: st.tipo === 'juridica' ? '#FFF4EA' : '#FFFFFF',
      tjIc: st.tipo === 'juridica' ? acento : '#B8B5AC',
      onTipoNatural: this.guard('tipo-natural', () => this.setState({ tipo: 'natural' })),
      onTipoJuridica: this.guard('tipo-juridica', () => this.setState({ tipo: 'juridica' })),
      onTipoAtras: this.guard('tipo-atras', () => this.setState({ phase: 'app' })),
      onTipoSiguiente: this.guard('tipo-siguiente', () => this.setState(s2 => ({ phase: 'wizard', tipo: s2.tipo || s2.perfil, wstep: 0 })), true),

      wzPasoLabel: 'Paso ' + (st.wstep + 1) + ' de ' + pasos.length,
      wzPctLabel: pct + '% del expediente completado',
      wzPctW: pct + '%',
      wzNav: wzNav,
      wzTitulo: sec.titulo,
      wzSub: sec.sub,
      wzJuridica: false,
      wzShowFill: showFill,
      wzNota: nota,
      wzShowNext: id !== 'revision',
      wzShowEnviar: id === 'revision',
      onWzFill: this.guard('wz-fill', this.fill),
      onWzNext: this.guard('wz-next', () => this.setState(s2 => ({ wstep: Math.min(s2.wstep + 1, this.pasos().length - 1) })), true),
      onWzAtras: this.guard('wz-atras', () => this.setState(s2 => ({ wstep: Math.max(0, s2.wstep - 1) }))),
      onWzSalir: this.guard('wz-salir', () => this.setState({ phase: 'app' })),
      onWzBorrador: this.guard('wz-borrador', () => this.nudge('Guardado como borrador. Puedes retomarlo desde el listado.')),
      onWzEnviar: this.guard('wz-enviar', this.enviar, true),

      wIsRecaudos: id === 'recaudos',
      wIsBloques: bloques.length > 0,
      wIsLaboral: id === 'laboral' && !juridica,
      wIsIngresos: id === 'ingresos',
      wIsCredito: id === 'credito',
      wIsFiador: id === 'fiador',
      wIsVehiculo: id === 'vehiculo',
      wIsCondiciones: id === 'condiciones',
      wIsRevision: id === 'revision',

      recaudos: recaudos,
      recaudosResumen: oblOk + ' de ' + obl.length + ' recaudos obligatorios cargados. Los opcionales y los de «si aplica» no bloquean el envío.',
      onCargarEjemplo: this.guard('wz-bulk', this.bulk),
      otros: st.otros.map((o, i) => ({
        titulo: o.titulo, file: o.file,
        onTitulo: (e) => { const v = e.target.value; this.setState(s2 => ({ otros: s2.otros.map((x, j) => j === i ? Object.assign({}, x, { titulo: v }) : x) })); },
        onQuitar: this.guard('otro-quitar', () => this.setState(s2 => ({ otros: s2.otros.filter((x, j) => j !== i) })))
      })),
      onOtroAdd: this.guard('otro-add', () => this.setState(s2 => ({ otros: s2.otros.concat([{ titulo: '', file: 'documento_' + (s2.otros.length + 1) + '.pdf' }]) }))),
      postAbierto: st.postAbierto,
      postToggleT: st.postAbierto ? 'Ocultar' : 'Ver los 3',
      postDocs: POST_DOCS,
      onTogglePost: this.guard('post-toggle', () => this.setState(s2 => ({ postAbierto: !s2.postAbierto }))),

      bloques: bloques,
      depBc: st.laboralTipo === 'dep' ? acento : '#EAE8E2', depBg: st.laboralTipo === 'dep' ? '#FFF4EA' : '#FFFFFF',
      indBc: st.laboralTipo === 'ind' ? acento : '#EAE8E2', indBg: st.laboralTipo === 'ind' ? '#FFF4EA' : '#FFFFFF',
      onDependiente: this.guard('wz-dependiente', () => this.setState({ laboralTipo: 'dep' })),
      onIndependiente: this.guard('wz-independiente', () => this.setState({ laboralTipo: 'ind' })),

      ingresos: INGRESOS.map(r => ({ label: r.label, v: li ? money(r.v) : '—' })),
      egresos: EGRESOS.map(r => ({ label: r.label, v: li ? money(r.v) : '—' })),
      totalIngresos: li ? money(ti) : '—',
      totalEgresos: li ? money(te) : '—',
      capital: li ? money(ti - te) : '—',
      recomendacion: li
        ? ('Con un capital disponible de ' + money(ti - te) + ', la cuota estimada a ' + (st.plazo || 36) + ' meses (' + money((monto || 16185) / (st.plazo || 36)) + ') representa ' + Math.round(((monto || 16185) / (st.plazo || 36)) / (ti - te) * 100) + '% del capital. PIVCA recomienda no exceder 60%.')
        : 'Declara los ingresos y egresos para que el portal calcule el capital disponible y estime la cuota.',

      ops: st.ops, cuentas: st.cuentas,
      opsVacio: st.ops.length === 0, cuentasVacio: st.cuentas.length === 0,
      sinCreditos: st.sinCreditos,
      scBc: st.sinCreditos ? acento : '#D9D6CE', scBg: st.sinCreditos ? acento : '#FFFFFF',
      onSinCreditos: this.guard('wz-sincreditos', () => this.setState(s2 => ({ sinCreditos: !s2.sinCreditos }))),
      onAddOp: this.guard('add-op', () => this.setState(s2 => ({ ops: s2.ops.concat([{ inst: 'BANCO MERCANTIL', tipo: 'Tarjeta', saldo: money(1200), cuota: money(85) }]), sinCreditos: false }))),
      onAddCuenta: this.guard('add-cuenta', () => this.setState(s2 => ({ cuentas: s2.cuentas.concat([{ banco: 'BANESCO', tipo: 'Corriente', num: '0134-••••-4471' }]) }))),

      fiadores: fiadores,
      onAddFiador: this.guard('add-fiador', () => this.setState(s2 => ({ fiadores: s2.fiadores.concat([{ n: s2.fiadores.length + 1, datos: {} }]) }))),

      vehCampos: vehCampos, comCampos: comCampos,
      pfBc: st.proforma ? '#CFE0D3' : '#D9D6CE', pfBg: st.proforma ? '#F4FAF5' : '#FAFAF8',
      pfIcon: st.proforma ? 'check' : 'upload', pfIc: st.proforma ? '#2F7A3A' : '#B8B5AC',
      pfTitulo: st.proforma ? 'proforma_vehiculo.pdf' : 'Arrastra la factura proforma',
      pfSub: st.proforma ? 'Cargada el ' + HOY : 'O pulsa para seleccionarla. Puedes enviar la solicitud sin ella.',
      onProforma: this.guard('proforma', () => this.setState(s2 => ({ proforma: !s2.proforma }))),

      condCampos: condCampos, plazos: plazos,
      destino: st.llenos.condiciones ? 'Adquisición de vehículo nuevo para uso familiar' : 'Sin capturar',
      destBc: '#EAE8E2', destBg: st.llenos.condiciones ? '#FAFAF8' : '#FFFFFF', destFg: st.llenos.condiciones ? '#1F1B16' : '#C2BFB6',
      garantias: st.llenos.condiciones ? 'Reserva de dominio sobre el vehículo financiado, más fianza personal del fiador declarado. Póliza de vehículo y póliza de vida cedidas a favor de PIVCA.' : 'Sin capturar',
      garBc: '#EAE8E2', garBg: st.llenos.condiciones ? '#FAFAF8' : '#FFFFFF', garFg: st.llenos.condiciones ? '#1F1B16' : '#C2BFB6',

      revision: revision,

      showModal: !!st.modal,
      modalFaltan: st.modal === 'faltan',
      modalOk: st.modal === 'ok',
      faltan: f.dur, luego: f.luego, hayLuego: f.luego.length > 0,
      okId: 'ID-001256',
      onModalCerrar: this.guard('modal-cerrar', () => this.setState({ modal: null })),
      onModalResolver: this.guard('modal-resolver', () => {
        const primera = this.pasos().find(s => !s.opcional && s.peso && !this.llena(s.id));
        this.irA(primera ? primera.id : 'recaudos');
      }),
      onModalListado: this.guard('modal-listado', () => this.setState({ modal: null, phase: 'app', filtro: 'todos' }), true)
    };
  }

  renderVals() {
    const st = this.state;
    const acento = this.props.acento || '#F58634';
    const paso = this.step();
    const total = this.guion().length;
    const hechos = Math.min(st.paso, total);
    const wz = Object.assign({}, this.wizardVals(), this.expVals());

    const perfiles = PERFILES.map(p => {
      const sel = st.perfil === p.id;
      return {
        label: p.label, desc: p.desc,
        bc: sel ? acento : '#EAE8E2',
        bg: sel ? '#FFF4EA' : '#FFFFFF',
        onClick: this.guard('scn-perfil', () => this.setState({ perfil: p.id }))
      };
    });

    const desenlaces = DESENLACES.map(d => {
      const sel = st.desenlace === d.id;
      return {
        label: d.label, desc: d.desc,
        bc: sel ? acento : '#EAE8E2',
        bg: sel ? '#FFF4EA' : '#FFFFFF',
        onClick: this.guard('scn-desenlace', () => this.setState({ desenlace: d.id }))
      };
    });

    const filtros = FILTROS.map(f => {
      const act = st.filtro === f.id;
      return {
        label: f.label,
        gkey: f.id === 'borrador' ? 'list-filters' : ('filtro-' + f.id),
        bc: act ? acento : '#D9D6CE',
        bg: act ? acento : '#FFFFFF',
        fg: act ? '#FFFFFF' : '#6B6862',
        onClick: this.guard(f.id === 'borrador' ? 'list-filters' : ('filtro-' + f.id),
          () => this.setState({ filtro: f.id, page: 0 }))
      };
    });

    const todas = this.filtradas();
    const pages = Math.max(1, Math.ceil(todas.length / PER_PAGE));
    const page = Math.min(st.page, pages - 1);
    const slice = todas.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

    const visibles = slice.map(s => {
      const b = BADGE[s.estado] || BADGE['BORRADOR'];
      return {
        id: s.id, estado: s.estado, edad: s.edad,
        nombre: s.nombre || 'Sin nombre',
        nombreFg: s.nombre ? '#1F1B16' : '#B8B5AC',
        vehiculo: s.vehiculo || 'Vehículo no especificado',
        badgeBg: b.bg, badgeFg: b.fg,
        bg: s.id === st.sel ? '#FDF6EE' : '#FFFFFF',
        bl: s.id === st.sel ? (this.props.acento || '#F58634') : 'transparent',
        gkey: s.nueva ? 'card-nueva' : ('card-' + s.id),
        showPct: s.estado === 'BORRADOR',
        pctW: (s.pct || 0) + '%',
        pctT: (s.pct || 0) + '%',
        onClick: s.nueva
          ? this.guard('card-nueva', () => this.setState({ phase: 'done' }), true)
          : (s.exp
            ? this.guard('card-' + s.id, () => this.setState({ sel: s.id, expCaso: s.expCaso, expDocPage: 0, expFiltro: 'todos' }), true)
            : this.guard('card-' + s.id, null))
      };
    });

    const desLabel = (DESENLACES.find(d => d.id === st.desenlace) || {}).label || '';
    const perLabel = (PERFILES.find(p => p.id === st.perfil) || {}).label || '';

    const tip = st.tip;
    const tipStyle = tip ? {
      position: 'fixed', zIndex: 220, top: tip.top + 'px', left: tip.left + 'px', width: tip.w + 'px',
      animation: 'pvTipIn 220ms cubic-bezier(0.22,1,0.36,1) both'
    } : null;
    const ARROW = {
      below: { top: '-5px', left: '22px' },
      above: { top: 'calc(100% - 6px)', left: '22px' },
      right: { top: (tip ? tip.cy : 0) + 'px', left: '-5px' },
      left:  { top: (tip ? tip.cy : 0) + 'px', left: 'calc(100% - 6px)' }
    };
    const flecha = ARROW[tip ? tip.mode : 'below'] || ARROW.below;

    return Object.assign({}, wz, {
      showBanner: this.props.bannerDemo !== false,
      libre: st.libre,
      libreLabel: st.libre ? 'Seguir la guía' : 'Explorar libremente',
      libreTitulo: st.libre
        ? 'Vuelve al recorrido guiado, en el paso donde lo dejaste'
        : 'Apaga la guía y deja todos los controles abiertos',
      showDim: !!paso && this.props.atenuarFondo !== false,
      isScenario: st.phase === 'scenario',
      isLogin: st.phase === 'login',
      isApp: st.phase === 'app',
      isDone: st.phase === 'done',

      perfiles, desenlaces, filtros, visibles,
      vacio: visibles.length === 0,
      rango: todas.length ? ((page * PER_PAGE + 1) + '–' + (page * PER_PAGE + slice.length) + ' de ' + todas.length) : '0 de 0',
      resumenEscenario: perLabel + ' · ' + desLabel,

      email: st.email,
      pass: st.pass,
      passType: st.verPass ? 'text' : 'password',
      ojoIcono: st.verPass ? 'eye-off' : 'eye',
      ojoTitulo: st.verPass ? 'Ocultar contraseña' : 'Mostrar contraseña',
      recordar: st.recordar,
      showLoginErr: !!st.loginErr,
      loginErr: st.loginErr,
      loginBorde: st.loginErr ? '#B23A2D' : '#D9D6CE',
      loginFondo: st.loginErr ? '#FDF5F4' : '#FAFAF8',
      loginLabel: st.entrando ? 'Entrando…' : 'Iniciar sesión →',
      loginOpacidad: st.entrando ? '0.75' : '1',
      inicial: ((st.email || 'a').trim().charAt(0) || 'a').toUpperCase(),
      usuarioCorreo: st.email || CRED.email,
      usuarioNombre: USUARIO,
      showMenuUsuario: st.menuUsuario,
      query: st.query,

      showGuion: !!paso,
      pasoLabel: paso ? ('Paso ' + (st.paso + 1) + ' de ' + total) : '',
      pasoTitulo: paso ? paso.titulo : '',
      guionW: Math.round((hechos / total) * 100) + '%',

      showTip: !!paso && !!tipStyle,
      tipStyle: tipStyle,
      tipText: paso ? paso.tip : '',
      tipKicker: paso ? paso.kicker : '',
      arrowTop: flecha.top,
      arrowLeft: flecha.left,

      showToast: !!st.toast,
      toastText: st.toast || '',

      cierreTexto: st.desenlace === 'aprobada'
        ? 'El expediente de Luis Alberto Pernía quedó completo y listo para liquidar: los tres documentos de la Lista 2 cargados y los datos registrales del vehículo capturados. La solicitud se mantiene en APROBADA — cargar la Lista 2 no cambia su estado; lo que desbloquea es la liquidación del financiamiento.'
        : st.desenlace === 'negada'
        ? 'La solicitud de Yohanna Rivas Blanco quedó rechazada y su expediente sigue consultable, pero cerrado a cambios: no se reabre ni admite cargas. Si el cliente quiere volver a intentarlo, se carga una solicitud nueva desde cero. El motivo de la decisión lo comunica tu ejecutivo de PIVCA; el portal no lo publica.'
        : st.desenlace === 'devuelto'
        ? 'Resolviste las dos situaciones del expediente de José Gregorio Mendoza: sustituiste el recaudo que el analista devolvió y cargaste el que solicitó por primera vez. Los pendientes quedaron en cero y la solicitud sigue en revisión del analista de crédito.'
        : 'Montaste un expediente completo de ' + (st.tipo === 'juridica' ? 'persona jurídica' : 'persona natural') + ' y lo enviaste al core de PIVCA. Quedó en revisión del analista de productos. Practica los otros tres desenlaces —recaudo devuelto, rechazada y aprobada— desde «Cambiar escenario».',
      practicado: st.desenlace === 'aprobada' ? [
        { t: 'Abriste una solicitud aprobada, con el stepper completo hasta APROBADO' },
        { t: 'Viste la Lista 2 habilitada: antes era informativa, ahora se puede cargar' },
        { t: 'Cargaste factura, certificado de origen y contrato firmado' },
        { t: 'Aprendiste el circuito del contrato: PIVCA lo envía por correo, tú lo subes firmado' },
        { t: 'Capturaste los datos registrales del vehículo: seriales, placa, peso y capacidad' },
        { t: 'Comprobaste que la Lista 2 no bloquea el envío: bloquea la liquidación' }
      ] : st.desenlace === 'negada' ? [
        { t: 'Identificaste la solicitud rechazada por su badge rojo en el listado' },
        { t: 'Leíste el resultado y la fecha de la decisión en la cabecera del expediente' },
        { t: 'Comprobaste que el expediente sigue consultable completo' },
        { t: 'Viste que ningún recaudo admite carga ni sustitución' },
        { t: 'Sabes qué sigue: solicitud nueva si el cliente insiste, y el motivo por tu ejecutivo' }
      ] : st.desenlace === 'devuelto' ? [
        { t: 'Filtraste por «Docs. pendientes» para encontrar la solicitud con observaciones' },
        { t: 'Leíste el motivo del analista en la tarjeta del recaudo devuelto' },
        { t: 'Sustituiste el balance personal: la versión anterior quedó consultable' },
        { t: 'Cargaste los seis recaudos del fiador solicitado y llenaste sus datos' },
        { t: 'Dejaste el panel de pendientes en cero y con la solicitud en el mismo estatus' },
        { t: 'Comprobaste que cargar o sustituir no cambia el estatus de la solicitud' }
      ] : [
        { t: 'Entraste al Portal Referido y filtraste el listado por estatus' },
        { t: 'Cargaste los recaudos obligatorios y viste qué pasa con los de «si aplica»' },
        st.tipo === 'juridica'
          ? { t: 'Comprobaste que en persona jurídica el fiador y sus seis recaudos son obligatorios' }
          : { t: 'Declaraste estado civil casado y con eso se activó la sección del cónyuge' },
        st.tipo === 'juridica'
          ? { t: 'Llenaste datos de la empresa, representante legal, sede, actividad e ingresos' }
          : { t: 'Llenaste información personal, ubicación, laboral, ingresos y fiador' },
        { t: 'Elegiste el vehículo del catálogo en cascada y definiste plazo a 36 meses' },
        { t: 'Revisaste el expediente y lo enviaste: quedó en REVISIÓN ANALISTA DE PRODUCTOS' }
      ],

      onCambiar: () => this.reset(false),
      onReiniciar: () => this.reset(false),
      onRepetir: () => this.reset(true),
      onDonde: this.onDonde,
      onLibre: () => this.setState(s2 => ({ libre: !s2.libre, toast: null })),
      onQuery: (e) => this.setState({ query: e.target.value, page: 0 }),
      onOjo: this.guard('login-ojo', () => this.setState({ verPass: !st.verPass })),
      onOlvide: this.guard('login-olvide', () => this.nudge(
        'En el portal real esto abre la recuperación de Keycloak. Aquí la clave es la que te entregaron.')),
      onEmail: (e) => this.setState({ email: e.target.value, loginErr: '' }),
      onPass: (e) => this.setState({ pass: e.target.value, loginErr: '' }),
      onRecordar: (e) => this.setState({ recordar: !!e.target.checked }),
      onLoginKey: (e) => { if (e.key === 'Enter') this.guard('login-submit', () => this.entrar(), true)(); },
      onSalir: this.salir,
      onComenzar: this.guard('scn-comenzar', () => {
        escribirHash(st.perfil, st.desenlace);
        this.setState({ phase: 'login' });
      }, true),
      onLogin: this.guard('login-submit', () => this.entrar(), true),
      onNueva: this.guard('list-nueva', () => this.setState(s2 => ({ phase: 'tipo', tipo: s2.perfil })), true),
      onNavSolicitudes: this.guard('nav-solicitudes', null),
      onNavUsuarios: this.guard('nav-usuarios', null),
      onCampana: this.guard('nav-campana', null),
      onAvatar: this.guard('nav-avatar', () => this.setState(s2 => ({ menuUsuario: !s2.menuUsuario }))),
      onPrev: this.guard('pag-prev', () => this.setState({ page: Math.max(0, page - 1) })),
      onNext: this.guard('pag-next', () => this.setState({ page: Math.min(pages - 1, page + 1) }))
    });
  }
}

