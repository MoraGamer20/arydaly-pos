import {
  BenefitItem,
  FeatureItem,
  PricingPlan,
  TestimonialItem,
  IntegrationItem,
  HowItWorksStep,
  InventoryDemoProduct,
  SaleTransaction,
} from '../types';

export const HERO_DATA = {
  badge: 'Nueva Versión 4.5 • Más rápida y potente',
  titleHighlight: 'El punto de venta',
  titleSuffix: 'que hace crecer tu negocio',
  subtitle:
    'Administra tus ventas, inventario, clientes y facturación desde un solo lugar. Rápido en mostrador, fácil para tus empleados y con el control total de tus ganancias.',
  ctaPrimary: 'Probar gratis por 30 días',
  ctaSecondary: 'Ver cómo funciona',
  trustMetrics: [
    { label: 'Negocios activos', value: '+18,000' },
    { label: 'Ventas procesadas/mes', value: '$45M+' },
    { label: 'Tiempo prom. por ticket', value: '< 3 seg' },
    { label: 'Satisfacción', value: '4.9 / 5' },
  ],
};

export const TRUST_BAR_ITEMS = [
  {
    title: 'Ventas ultra rápidas',
    description: 'Cobra en segundos sin filas ni demoras en tu mostrador.',
    iconName: 'Zap',
  },
  {
    title: 'Inventario en tiempo real',
    description: 'Monitorea existencias y evita desabastos o robo hormiga.',
    iconName: 'Boxes',
  },
  {
    title: 'Reportes y finanzas claras',
    description: 'Conoce tus utilidades netas diarias y ticket promedio.',
    iconName: 'TrendingUp',
  },
  {
    title: 'Facturación CFDI 4.0',
    description: 'Genera comprobantes fiscales válidos con un solo clic.',
    iconName: 'FileCheck',
  },
];

export const BENEFITS: BenefitItem[] = [
  {
    id: 'pos',
    title: 'Punto de venta ágil',
    description:
      'Realiza cobros en segundos con teclado, lector de código de barras o pantalla táctil. Soporta pagos mixtos, vales y transferencias.',
    iconName: 'ShoppingCart',
    badge: 'Cobro rápido',
  },
  {
    id: 'inventory',
    title: 'Control de inventario',
    description:
      'Registra entradas, salidas, mermas y existencias exactas. Recibe alertas inteligentes cuando tus productos clave estén por agotarse.',
    iconName: 'Package',
    badge: 'Stock en vivo',
  },
  {
    id: 'customers',
    title: 'Clientes y crédito',
    description:
      'Lleva el historial de compras de tus clientes frecuentes, administra límites de crédito seguro y envía recordatorios de cobro.',
    iconName: 'Users',
    badge: 'Fidelización',
  },
  {
    id: 'reports',
    title: 'Reportes y métricas',
    description:
      'Consulta ventas del día, cortes de caja X y Z, margen de ganancia real y los productos más vendidos con gráficas claras.',
    iconName: 'BarChart3',
    badge: 'Toma de decisiones',
  },
  {
    id: 'billing',
    title: 'Facturación electrónica',
    description:
      'Emite facturas fiscales válidas (CFDI 4.0) en cuestión de segundos. Envía el PDF y XML directamente por correo o WhatsApp.',
    iconName: 'FileText',
    badge: 'Fiscal 100%',
  },
  {
    id: 'staff',
    title: 'Usuarios y empleados',
    description:
      'Define roles y permisos seguros para cajeros, encargados y administradores. Evita modificaciones no autorizadas y audita cada acción.',
    iconName: 'ShieldCheck',
    badge: 'Seguridad total',
  },
];

export const FEATURES: FeatureItem[] = [
  {
    id: 'fast-sales',
    number: '01',
    title: 'Ventas rápidas en mostrador',
    subtitle: 'Menos filas, clientes más satisfechos',
    description:
      'Diseñado para la velocidad. Busca productos por código de barras, nombre o categorías visuales. Aplica descuentos autorizados y cobra en menos de 3 segundos.',
    bullets: [
      'Búsqueda instantánea con teclado o lector láser',
      'Cobro múltiple: efectivo, tarjeta, transferencia y vales',
      'Manejo de tickets pendientes (apartados o clientes en espera)',
      'Impresión automática de tickets de 58mm y 80mm',
    ],
    iconName: 'Zap',
    previewType: 'sales',
  },
  {
    id: 'smart-inventory',
    number: '02',
    title: 'Control total de existencias y mermas',
    subtitle: 'Adiós a las pérdidas y al robo hormiga',
    description:
      'Cada venta descuenta automáticamente del inventario. Conoce el costo exacto de tus mercancías, márgenes de ganancia y fechas de vencimiento.',
    bullets: [
      'Alertas automáticas de productos con stock bajo o crítico',
      'Importación y exportación masiva desde archivos Excel',
      'Manejo de productos a granel con básculas electrónicas',
      'Auditorías rápidas e historial de entradas y salidas por cajero',
    ],
    iconName: 'PackageCheck',
    previewType: 'inventory',
  },
  {
    id: 'electronic-billing',
    number: '03',
    title: 'Facturación electrónica sin complicaciones',
    subtitle: 'Comprobantes fiscales emitidos en un par de clics',
    description:
      'Convierte cualquier ticket en factura en segundos o permite que tus clientes facturen desde su casa mediante un código en el ticket.',
    bullets: [
      'Cumplimiento con las normativas fiscales vigentes (CFDI 4.0)',
      'Catálogo de claves de productos y unidades del SAT precargado',
      'Envío automático de archivos PDF y XML por correo electrónico',
      'Cancelaciones y complementos de pago con verificación oficial',
    ],
    iconName: 'Receipt',
    previewType: 'billing',
  },
  {
    id: 'financial-reports',
    number: '04',
    title: 'Reportes de ventas y utilidades netas',
    subtitle: 'La claridad que necesitas para tomar mejores decisiones',
    description:
      'Visualiza cuánto vendiste hoy, cuánto te costó la mercancía y cuál es tu ganancia real en el bolsillo tras descontar gastos operativos.',
    bullets: [
      'Cortes de caja X (parcial) y Z (cierre final de turno) con balance de efectivo',
      'Ranking de los 10 productos más vendidos y los más rentables',
      'Comparativa de ventas por día, semana, mes o temporada',
      'Gráficas interactivas exportables a Excel y formato PDF para tu contador',
    ],
    iconName: 'TrendingUp',
    previewType: 'reports',
  },
  {
    id: 'customers-credit',
    number: '05',
    title: 'Gestión de clientes y cuentas por cobrar',
    subtitle: 'Ofrece fiado seguro y fideliza a tus compradores',
    description:
      'Registra a tus clientes frecuentes con sus datos fiscales, número de teléfono y administra ventas a crédito con límites personalizados.',
    bullets: [
      'Historial completo de compras por cliente',
      'Control de cuentas por cobrar con fechas límite de abono',
      'Impresión de estado de cuenta y recibo de abono en ticket',
      'Precios preferenciales o descuentos por mayoreo a clientes VIP',
    ],
    iconName: 'Users',
    previewType: 'sales',
  },
  {
    id: 'employee-control',
    number: '06',
    title: 'Control de cajeros y auditoría de turnos',
    subtitle: 'Seguridad y tranquilidad para el dueño del negocio',
    description:
      'Asigna un usuario individual a cada empleado con una contraseña o huella digital. Tú decides qué puede ver, modificar o eliminar cada quien.',
    bullets: [
      'Permisos restringidos para cancelar ventas, aplicar descuentos o abrir cajón',
      'Fondo de caja inicial y arqueo sorpresa en cualquier momento',
      'Registro de bitácora con hora exacta de cada movimiento sensible',
      'Cálculo de comisiones por venta por cada colaborador',
    ],
    iconName: 'UserCheck',
    previewType: 'employees',
  },
];

export const INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'cards',
    category: 'Cobros electrónicos',
    title: 'Terminales bancarias y cobro con tarjeta',
    description: 'Acepta tarjetas de débito, crédito y contactless mediante terminales y pasarelas estándar.',
    iconName: 'CreditCard',
    compatibility: 'Mercado Pago, Clip, BBVA, Santander, Stripe y más',
  },
  {
    id: 'printers',
    category: 'Hardware POS',
    title: 'Impresoras térmicas de tickets',
    description: 'Impresión instantánea en formatos estándar de 58mm y 80mm con corte de papel automático.',
    iconName: 'Printer',
    compatibility: 'Epson, Bixolon, Xprinter, Star Micronics (USB, Red y Bluetooth)',
  },
  {
    id: 'scanners',
    category: 'Lectores ópticos',
    title: 'Lectores de código de barras 1D y 2D',
    description: 'Escanea productos al instante con pistolas láser omnidireccionales, códigos QR y pantallas móviles.',
    iconName: 'ScanBarcode',
    compatibility: 'Zebra, Honeywell, Datalogic y lectores USB Plug & Play',
  },
  {
    id: 'scales',
    category: 'Pesaje en caja',
    title: 'Básculas electrónicas para granel',
    description: 'Calcula el precio exacto al pesar carnes, frutas, verduras o semillas directamente en mostrador.',
    iconName: 'Scale',
    compatibility: 'Torrey, Rhino, Dibal, Systel vía puerto serie/USB',
  },
  {
    id: 'cash-drawers',
    category: 'Seguridad física',
    title: 'Cajones de dinero automáticos',
    description: 'Apertura automática con cerradura de seguridad conectada a la impresora o puerto RJ11.',
    iconName: 'Lock',
    compatibility: 'Cajones metálicos estándar con apertura por pulso eléctrico',
  },
  {
    id: 'exports',
    category: 'Contabilidad',
    title: 'Exportación a hojas de cálculo y sistemas contables',
    description: 'Descarga reportes de ventas, inventarios y movimientos en formatos universales.',
    iconName: 'FileSpreadsheet',
    compatibility: 'Excel (.xlsx), CSV, PDF y software contable común',
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Regístrate en minutos',
    subtitle: 'Comienza sin tarjeta de crédito',
    description:
      'Crea tu cuenta comercial en menos de 2 minutos. Accede desde tu computadora de escritorio, laptop o navegador web.',
    duration: '2 minutos',
    iconName: 'UserPlus',
  },
  {
    step: 2,
    title: 'Configura tu negocio',
    subtitle: 'Carga tus productos fácilmente',
    description:
      'Importa tu catálogo desde un archivo Excel o usa nuestro lector de código de barras. Personaliza tu ticket con tu logo y datos.',
    duration: '10 minutos',
    iconName: 'Settings',
  },
  {
    step: 3,
    title: 'Comienza a vender',
    subtitle: 'Atiende a tus clientes con rapidez',
    description:
      'Realiza tu primer cobro en mostrador, imprime el comprobante y monitorea tus existencias y ganancias en tiempo real.',
    duration: 'Inmediato',
    iconName: 'CheckCircle2',
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Plan Inicial',
    tagline: 'Ideal para pequeños emprendimientos y tienditas que inician',
    priceMonthly: 0,
    priceAnnualMonthly: 0,
    buttonText: 'Comenzar gratis',
    features: [
      'Hasta 150 productos en catálogo',
      'Punto de venta y cobro rápido',
      'Gestión de clientes básica',
      'Cortes de caja diarios',
      'Tickets en pantalla e impresora',
      'Actualizaciones automáticas',
    ],
    notIncluded: [
      'Facturación electrónica ilimitada',
      'Control de múltiples empleados con roles',
      'Reportes avanzados de utilidades',
      'Soporte telefónico prioritario',
    ],
  },
  {
    id: 'pro',
    name: 'Plan Profesional',
    tagline: 'Para negocios en crecimiento que buscan control total',
    priceMonthly: 349,
    priceAnnualMonthly: 279,
    popular: true,
    buttonText: 'Elegir plan Profesional',
    features: [
      'Productos y ventas ilimitadas',
      'Control de inventario avanzado con alertas',
      'Facturación electrónica CFDI 4.0 incluida',
      'Hasta 5 usuarios cajeros con permisos',
      'Reportes de utilidades y gráficas financieras',
      'Ventas a crédito y estados de cuenta',
      'Conexión con básculas y lectores láser',
      'Soporte por WhatsApp y chat prioritario',
    ],
  },
  {
    id: 'business',
    name: 'Plan Negocio',
    tagline: 'Para comercios consolidados y múltiples cajas de cobro',
    priceMonthly: 649,
    priceAnnualMonthly: 519,
    buttonText: 'Elegir plan Negocio',
    features: [
      'Todo lo incluido en el Plan Profesional',
      'Usuarios y cajeros ilimitados',
      'Múltiples cajas de cobro simultáneas',
      'Facturación masiva y timbres ilimitados',
      'Reportes exportables para contabilidad',
      'Auditoría avanzada de movimientos sensibles',
      'Copia de seguridad automática en la nube',
      'Soporte telefónico 24/7 y capacitación personalizada',
    ],
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Carlos Méndez',
    role: 'Dueño y Administrador',
    businessName: 'Minisuper La Bendición',
    businessType: 'Abarrotes y Minisuper',
    city: 'Puebla, México',
    quote:
      'Antes tardábamos hasta 2 horas haciendo cuentas al final del día y siempre había diferencias en el dinero. Con VentaPro el corte de caja toma 3 minutos y sabemos exactamente cuánta ganancia dejó el día.',
    metricHighlight: 'Corte de caja en solo 3 minutos',
    stars: 5,
    avatarColor: 'bg-blue-600',
    initials: 'CM',
  },
  {
    id: 't2',
    name: 'Lic. Patricia Morales',
    role: 'Directora Operativa',
    businessName: 'Farmacia San Judas Tadeo',
    businessType: 'Farmacia y Cuidado Personal',
    city: 'Guadalajara, México',
    quote:
      'El control de caducidades y el aviso de stock bajo nos salvó de perder miles de pesos en medicamentos. Además la facturación electrónica en mostrador es tan rápida que los clientes quedan maravillados.',
    metricHighlight: 'Cero pérdidas por productos caducos',
    stars: 5,
    avatarColor: 'bg-emerald-600',
    initials: 'PM',
  },
  {
    id: 't3',
    name: 'Ing. Roberto Silva',
    role: 'Gerente General',
    businessName: 'Ferretería & Materiales El Sol',
    businessType: 'Ferretería y Construcción',
    city: 'Monterrey, México',
    quote:
      'Manejamos más de 4,000 productos diferentes y granel como tornillos y cemento. La compatibilidad con la báscula y el lector láser hizo que nuestras filas de cobro en horas pico se redujeran un 65%.',
    metricHighlight: '-65% en tiempo de fila en caja',
    stars: 5,
    avatarColor: 'bg-amber-600',
    initials: 'RS',
  },
  {
    id: 't4',
    name: 'Valeria Domínguez',
    role: 'Fundadora',
    businessName: 'Boutique & Calzado Aluna',
    businessType: 'Moda y Ropa',
    city: 'Ciudad de México',
    quote:
      'Buscaba un sistema que no pareciera de los años 90. VentaPro es súper moderno, mis vendedoras aprendieron a usarlo en 15 minutos y desde mi celular puedo ver las ventas en tiempo real sin estar en la tienda.',
    metricHighlight: 'Capacitación en solo 15 minutos',
    stars: 5,
    avatarColor: 'bg-purple-600',
    initials: 'VD',
  },
];

export const DEMO_INVENTORY_PRODUCTS: InventoryDemoProduct[] = [
  {
    id: 'prod-1',
    barcode: '7501055312345',
    name: 'Refresco Cola Original 600ml',
    category: 'Bebidas',
    stock: 48,
    minStock: 15,
    cost: 11.5,
    price: 18.0,
    status: 'optimal',
  },
  {
    id: 'prod-2',
    barcode: '7501000142857',
    name: 'Leche Entera Ultrapasteurizada 1L',
    category: 'Lácteos',
    stock: 6,
    minStock: 12,
    cost: 19.8,
    price: 26.5,
    status: 'warning',
  },
  {
    id: 'prod-3',
    barcode: '7501030495821',
    name: 'Aceite Vegetal Comestible 800ml',
    category: 'Abarrotes',
    stock: 3,
    minStock: 10,
    cost: 32.0,
    price: 44.0,
    status: 'critical',
  },
  {
    id: 'prod-4',
    barcode: '7501020304050',
    name: 'Pan de Caja Blanco Tradicional 680g',
    category: 'Panadería',
    stock: 22,
    minStock: 8,
    cost: 31.0,
    price: 43.5,
    status: 'optimal',
  },
  {
    id: 'prod-5',
    barcode: '7501077712398',
    name: 'Café Tostado y Molido Gourmet 400g',
    category: 'Abarrotes',
    stock: 4,
    minStock: 8,
    cost: 65.0,
    price: 98.0,
    status: 'warning',
  },
  {
    id: 'prod-6',
    barcode: '7501099887766',
    name: 'Jabón Multiusos Biodegradable 900g',
    category: 'Limpieza',
    stock: 35,
    minStock: 12,
    cost: 21.0,
    price: 32.0,
    status: 'optimal',
  },
];

export const DEMO_RECENT_SALES: SaleTransaction[] = [
  {
    id: 'sale-1',
    ticketNumber: '#T-004892',
    time: '14:28:12',
    customer: 'Cliente General',
    itemsCount: 4,
    paymentMethod: 'Tarjeta',
    total: 185.5,
    status: 'Completada',
  },
  {
    id: 'sale-2',
    ticketNumber: '#T-004891',
    time: '14:21:45',
    customer: 'Restaurante Don Pepe',
    itemsCount: 18,
    paymentMethod: 'Transferencia',
    total: 1420.0,
    status: 'Facturada',
  },
  {
    id: 'sale-3',
    ticketNumber: '#T-004890',
    time: '14:15:02',
    customer: 'María Elena Ramos',
    itemsCount: 2,
    paymentMethod: 'Efectivo',
    total: 62.0,
    status: 'Completada',
  },
  {
    id: 'sale-4',
    ticketNumber: '#T-004889',
    time: '14:04:30',
    customer: 'Cliente General',
    itemsCount: 7,
    paymentMethod: 'Efectivo',
    total: 315.0,
    status: 'Completada',
  },
];

export const FAQ_ITEMS = [
  {
    question: '¿Puedo usar VentaPro sin conexión a internet?',
    answer:
      '¡Sí! El sistema cuenta con modo sin conexión para continuar cobrando en mostrador incluso si se va internet. En cuanto la conexión regrese, todos tus datos y transacciones se sincronizan automáticamente.',
  },
  {
    question: '¿Necesito comprar equipo nuevo para usarlo?',
    answer:
      'No. VentaPro es compatible con cualquier computadora estándar (Windows, Mac o Linux) y la mayoría de lectores de código de barras USB, impresoras térmicas (58mm/80mm) y básculas comerciales del mercado.',
  },
  {
    question: '¿Cómo migro mis productos desde mi sistema anterior o Excel?',
    answer:
      'Puedes importar todo tu catálogo de productos, precios y existencias en menos de 5 minutos mediante nuestra plantilla de Excel lista para rellenar, o importar automáticamente escaneando los códigos de barra.',
  },
  {
    question: '¿La facturación electrónica está incluida o tiene costo extra?',
    answer:
      'En los planes Profesional y Negocio la emisión de facturas CFDI 4.0 está completamente incluida con timbres y soporte para complementos fiscales, sin cargos ocultos por factura emitida.',
  },
  {
    question: '¿Existe algún plazo forzoso de permanencia?',
    answer:
      'No hay plazos forzosos. Puedes contratar de forma mensual y cancelar cuando lo desees con un solo clic desde tu panel, o elegir el plan anual para obtener 2 meses gratis de ahorro.',
  },
];
