// Spanish content for the landing page.
// Single source of truth: content/profile-source.md (approved).
// Do not add experience, metrics, clients, certifications, technologies,
// projects, dates, services or URLs that are not in that file.
import type {
  AboutContent,
  Certification,
  ContactInfo,
  ContentStructure,
  Education,
  ExperienceEntry,
  ExpertiseArea,
  HeroContent,
  NavigationItem,
  ProfessionalDevelopmentEntry,
  Project,
  Service,
} from '../types/content'

export const navigationItems: NavigationItem[] = [
  { label: 'Sobre mí', targetId: 'about' },
  { label: 'Expertise', targetId: 'expertise' },
  { label: 'Experiencia', targetId: 'experience' },
  { label: 'Proyectos', targetId: 'projects' },
  { label: 'Certificaciones', targetId: 'certifications' },
  { label: 'Servicios', targetId: 'services' },
  { label: 'Contacto', targetId: 'contact' },
]

export const heroContent: HeroContent = {
  name: 'Milton Andrés Quintana Arboleda',
  title: 'Solution Architecture | Cloud & Hybrid Infrastructure | Technical Pre-Sales',
  tagline:
    'Diseño soluciones tecnológicas que conectan problemas de negocio con arquitecturas cloud, híbridas y de integración resilientes, seguras y costo-conscientes. Combino solution design, preventa técnica, conectividad, automatización e inteligencia artificial aplicada para convertir requisitos complejos en decisiones tecnológicas viables.',
  cta: {
    primary: 'Conoce mi experiencia',
    primaryAction: '#experience',
    secondary: 'Contáctame',
    secondaryAction: '#contact',
  },
}

export const aboutContent: AboutContent = {
  heading: 'Sobre mí',
  paragraphs: [
    'Profesional de tecnología con más de 7 años de experiencia en diseño, evaluación, implementación y evolución de soluciones de infraestructura crítica para entornos Telecom, ISP, Enterprise IT y B2B.',
    'Mi trayectoria evolucionó desde network operations y service delivery hacia technical pre-sales, solution design y solution architecture, manteniendo una base técnica sólida en infraestructura, networking y conectividad híbrida.',
    'Trabajo traduciendo necesidades de negocio y requisitos no funcionales —disponibilidad, capacidad, continuidad, seguridad, rendimiento y costo— en arquitecturas, HLD/LLD, SOW/RFP, criterios de aceptación y business cases.',
    'Actualmente profundizo mi práctica en cloud architecture, integración, sistemas distribuidos, arquitectura empresarial, automatización e inteligencia artificial aplicada, con foco principal en AWS y apertura a entornos Azure e híbridos.',
  ],
  approach: {
    title: 'Enfoque de arquitectura',
    steps: [
      'Contexto',
      'Problema',
      'Requisitos',
      'Trade-offs',
      'Arquitectura',
      'Riesgos',
      'Próximos pasos',
    ],
    statement:
      'La arquitectura no debería empezar por un producto, sino por el problema de negocio, las restricciones y los resultados que se necesitan alcanzar.',
  },
}

// Ordered by positioning priority: Solution Architecture → Cloud & Hybrid →
// Technical Pre-Sales → Integration → AI & Automation → Connectivity
// foundation, followed by cross-cutting Security, Resilience & Observability.
export const expertiseAreas: ExpertiseArea[] = [
  {
    title: 'Solution Architecture & Business Alignment',
    description:
      'Discovery, levantamiento de necesidades, requisitos funcionales y no funcionales, diseño de soluciones end-to-end, evaluación de alternativas, trade-offs, HLD/LLD y criterios de aceptación. Enfoque en conectar decisiones técnicas con resultados de negocio.',
  },
  {
    title: 'Cloud & Hybrid Architecture',
    description:
      'Diseño de arquitecturas AWS y Azure, conectividad híbrida y multicloud, alta disponibilidad, continuidad, identidad, seguridad, escalabilidad y optimización de costos. Experiencia con interconexión entre data centers, redes carrier y cloud.',
  },
  {
    title: 'Technical Pre-Sales & Solution Consulting',
    description:
      'Discovery técnico, factibilidad, solution design, propuestas técnicas, RFP/RFQ, SOW, pricing, ROI/TCO, CAPEX/OPEX y coordinación con equipos comerciales, ingeniería, operaciones, proveedores e integradores.',
  },
  {
    title: 'Integration & Distributed Systems',
    description:
      'Diseño conceptual de APIs e integraciones síncronas y asíncronas. Patrones y conceptos como API Gateway, event-driven architecture, messaging, idempotency, retry/backoff, DLQ, Transactional Outbox, CQRS y Saga, aplicados desde una perspectiva de arquitectura de soluciones.',
  },
  {
    title: 'AI & Automation',
    description:
      'Diseño y prototipado de casos de uso de automatización e inteligencia artificial generativa orientados a procesos empresariales. Evaluación de dónde la IA aporta valor, cómo se integra con sistemas existentes y qué requisitos de seguridad, observabilidad, trazabilidad y costo deben considerarse.',
  },
  {
    title: 'Connectivity & Infrastructure Architecture',
    description:
      'Diseño y evolución de infraestructura de red, DCI, Direct Connect, ExpressRoute, BGP multihoming, peering, IPv6, MPLS, EVPN/VXLAN, SD-WAN, VPN, QoS, CGNAT, Anti-DDoS, capacity planning y resiliencia de servicios.',
  },
  {
    title: 'Security, Resilience & Observability',
    description:
      'Segmentación, firewalls L2-L4, IAM, Anti-DDoS, DNS seguro, alta disponibilidad, disaster recovery, Zero Trust principles, observabilidad, SLA/KPI, NetFlow/SNMP y herramientas como SolarWinds, Zabbix y Grafana.',
  },
]

// Reverse-chronological order (most recent first).
export const experienceEntries: ExperienceEntry[] = [
  {
    company: 'Consultoría Tecnológica Independiente',
    role: 'Technology & Solutions Consultant — Cloud, Infrastructure & Networking',
    location: 'Quito, Ecuador',
    period: { start: 'Mayo 2026', end: null },
    achievements: [
      'Evalúo entornos AS-IS de ISPs y organizaciones tecnológicas para identificar riesgos de disponibilidad, capacidad, seguridad, dependencia y costo.',
      'Traduzco hallazgos técnicos en roadmaps, prioridades de evolución y propuestas de mejora.',
      'Diseño soluciones de infraestructura y conectividad que integran continuidad, IPv6, peering, observabilidad, CGNAT, seguridad y optimización de costos.',
      'Apoyo decisiones de arquitectura con foco en simplicidad, viabilidad operativa y alineación con objetivos de negocio.',
    ],
  },
  {
    // Publication rule: do not publish win rate, award percentages or
    // internal commercial ratios from UFINET.
    company: 'UFINET LATAM',
    role: 'PreSales & Solutions Engineer — Solution Design, Cloud & Infrastructure',
    location: 'Ecuador',
    period: { start: 'Octubre 2023', end: 'Abril 2026' },
    achievements: [
      'Lideré el ciclo de solution design junto al equipo comercial, desde discovery y factibilidad hasta propuesta técnica y validación.',
      'Traducí necesidades de negocio y requisitos técnicos en arquitecturas escalables, resilientes y costo-conscientes.',
      'Elaboré HLD/LLD, SOW/RFP, criterios de aceptación y análisis ROI/TCO/CAPEX/OPEX.',
      'Diseñé soluciones de infraestructura híbrida e interconexión entre data centers, cloud y redes carrier: DCI, multicloud, alta disponibilidad, peering, BGP multihoming, CGNAT y Anti-DDoS.',
      'Coordiné KAMs, ingeniería, operaciones, proveedores y clientes para validar factibilidad, riesgos, capacidad, costos, SLA, dependencias y transición hacia implementación.',
    ],
  },
  {
    company: 'UFINET LATAM',
    role: 'Service Delivery & Network Engineer | Infrastructure Delivery & Transition to Operations',
    location: 'Ecuador',
    period: { start: 'Enero 2022', end: 'Septiembre 2023' },
    achievements: [
      'Gestioné implementación, validación y transición a operación de servicios empresariales, asegurando documentación, parámetros técnicos, criterios de aceptación y continuidad operativa.',
      'Participé en capacity planning, ampliaciones y optimización de infraestructura sobre backbone de alta capacidad.',
      'Validé disponibilidad, routing, QoS, VPN y controles L2-L4.',
      'Planifiqué cambios y mantenimientos sobre dependencias críticas entre salidas internacionales, redes locales y CDNs para reducir riesgo operativo.',
    ],
  },
  {
    company: 'UFINET LATAM',
    role: 'Corporate Network Engineer — Service Delivery & Support',
    location: 'Ecuador',
    period: { start: 'Enero 2021', end: 'Diciembre 2021' },
    achievements: [
      'Coordiné implementaciones, upgrades, migraciones y transiciones de servicio para clientes corporativos.',
      'Diseñé y sostuve infraestructura L2/L3 de alta disponibilidad con BGP, OSPF, QoS, NAT, VPN, VLAN y DHCP.',
      'Elaboré reportes ejecutivos de KPIs, capacidad y dimensionamiento para apoyar decisiones de CAPEX/OPEX y mejora operativa.',
    ],
  },
  {
    company: 'FIBRAMAX (GEDATECU S.A.)',
    role: 'Backbone & Network Operations Engineer',
    location: 'Ecuador',
    period: { start: 'Enero 2019', end: 'Diciembre 2020' },
    achievements: [
      'Participé en diseño y evolución de un backbone de 100 Gbps con aproximadamente 200–300 nodos.',
      'Implementé políticas de enrutamiento, filtros y controles orientados a estabilidad y escalabilidad.',
      'Optimicé dependencias de conectividad, CDNs y salidas internacionales para reducir latencia y fortalecer continuidad de servicio.',
    ],
  },
  {
    company: 'SONDA',
    role: 'Network Implementation Engineer',
    location: 'Ecuador',
    period: { start: 'Abril 2018', end: 'Julio 2018' },
    achievements: [
      'Implementé infraestructura LAN/WAN, enlaces L2/L3 y QoS conforme a HLD/LLD y SLA definidos.',
      'Automaticé monitoreo en SolarWinds para habilitar alertas proactivas y reducir riesgo operativo durante cambios.',
    ],
  },
  {
    company: 'Comando Conjunto de las Fuerzas Armadas',
    role: 'Pasantía — Network & Connectivity Support',
    location: 'Ecuador',
    period: { start: 'Agosto 2017', end: 'Noviembre 2017' },
    achievements: [
      'Brindé soporte a infraestructura de conectividad crítica en radio/satélite, SIP/VoIP, enlaces IP y monitoreo.',
      'Estandaricé plantillas y procedimientos técnicos de soporte.',
    ],
  },
]

const portfolioLabel = 'Caso de arquitectura (portafolio)'
const portfolioNote =
  'Caso de arquitectura / portafolio; no corresponde a una implementación productiva para un cliente.'
const professionalLabel = 'Caso profesional anonimizado'

// Portfolio cases are architecture case studies; professional cases are
// anonymized (no client names, bid values or contractual data).
export const projects: Project[] = [
  {
    name: 'AWS Digital Banking Architecture',
    type: 'portfolio',
    typeLabel: portfolioLabel,
    description:
      'Diseñar una plataforma de banca digital segura y resiliente partiendo de drivers arquitectónicos, quality attributes y restricciones de negocio, en lugar de seleccionar primero productos o servicios.',
    focus: [
      'ADD 3.0',
      'C4',
      'ADRs',
      'ASR traceability',
      'BFF/PKCE',
      'Transactional Outbox',
      'Idempotency',
      'Event-driven integration',
      'Anti-Corruption Layer',
      'Multi-AZ',
      'Warm Standby DR',
      'Security',
      'Observability',
    ],
    demonstrates:
      'Método de arquitectura, trazabilidad de decisiones, evaluación de alternativas y trade-offs, riesgos de producción y documentación arquitectónica editable.',
    note: portfolioNote,
    url: 'https://github.com/mquintanaarboleda-gif/aws-digital-banking-architecture',
  },
  {
    name: 'AWS Digital Banking Solution Architecture',
    type: 'portfolio',
    typeLabel: portfolioLabel,
    description:
      'Diseñar capacidades digitales alrededor de un Core Banking existente con foco en identidad digital, orquestación de transacciones e integración resiliente.',
    focus: [
      'Amazon Cognito',
      'OAuth 2.0/OIDC with PKCE',
      'Passkeys/WebAuthn',
      'Amazon Rekognition',
      'Step Functions Standard',
      'DynamoDB idempotency controls',
      'EventBridge',
      'SQS/DLQ',
      'ECS Fargate',
      'ElastiCache/Valkey',
      'Direct Connect + VPN',
      'Multi-region Warm Standby DR',
    ],
    demonstrates:
      'Selección de servicios AWS, trazabilidad de requisitos, decisiones de arquitectura, precondiciones de producción y vistas C4 orientadas a solución.',
    note: portfolioNote,
    url: 'https://github.com/mquintanaarboleda-gif/aws-digital-banking-solution-architecture',
  },
  {
    name: 'Hybrid Architecture & DCI',
    type: 'professional',
    typeLabel: professionalLabel,
    description:
      'Interconectar data centers y entornos cloud manteniendo disponibilidad, baja latencia y continuidad.',
    focus: [
      'DCI',
      'EVPN/VXLAN',
      'L2/L3VPN',
      'Redundancia',
      'Conectividad híbrida/multicloud',
    ],
  },
  {
    name: 'Resilience & Continuity Architecture',
    type: 'professional',
    typeLabel: professionalLabel,
    description:
      'Reducir dependencia de un único upstream y sostener continuidad ante fallas de conectividad.',
    focus: [
      'BGP multihoming',
      'Múltiples salidas internacionales',
      'Anti-DDoS',
      'Capacity planning',
      'Mecanismos de conmutación',
    ],
  },
  {
    name: '100G Capacity Solution',
    type: 'professional',
    typeLabel: professionalLabel,
    description:
      'Diseñar una solución de alta capacidad para un operador regional con requisitos de redundancia, baja latencia y viabilidad económica.',
    focus: [
      'Conectividad 100G',
      'Redundancia de infraestructura',
      'Transporte óptico/DWDM',
      'Análisis de capacidad',
      'Evaluación económica',
    ],
  },
]

// Only the items listed under "Certifications" in the source.
export const certifications: Certification[] = [
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: '2026',
  },
  {
    name: 'AWS Certified AI Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: '2026',
  },
]

// Source section "Architecture & Cloud Development".
export const professionalDevelopment: ProfessionalDevelopmentEntry[] = [
  {
    name: 'Preparación AWS Certified Solutions Architect – Associate (SAA-C03)',
    period: '2026',
  },
  {
    name: 'Curso Taller Arquitectura Empresarial TOGAF 10',
    provider: 'IGP Training',
    detail: '43 horas',
    period: '2026',
    status: 'En curso',
  },
  {
    name: 'Diplomado en Arquitectura de Software',
    provider: 'Universidad Autónoma de Chile',
    period: 'Septiembre 2026 – Enero 2027',
  },
  {
    name: 'Diplomado en Arquitectura Empresarial',
    provider: 'UDLA',
    period: 'Noviembre 2026 – Enero 2027',
    status: 'Programado',
  },
  {
    name: 'Cursos de Arquitectura de Soluciones AWS y Azure',
    provider: 'Smart Data',
    period: '2026',
  },
  {
    name: 'Curso de Arquitectura de Datos',
    provider: 'Smart Data',
    period: '2026',
  },
]

// Source section "Technical Foundation" (names only; the source does not
// provide issuers or dates for these items).
export const technicalFoundation: string[] = [
  'ITIL v4',
  'CCNA Routing & Switching',
  'CCNA Security',
  'MikroTik: MTCNA, MTCRE, MTCSE',
  'Formación CCNP Routing & Switching / MPLS',
]

export const education: Education[] = [
  {
    degree: 'MBA — Administración y Dirección de Empresas',
    institution: 'UNIR',
    period: { start: 'Marzo 2025', end: 'Mayo 2026' },
  },
  {
    degree: 'Máster en Diseño y Gestión de Proyectos Tecnológicos',
    institution: 'UNIR',
    period: { start: 'Febrero 2021', end: 'Febrero 2022' },
  },
  {
    degree: 'Ingeniero en Electrónica y Telecomunicaciones',
    institution: 'Universidad de las Fuerzas Armadas ESPE',
    period: { start: '2011', end: '2018' },
  },
]

// Ordered by positioning priority (AI & Automation before Connectivity).
export const services: Service[] = [
  {
    name: 'Solution Architecture & Architecture Review',
    description:
      'Diseño y revisión de soluciones end-to-end a partir de problemas de negocio, requisitos no funcionales, restricciones, riesgos y trade-offs. Incluye arquitectura de alto nivel, alternativas, criterios de aceptación y roadmap técnico.',
  },
  {
    name: 'Cloud & Hybrid Architecture',
    description:
      'Diseño conceptual de soluciones AWS, Azure e híbridas considerando disponibilidad, seguridad, integración, conectividad, escalabilidad, resiliencia y costo.',
  },
  {
    name: 'Technical Pre-Sales & Solution Consulting',
    description:
      'Discovery, levantamiento de requisitos, solution design, factibilidad, propuestas técnicas, HLD/LLD, SOW/RFP, TCO/ROI y acompañamiento técnico durante procesos comerciales.',
  },
  {
    name: 'AI & Automation Discovery / Prototyping',
    description:
      'Identificación y prototipado de casos de uso de automatización e inteligencia artificial generativa, evaluando valor de negocio, integración, seguridad, observabilidad, trazabilidad y costo antes de escalar una solución.',
  },
  {
    name: 'Connectivity & Cloud Networking',
    description:
      'Diseño de conectividad empresarial y cloud, DCI, multicloud, peering, BGP, IPv6, SD-WAN, VPN, QoS, CGNAT, Anti-DDoS y resiliencia de red.',
  },
]

// Email, phone, LinkedIn and GitHub are approved for publication.
export const contactInfo: ContactInfo = {
  email: 'mquintana.arboleda@gmail.com',
  phone: '+593 992794535',
  linkedin: 'https://www.linkedin.com/in/milton-quintana-arboleda-4108b2160/',
  github: 'https://github.com/mquintanaarboleda-gif',
  location: 'Quito, Ecuador',
  reach: 'Ecuador | Latinoamérica | Oportunidades y colaboraciones remotas',
}

// Aggregate typed against ContentStructure so the compiler verifies that
// this language file is complete (a future en.ts follows the same contract).
export const content: ContentStructure = {
  navigation: navigationItems,
  hero: heroContent,
  about: aboutContent,
  expertise: expertiseAreas,
  experience: experienceEntries,
  projects,
  certifications,
  professionalDevelopment,
  technicalFoundation,
  education,
  services,
  contact: contactInfo,
}
