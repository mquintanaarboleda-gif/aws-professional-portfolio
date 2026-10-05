# Design Document - Professional Landing Page

## Overview

Esta landing page profesional es una aplicación web estática construida con React, TypeScript y Vite que presenta la experiencia, expertise y servicios de un Solution Architect / Cloud Architect / Technical Presales.

**Principio arquitectónico fundamental**: Simplicidad. La arquitectura utiliza la solución más simple que satisface los requisitos sin introducir complejidad innecesaria.

### Características clave
- Aplicación React estática sin backend
- Contenido profesional desacoplado de componentes UI
- Responsive design (móvil, tablet, desktop)
- Despliegue futuro en AWS (S3 privado + CloudFront)
- MVP completamente en español, preparado arquitectónicamente para expansión futura a inglés

### Usuarios objetivo
- Hiring Managers / CTOs / Líderes Técnicos evaluando candidatos
- Recruiters técnicos buscando perfiles especializados
- Clientes potenciales buscando servicios de consultoría
- Partners evaluando colaboración

---

## Architecture

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React Application                      │    │
│  │  ┌──────────┐                                      │    │
│  │  │   App    │                                      │    │
│  │  └────┬─────┘                                      │    │
│  │       │                                             │    │
│  │       ├─── Navigation                               │    │
│  │       │                                             │    │
│  │       └─── main                                     │    │
│  │            ├─── Hero                                │    │
│  │            ├─── About                               │    │
│  │            ├─── Expertise                           │    │
│  │            ├─── Experience                          │    │
│  │            ├─── Projects                            │    │
│  │            ├─── Certifications                      │    │
│  │            ├─── Services                            │    │
│  │            └─── Contact                             │    │
│  │                  │                                   │    │
│  │                  ▼                                   │    │
│  │       ┌──────────────────────┐                      │    │
│  │       │   Content Module     │                      │    │
│  │       │   (content/es.ts)    │                      │    │
│  │       └──────────────────────┘                      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

                           Build Process
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │        Vite            │
                    │  - Bundle React/TS     │
                    │  - Optimize assets     │
                    │  - Minify output       │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │    dist/ directory     │
                    │  - index.html          │
                    │  - bundled JS          │
                    │  - bundled CSS         │
                    │  - optimized images    │
                    └────────────────────────┘

                    AWS Architecture (Future)
                                 │
                                 ▼
┌──────────┐      ┌──────────────────┐      ┌────────────────┐
│ Route 53 │─────▶│   CloudFront     │─────▶│   S3 Bucket    │
│  (DNS)   │      │  - SSL/TLS(ACM)  │ OAC  │   (private)    │
└──────────┘      │  - Edge caching  │      └────────────────┘
                  │  - HTTPS redirect│
                  └──────────────────┘
```

### Decisiones Arquitectónicas

**1. Single Page Application estática**
- NO es un MPA (Multi-Page Application) con routing complejo
- Es una SPA simple que muestra secciones en una única página
- Navegación mediante smooth scroll a secciones, NO mediante React Router
- Justificación: Los requisitos no demandan múltiples rutas; agregar React Router añadiría complejidad innecesaria

**2. Contenido desacoplado**
- El contenido profesional vive separado en módulos TypeScript
- Los componentes son presentacionales y reciben contenido como props
- Permite actualizar contenido sin modificar componentes
- Preparado para expansión multiidioma futura

**3. Sin state management global**
- NO se usa Redux, Zustand, ni similar
- React Context API si se necesita state compartido (ej: tema dark/light futuro)
- Justificación: No hay estado complejo que justifique una librería adicional

**4. CSS Modules + global.css**
- CSS Modules para estilos específicos de componentes
- global.css solo para reset, tipografía base, design tokens
- NO se usa CSS-in-JS ni Tailwind
- Justificación: CSS Modules proporciona scoping sin el overhead de librerías adicionales

---

## Components and Interfaces

### Estructura de Directorios

```
projects/professional-landing-page/
├── public/
│   ├── favicon.ico
│   └── images/              # Assets estáticos servidos as-is
├── src/
│   ├── components/          # Componentes compartidos (crear según necesidad)
│   │   │                    # Se crean cuando existe reutilización real
│   │   │                    # Ejemplos de candidatos: SectionTitle, Badge, etc.
│   │   └── Navigation/      # Navegación principal (fuera de <main> y de sections)
│   │       ├── Navigation.tsx
│   │       └── Navigation.module.css
│   │
│   ├── sections/            # Secciones de contenido de la landing
│   │   ├── Hero/
│   │   │   ├── Hero.tsx
│   │   │   └── Hero.module.css
│   │   ├── About/
│   │   │   ├── About.tsx
│   │   │   └── About.module.css
│   │   ├── Expertise/
│   │   │   ├── Expertise.tsx
│   │   │   └── Expertise.module.css
│   │   ├── Experience/
│   │   │   ├── Experience.tsx
│   │   │   └── Experience.module.css
│   │   ├── Projects/
│   │   │   ├── Projects.tsx
│   │   │   └── Projects.module.css
│   │   ├── Certifications/
│   │   │   ├── Certifications.tsx
│   │   │   └── Certifications.module.css
│   │   ├── Services/
│   │   │   ├── Services.tsx
│   │   │   └── Services.module.css
│   │   └── Contact/
│   │       ├── Contact.tsx
│   │       └── Contact.module.css
│   │
│   ├── content/             # Contenido profesional desacoplado
│   │   └── es.ts            # Contenido en español (MVP)
│   │                        # en.ts vendrá en el futuro
│   │
│   ├── types/               # Type definitions TypeScript
│   │   └── content.ts       # Interfaces para contenido
│   │
│   ├── assets/              # Assets importados por componentes
│   │   └── icons/           # SVG icons si son necesarios
│   │
│   ├── styles/              # Estilos globales
│   │   └── global.css       # Reset, tipografía, design tokens
│   │
│   ├── App.tsx              # Componente raíz que orquesta secciones
│   ├── App.css              # Estilos específicos de App (opcional)
│   └── main.tsx             # Entry point de la aplicación
│
├── index.html               # HTML raíz
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Responsabilidades

#### App.tsx
- Orquesta la estructura general de la aplicación
- Renderiza Navigation (fuera del main)
- Renderiza elemento `<main>` con todas las secciones de contenido
- NO contiene lógica de negocio compleja
- Estructura: `<Navigation />`, `<main>` con `<Hero />`, `<About />`, ..., `<Contact />`, opcionalmente `<Footer />`

#### Navigation (`src/components/Navigation/`)
Menú de navegación principal de la landing page, separado de las secciones de contenido.

**Navigation**
- Menú de navegación con links a secciones
- Smooth scroll al hacer click
- Navegación responsive, simple y accesible; el patrón visual móvil se decide durante la implementación
- Importa `navigationContent` de `content/es.ts`
- Separado estructuralmente del `<main>` de contenido

#### Components (`src/components/`)
Directorio para componentes **compartidos** que se crean **cuando existe reutilización real o una responsabilidad transversal clara**.

**Principio: Evitar abstracciones anticipadas**
- NO crear componentes genéricos por adelantado "por si acaso"
- Crear componentes compartidos SOLO cuando:
  - El mismo patrón se repite en 2+ lugares
  - Existe una responsabilidad transversal clara (ej: formateo de fechas)
  - La abstracción simplifica el código en lugar de complicarlo

**Candidatos posibles** (se crearán si/cuando sea necesario):
- `SectionTitle`: Si múltiples secciones comparten formato de título idéntico
- `Badge`: Si se repite patrón de badges/tags en múltiples lugares
- Otros según necesidades reales durante implementación

**NO prescribir desde el inicio**: Button, Card, Section, ContactLink u otros componentes genéricos como obligatorios.

#### Sections (`src/sections/`)
Secciones **específicas** que implementan el contenido de la landing page.

**Navigation**
- Ya documentado arriba (vive en `src/components/Navigation/`, fuera de `<main>`; no es una content section)

**Hero**
- Sección principal above-the-fold
- Muestra nombre, título, tagline, CTAs
- Importa `heroContent` de `content/es.ts`
- Implementa botones/links según necesidad

**About**
- Breve biografía profesional
- Importa `aboutContent` de `content/es.ts`

**Expertise**
- Áreas de expertise con estructura visual clara, responsive y jerarquía apropiada (el patrón concreto se decide durante la implementación según el contenido)
- Importa `expertiseAreas` de `content/es.ts`
- Renderiza cada área con título y descripción

**Experience**
- Experiencia profesional en orden cronológico inverso, con organización visual clara (el patrón concreto se decide durante la implementación según el contenido)
- Importa `experienceEntries` de `content/es.ts`
- Muestra empresa, rol, período, logros

**Projects**
- Proyectos destacados presentados con claridad, responsive (el patrón concreto se decide durante la implementación según el contenido)
- Importa `projects` de `content/es.ts`
- Renderiza cada proyecto con información relevante
- Links externos a proyectos públicos

**Certifications**
- Lista de certificaciones y educación
- Importa `certifications` y `education` de `content/es.ts`
- Distingue visualmente certificaciones vs educación académica

**Services**
- Lista de servicios profesionales ofrecidos
- Importa `services` de `content/es.ts`
- Usa jerarquía visual para categorías si aplica

**Contact**
- Información de contacto (LinkedIn, email)
- Importa `contactInfo` de `content/es.ts`
- Links con `rel="noopener noreferrer"` y `target="_blank"`
- Implementa links según necesidad

#### Content (`src/content/es.ts`)
Módulo TypeScript que exporta TODO el contenido profesional.

**Responsabilidades**:
- Contiene texto, URLs, descripciones
- Fuertemente tipado con interfaces de `types/content.ts`
- NO contiene lógica, solo datos
- Fácilmente actualizable por el profesional

**Estructura futura para i18n**:
```typescript
// content/es.ts (MVP)
export const heroContent: HeroContent = { ... };
export const aboutContent: AboutContent = { ... };
// ...

// content/en.ts (futuro)
export const heroContent: HeroContent = { ... };
export const aboutContent: AboutContent = { ... };
// ...

// Hook futuro: useContent()
// const content = useContent(); // retorna es.ts o en.ts según idioma activo
```

#### Styles (`src/styles/global.css`)
**Solo contiene**:
- CSS reset (box-sizing, margins)
- Tipografía base (font-family, font-size, line-height)
- Design tokens (CSS custom properties):
  ```css
  :root {
    /* Colors */
    --color-primary: #...;
    --color-secondary: #...;
    --color-text: #...;
    --color-background: #...;
    --color-accent: #...;
    
    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 4rem;
    --spacing-xl: 6rem;
    
    /* Typography */
    --font-heading: ...;
    --font-body: ...;
    --font-size-base: 1rem;
    --line-height-base: 1.6;
    
    /* Breakpoints (documentados en comentarios) */
    /* Mobile: < 768px */
    /* Tablet: 768px - 1023px */
    /* Desktop: >= 1024px */
  }
  ```
- Reglas globales mínimas (body, html, links base)

**NO incluye**:
- Estilos específicos de componentes
- Layouts complejos
- Utilidades o helpers

---

## Data Models

### Content Type Definitions

```typescript
// src/types/content.ts

export interface HeroContent {
  name: string;
  title: string;
  tagline: string;
  cta: {
    primary: string;
    primaryAction: string; // scroll target o URL
    secondary?: string;
    secondaryAction?: string;
  };
}

export interface AboutContent {
  heading: string;
  paragraphs: string[];
}

export interface ExpertiseArea {
  title: string;
  description: string;
  icon?: string; // nombre del icono o path a SVG
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: {
    start: string; // "2020" o "Enero 2020"
    end: string | null; // null si es trabajo actual
  };
  summary: string;
  achievements?: string[]; // lista de logros opcionales
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string; // URL pública del proyecto si existe
  imageUrl?: string; // screenshot o logo del proyecto
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  verificationUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Service {
  name: string;
  description: string;
  category?: string; // para agrupar servicios
}

export interface ContactInfo {
  email: string;
  linkedin: string; // URL completa
}

export interface NavigationItem {
  label: string;
  targetId: string; // ID de la sección HTML
}

// Exportar estructura completa del contenido
export interface ContentStructure {
  navigation: NavigationItem[];
  hero: HeroContent;
  about: AboutContent;
  expertise: ExpertiseArea[];
  experience: ExperienceEntry[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  services: Service[];
  contact: ContactInfo;
}
```

### Ejemplo de uso en content/es.ts

```typescript
// src/content/es.ts
import type {
  HeroContent,
  AboutContent,
  ExpertiseArea,
  ExperienceEntry,
  Project,
  Certification,
  Education,
  Service,
  ContactInfo,
  NavigationItem
} from '../types/content';

export const navigation: NavigationItem[] = [
  { label: 'Sobre mí', targetId: 'about' },
  { label: 'Expertise', targetId: 'expertise' },
  { label: 'Experiencia', targetId: 'experience' },
  { label: 'Proyectos', targetId: 'projects' },
  { label: 'Certificaciones', targetId: 'certifications' },
  { label: 'Servicios', targetId: 'services' },
  { label: 'Contacto', targetId: 'contact' },
];

export const heroContent: HeroContent = {
  name: '[NOMBRE_PROFESIONAL]',
  title: 'Solution Architect | Cloud Architect',
  tagline: '[PROPUESTA_DE_VALOR]',
  cta: {
    primary: 'Ver proyectos',
    primaryAction: '#projects',
    secondary: 'Contactar',
    secondaryAction: '#contact',
  },
};

export const aboutContent: AboutContent = {
  heading: 'Sobre mí',
  paragraphs: [
    '[BIOGRAFÍA_PÁRRAFO_1]',
    '[BIOGRAFÍA_PÁRRAFO_2]',
  ],
};

// ... resto del contenido con placeholders
// El contenido real se proporcionará posteriormente
```

**Nota**: Los placeholders `[NOMBRE_PROFESIONAL]`, etc., serán reemplazados con contenido real del profesional en fase de implementación.

---

## Error Handling

### Build-time Errors

**TypeScript Type Checking**
- Todos los componentes tienen props tipadas
- El contenido en `content/es.ts` debe cumplir con interfaces de `types/content.ts`
- Errores de tipo se detectan en desarrollo y build
- Build falla si hay errores de tipo

**Missing Content**
- Si falta contenido requerido, TypeScript reportará error
- Cada sección debe recibir datos válidos o fallará en compile-time

### Runtime Errors

**Contenido faltante**
- Si una propiedad opcional no existe (ej: `project.url`), componente NO renderiza ese elemento
- Uso de optional chaining: `{project.url && <a href={project.url}>...</a>}`
- Valores por defecto para propiedades opcionales

**Imágenes faltantes**
- Si `imageUrl` no existe o falla, mostrar placeholder o simplemente omitir imagen
- Considerar `alt` text apropiado para accesibilidad

**Navegación a sección inexistente**
- Si un `targetId` en navegación no coincide con ningún elemento, el scroll simplemente no ocurre (comportamiento no crítico)
- Validar durante desarrollo que todos los IDs existen

**Links externos rotos**
- No hay validación runtime de URLs externas
- URLs deben ser verificadas manualmente antes de deployment
- Usar `rel="noopener noreferrer"` para seguridad

### AWS Errors (Futuro)

**S3 Access Denied**
- Si OAC no está configurado correctamente, CloudFront no puede acceder a S3
- Usuario verá error 403 de CloudFront
- Resolución: verificar política de bucket y configuración de OAC

**CloudFront Cache Issues**
- Contenido desactualizado en cache después de deploy
- Resolución: los assets con hash no requieren invalidación (cada versión tiene una URL nueva)
- Si `index.html` sigue desactualizado, esperar la revalidación o invalidar `/index.html`
- Invalidación `/*` solo en casos excepcionales con una razón concreta, no como práctica normal

**Certificate SSL/TLS**
- Si certificado ACM no está aprobado/validado, HTTPS fallará
- Resolución: completar validación DNS de ACM antes de configurar CloudFront

---

## Testing Strategy

### Testing Levels

#### 1. Type Checking (Compile-time)
**Herramienta**: TypeScript
**Qué valida**:
- Todas las props de componentes son correctas
- Contenido cumple con interfaces definidas
- No hay `any` implícitos
- Imports correctos

**Comando**: `npm run type-check` (configurar en package.json: `tsc --noEmit`)

#### 2. Build Validation
**Herramienta**: Vite
**Qué valida**:
- Build completa sin errores
- Assets optimizados correctamente
- Output en `dist/` es válido
- No hay warnings críticos

**Comando**: `npm run build`

**Criterios de éxito**:
- Build completa sin errores
- `dist/index.html` existe y contiene el bundle
- CSS y JS minificados
- Assets optimizados

#### 3. Manual Testing (Desarrollo)

**Responsive Testing**
- Probar en Chrome DevTools con viewports:
  - Mobile: 375px (iPhone SE)
  - Tablet: 768px (iPad)
  - Desktop: 1440px
- Verificar que NO hay scroll horizontal
- Verificar que touch targets en móvil son ≥44x44px

**Navegación**
- Click en cada link de navegación
- Verificar smooth scroll a sección correcta
- Verificar que secciones tienen IDs correctos

**Links externos**
- Click en LinkedIn link → abre en nueva tab
- Click en email link → abre cliente de email
- Verificar `rel="noopener noreferrer"` en inspector

**Accesibilidad básica**
- Navegación con teclado (Tab, Enter)
- Verificar que todos los botones/links son focuseables
- Verificar indicadores de foco visibles
- Verificar contraste de colores con herramienta de DevTools

**Cross-browser**
- Probar en Chrome, Firefox, Safari
- Probar en Safari iOS (mobile)
- Verificar que estilos se ven correctamente

#### 4. Lighthouse Audit (Pre-deployment)
**Herramienta**: Chrome Lighthouse
**Qué valida**:
- Performance
- Accessibility
- Best Practices
- SEO

**Proceso**:
1. Ejecutar `npm run build`
2. Servir `dist/` localmente con `npm run preview`
3. Abrir Chrome DevTools → Lighthouse
4. Ejecutar audit en modo Desktop y Mobile

**Metas cualitativas** (no bloqueantes para MVP, pero guías de mejora):
- Performance: Identificar assets pesados o JS bloqueante
- Accessibility: Detectar problemas de contraste, alt text, ARIA
- Best Practices: HTTPS (verificar en producción), consola sin errores
- SEO: meta tags, estructura HTML semántica

**Notas**:
- Los scores exactos se definirán después del primer build de producción
- Lighthouse identifica problemas, pero no todos son bloqueantes para MVP
- Priorizar accesibilidad y best practices sobre score perfecto de performance

#### 5. AWS Deployment Testing (Post-deployment manual)

**Acceso S3 directo**
- Intentar acceder directamente a URL de S3
- Debe fallar con Access Denied (bucket es privado)

**Acceso CloudFront**
- Acceder vía URL de CloudFront
- Debe servir contenido correctamente
- Verificar HTTPS funcional

**Cache behavior**
- Realizar cambio en contenido y re-deploy
- Verificar que los assets con hash nuevos se sirven sin invalidación
- Verificar que `index.html` refleja la nueva versión (por revalidación o, si corresponde, invalidando `/index.html`)

**DNS**
- Verificar que dominio custom (Route 53) resuelve a CloudFront
- Verificar que HTTPS funciona con certificado ACM

### Testing NO incluido en MVP

- Unit tests automatizados (Jest, Vitest)
- Integration tests automatizados (React Testing Library)
- E2E tests (Playwright, Cypress)
- Visual regression tests
- Performance tests automatizados

**Justificación**: Para una landing estática simple, el overhead de setup y mantenimiento de testing automatizado supera el beneficio en MVP. Se prioriza:
1. Type safety (TypeScript)
2. Build validation
3. Manual testing estructurado
4. Lighthouse audit

Tests automatizados pueden agregarse posteriormente si la landing evoluciona en complejidad.

---

## Build and Deployment Pipeline

### Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Phase                         │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    npm run dev
                             │
                             ▼
                  ┌──────────────────┐
                  │   Vite Dev Server │
                  │  - Hot reload     │
                  │  - Fast refresh   │
                  │  - Source maps    │
                  └─────────┬─────────┘
                            │
                            ▼
                   http://localhost:5173
                   (desarrollo local)


┌─────────────────────────────────────────────────────────────┐
│                    Build Phase                               │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    npm run build
                             │
                             ▼
                  ┌──────────────────────┐
                  │     Vite Build       │
                  │  - Bundle React/TS   │
                  │  - Minify JS/CSS     │
                  │  - Optimize images   │
                  │  - Generate hashes   │
                  └──────────┬───────────┘
                             │
                             ▼
                       dist/ directory
                  ┌─────────────────────┐
                  │  - index.html       │
                  │  - assets/          │
                  │    - main.abc123.js │
                  │    - main.xyz789.css│
                  │    - logo.png       │
                  └─────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                Manual Deployment (MVP)                       │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
              AWS Console (manual)
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   ┌─────────┐      ┌──────────────┐      ┌──────────┐
   │   S3    │      │  CloudFront  │      │ Route 53 │
   │ Upload  │      │ Inval. (opc.)│      │   DNS    │
   └─────────┘      └──────────────┘      └──────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                             │
                             ▼
              https://domain.com (production)
```

### Vite Build Process

**Input**: Código fuente en `src/`
**Output**: Archivos estáticos optimizados en `dist/`

**Transformaciones**:
1. **TypeScript → JavaScript**: Transpilación y type checking
2. **JSX → JavaScript**: Transformación de sintaxis React
3. **CSS Modules → CSS**: Scoping de clases CSS
4. **Imports → Bundle**: Resolución de módulos y tree-shaking
5. **Assets → Optimized**: Compresión de imágenes, hash de archivos
6. **Minification**: Minificación de JS y CSS
7. **Code Splitting** (si se configura): Separación de chunks para lazy loading

**Configuración Vite** (`vite.config.ts`):
- Se utiliza la configuración default generada por el template oficial `react-ts` de Vite (solo `plugins: [react()]`).
- Los defaults de Vite ya satisfacen los requirements: el production build se genera en `dist/`, con assets minificados y nombres con hash.
- `vite.config.ts` se modifica únicamente si aparece una necesidad concreta; cualquier cambio debe justificarse.
- No se agregan overrides preventivos.

### Manual Deployment Steps (Primer deployment)

El primer deployment es **manual mediante AWS Console**, para comprender cada recurso y sus conexiones. AWS CLI puede usarse como alternativa en deployments posteriores; no es requisito del primer deployment. Infrastructure as Code sigue fuera del MVP inicial.

**Prerequisitos**:
- Cuenta AWS con permisos para crear S3, CloudFront, ACM y Route 53
- Production build generado localmente (`npm run build` → `dist/`)
- Dominio registrado (opcional para MVP)

**Paso 1: Crear S3 Bucket (Console)**
- Crear bucket general purpose en la región elegida
- Block all public access: ON
- Static Website Hosting: NO habilitar
- Encryption: SSE-S3

**Paso 2: Subir archivos a S3 (Console)**
- Subir el contenido de `dist/` al bucket
- Metadata `Cache-Control`:
  - Assets con hash (`assets/*`): `public, max-age=31536000`
  - `index.html`: `public, max-age=0, must-revalidate`

**Paso 3: Solicitar Certificado SSL/TLS en ACM (Console)**
- Región **us-east-1** (obligatoria para certificados usados por CloudFront)
- Dominio y subdominios (ej: `domain.com`, `www.domain.com`)
- Validación DNS mediante Route 53
- Esperar a que el estado sea "Issued"

**Paso 4: Crear distribución CloudFront (Console)**
- Origin: S3 bucket (NO website endpoint, bucket directo)
- Origin Access: Origin Access Control (OAC) - crear nuevo
- Viewer Protocol Policy: Redirect HTTP to HTTPS
- Allowed HTTP Methods: GET, HEAD
- Cache Policy: CachingOptimized
- Compress objects automatically: Yes
- Default Root Object: `index.html`
- Alternate Domain Names (CNAMEs): domain.com, www.domain.com
- SSL Certificate: ACM certificate creado en paso 3

**Paso 5: Actualizar política de bucket S3**
Después de crear distribución CloudFront, CloudFront proporciona una política de bucket sugerida.
Aplicar política que permite acceso SOLO desde CloudFront vía OAC.

Ejemplo de política:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::professional-landing-[unique-id]/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

**Paso 6: Configurar Route 53 (Console)**
- Crear registros Alias (A, y AAAA si se usa IPv6) apuntando a la distribución CloudFront

**Paso 7: Verificar deployment**
- Acceder a https://domain.com
- Verificar que contenido carga correctamente
- Verificar HTTPS funcional
- Intentar acceso directo a S3 → debe fallar (Access Denied)

### Updates y Re-deployments futuros

**Proceso de actualización**:
1. Realizar cambios en código o contenido
2. `npm run build`
3. Subir `dist/` a S3 con la misma metadata `Cache-Control` (Console o, como alternativa, AWS CLI: `aws s3 sync dist/ s3://bucket/`)
4. Crear invalidación de CloudFront solo si es necesario:
   - Para `index.html`: `aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/index.html"`
   - Assets con hash NO requieren invalidación (nuevo hash = nueva URL)
   - Invalidación `/*` solo para casos excepcionales
5. Esperar propagación (1-5 minutos si se creó invalidación)
6. Verificar cambios en producción

**Nota**: En futuras iteraciones, este proceso se automatizará con CI/CD (GitHub Actions, GitLab CI, etc.) pero queda fuera del MVP.

---

## AWS Architecture Detail

### S3 Bucket Configuration

**Propósito**: Almacenamiento de archivos estáticos del sitio web

**Configuraciones clave**:
- **Bucket type**: General purpose
- **Región**: us-east-1 (o región elegida)
- **Acceso público**: BLOQUEADO (Block all public access: ON)
- **Versioning**: Opcional (recomendado para rollback)
- **Encryption**: SSE-S3 (cifrado del lado del servidor)
- **Static Website Hosting**: NO habilitado (no se usa)

**Política de bucket**:
- Solo CloudFront puede acceder
- Acceso mediante Origin Access Control (OAC)
- Condición: `AWS:SourceArn` debe coincidir con distribución CloudFront

**Estructura de archivos**:
```
s3://professional-landing-[unique-id]/
├── index.html                 (Cache-Control: max-age=0)
├── assets/
│   ├── main.abc123.js        (Cache-Control: max-age=31536000)
│   ├── main.xyz789.css       (Cache-Control: max-age=31536000)
│   └── logo-hash.png         (Cache-Control: max-age=31536000)
└── favicon.ico               (Cache-Control: max-age=86400)
```

**Cache-Control headers**:
- `index.html`: `max-age=0, must-revalidate` (siempre verificar versión actual)
- Assets con hash: `max-age=31536000` (1 año, inmutables gracias al hash)

**Nota sobre invalidaciones**:
- Assets con hash normalmente NO requieren invalidación (son inmutables)
- `index.html` puede invalidarse cuando sea necesario
- Invalidación completa `/*` solo en casos excepcionales (ej: cambio estructural mayor)
- En la mayoría de deployments, solo invalidar `index.html` si es necesario

### CloudFront Distribution

**Propósito**: CDN global, terminación SSL/TLS, caching en edge locations

**Origin configuration**:
- Origin domain: `professional-landing-[unique-id].s3.us-east-1.amazonaws.com`
- Origin path: vacío
- Origin Access: Origin Access Control (OAC)
- Origin Shield: NO (no necesario para tráfico bajo de MVP)

**Default cache behavior**:
- Viewer protocol policy: Redirect HTTP to HTTPS
- Allowed HTTP methods: GET, HEAD, OPTIONS
- Cache policy: CachingOptimized
- Origin request policy: CORS-S3Origin (si se necesita CORS)
- Compress objects automatically: Yes (Gzip, Brotli)

**Distribution settings**:
- Price class: Use all edge locations (o restricción regional si se desea)
- Alternate domain names (CNAMEs): domain.com, www.domain.com
- SSL certificate: ACM certificate en us-east-1
- Supported HTTP versions: HTTP/2, HTTP/1.1
- **Default root object: `index.html`**
- Standard logging: Opcional (habilitar para análisis)

**Invalidation strategy**:
- Assets con hash NO requieren invalidación (nueva versión = nuevo hash = nueva URL)
- `index.html` puede invalidarse cuando sea necesario con path `/index.html`
- Invalidación completa `/*` solo para casos excepcionales
- Costo: primeras 1000 invalidaciones/mes gratis, luego $0.005 por path

### Origin Access Control (OAC)

**Propósito**: Mecanismo seguro para que CloudFront acceda a S3 privado

**Configuración OAC**:
- Signing behavior: Sign requests (always)
- Origin type: S3

**Flujo de acceso**:
1. Usuario hace request a CloudFront
2. CloudFront firma request con credenciales temporales
3. CloudFront hace request firmado a S3
4. S3 valida firma contra política de bucket
5. Si válido, S3 responde a CloudFront
6. CloudFront responde a usuario

**Ventajas sobre OAI legacy**:
- Soporte para todas las regiones S3
- Mejor seguridad (AWS SigV4)
- Recomendado por AWS

**Seguridad**:
- S3 rechaza requests que NO vengan de CloudFront
- CloudFront es el único punto de acceso público
- No hay URLs públicas de S3 expuestas

### AWS Certificate Manager (ACM)

**Propósito**: Certificado SSL/TLS gratuito para HTTPS

**Configuración**:
- Región: **us-east-1** (obligatorio para CloudFront)
- Domain names: `domain.com`, `www.domain.com`
- Validation method: DNS validation (recomendado)

**Requisito crítico**: El certificado ACM que CloudFront utilizará para el custom domain DEBE crearse/importarse en **us-east-1**, independientemente de la región donde se encuentre el bucket S3. Este es un requisito no negociable de CloudFront.

**Proceso de validación**:
1. ACM genera CNAME records para validación
2. Agregar CNAMEs a Route 53
3. ACM valida propiedad del dominio
4. Certificado pasa a estado "Issued"
5. Renovación automática por AWS

---

## Request Flow

**Propósito**: DNS management para dominio custom

**Registros necesarios**:
- **A record** (Alias): `domain.com` → CloudFront distribution
- **A record** (Alias): `www.domain.com` → CloudFront distribution
- **CNAME records**: Para validación de ACM (temporal durante setup)

**Configuración de Alias record**:
- Record name: `domain.com` (o `www`)
- Record type: A - IPv4 address
- Alias: Yes
- Route traffic to: Alias to CloudFront distribution
- Distribution: [seleccionar distribución CloudFront]

**Nota**: Usar Alias records (no CNAME) para apex domain (`domain.com` sin `www`).

### Request Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. HTTPS request: https://domain.com
     ▼
┌──────────────────────────────────────────────────────────┐
│                      Route 53                             │
│  Resuelve domain.com → CloudFront distribution IP        │
└───────────────────────────┬──────────────────────────────┘
                            │ 2. DNS response
                            ▼
┌──────────────────────────────────────────────────────────┐
│                    CloudFront Edge                        │
│  - Verifica cache                                        │
│  - Si HIT: responde desde cache                          │
│  - Si MISS: forward a origin (S3)                        │
└───────────────────────────┬──────────────────────────────┘
                            │ 3. Signed request (OAC)
                            ▼
┌──────────────────────────────────────────────────────────┐
│                      S3 Bucket                            │
│  - Valida firma de CloudFront                            │
│  - Si válida: responde con objeto                        │
│  - Si inválida o sin firma: Access Denied                │
└───────────────────────────┬──────────────────────────────┘
                            │ 4. S3 response
                            ▼
┌──────────────────────────────────────────────────────────┐
│                    CloudFront Edge                        │
│  - Almacena en cache según Cache-Control headers        │
│  - Comprime si está habilitado                           │
│  - Aplica security headers si están configurados         │
└───────────────────────────┬──────────────────────────────┘
                            │ 5. HTTPS response
                            ▼
                      ┌──────────┐
                      │  User    │
                      └──────────┘
```

**Intento de acceso directo a S3**:
```
User → https://bucket.s3.amazonaws.com/index.html
  ↓
S3 valida request
  ↓
NO viene de CloudFront (no hay firma OAC válida)
  ↓
S3 responde: 403 Access Denied
```

### Caching Behavior

**index.html**:
- Cache-Control: `max-age=0, must-revalidate`
- CloudFront consulta S3 en cada request
- Asegura que siempre se sirve última versión

**Assets con hash (JS, CSS, images)**:
- Cache-Control: `max-age=31536000` (1 año)
- CloudFront cachea agresivamente
- Al cambiar contenido, Vite genera nuevo hash → nueva URL → cache no es problema

**Invalidaciones**:
- Necesarias solo si se modifica `index.html` o assets sin hash
- Assets con hash no requieren invalidación (nuevo hash = nueva URL)
- `index.html` puede invalidarse (path `/index.html`) cuando corresponda
- Invalidación `/*` solo en casos excepcionales con una razón concreta
- Propagación: 1-5 minutos

### Security Headers (Opcional, recomendado futuro)

Configurar mediante CloudFront Functions o Lambda@Edge:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Esto queda fuera del MVP manual pero es recomendado para producción.

---

## Security

### Principio Fundamental

**NUNCA almacenar secretos, credenciales o información sensible en el código fuente o repositorio.**

Esta es una landing page estática pública. Todo el contenido será visible en el código fuente del navegador.

### Frontend Security

**Contenido público aceptable**:
- Email profesional (ya es público)
- URL de LinkedIn (ya es público)
- Nombre, título, experiencia (contenido público)
- URLs de proyectos públicos

**NO incluir**:
- Claves API privadas
- Tokens de autenticación
- Credenciales AWS
- Información personal sensible no destinada a ser pública

**Enlaces externos**:
- Todos los enlaces externos usan `rel="noopener noreferrer"` para prevenir:
  - `window.opener` hijacking
  - Leakage de referrer innecesario
- Links a LinkedIn y proyectos externos abren en `target="_blank"`

**Validación TypeScript**:
- Type safety previene errores comunes
- Props requeridas aseguran que componentes reciben datos válidos
- No hay `any` implícitos

### AWS Security

**S3 Bucket**:
- ✅ Block all public access: ENABLED
- ✅ Bucket NO es público
- ✅ NO usar Static Website Hosting (hace bucket público)
- ✅ Acceso SOLO mediante CloudFront OAC
- ✅ Encryption at rest: SSE-S3
- ✅ Versioning: Opcional pero recomendado para rollback

**Bucket Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bucket-name/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::account-id:distribution/distribution-id"
        }
      }
    }
  ]
}
```

Esta política asegura que:
- Solo CloudFront puede leer objetos
- Solo la distribución específica puede acceder (validación por ARN)
- Acceso directo al bucket resulta en 403 Access Denied

**CloudFront**:
- ✅ HTTPS obligatorio (Redirect HTTP to HTTPS)
- ✅ TLS 1.2 mínimo
- ✅ Certificado SSL/TLS de ACM (gratuito, auto-renovable)
- ✅ Origin Access Control (OAC) - NO usar OAI legacy
- ✅ Compression habilitada (reduce tamaño de transferencia)

**IAM Permissions (Deployment)**:
- Principio de mínimo privilegio
- Usuario/Role de deployment solo necesita:
  - `s3:PutObject`, `s3:ListBucket` en bucket específico
  - `cloudfront:CreateInvalidation` en distribución específica
- NO dar permisos administrativos amplios

Ejemplo de política mínima:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::bucket-name",
        "arn:aws:s3:::bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::account-id:distribution/distribution-id"
    }
  ]
}
```

**ACM Certificate**:
- Certificado provisto por AWS (gratuito)
- Renovación automática por AWS
- Región us-east-1 obligatoria para CloudFront
- Validación DNS mediante Route 53

**Route 53**:
- DNSSEC: Opcional, habilitar si el TLD lo soporta
- Health checks: No necesarios para sitio estático simple

### Dependency Security

**npm audit**:
- Ejecutar regularmente: `npm audit`
- Actualizar dependencias con vulnerabilidades: `npm audit fix`
- Revisar dependencias antes de agregar nuevas

**Lock files**:
- Commitear `package-lock.json` en repositorio
- Usar `npm ci` en CI/CD (deterministic installs)

**Supply chain security**:
- Revisar dependencias antes de instalarlas
- Preferir paquetes bien mantenidos y populares
- Evitar dependencias con pocas descargas o mantenimiento inactivo

### Git Repository Security

**.gitignore**:
```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.production

# AWS credentials
.aws/
credentials

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

**Pre-commit hooks (opcional)**:
- Detectar secretos antes de commit
- Ejemplo: herramientas como `git-secrets` o `gitleaks`

**Nunca commitear**:
- ❌ Credenciales AWS
- ❌ Variables de entorno con información sensible
- ❌ Archivos de configuración con paths absolutos personales
- ❌ Build artifacts (`dist/`)

### Security Incident Response

**Si se comprometen credenciales AWS**:
1. Rotar inmediatamente en AWS Console
2. Revisar CloudTrail para acciones no autorizadas
3. Revisar facturación para recursos creados sin autorización
4. Eliminar recursos no autorizados
5. Investigar cómo se comprometieron las credenciales

**Si se descubre secret en git history**:
1. Rotar el secret inmediatamente
2. Usar `git-filter-repo` para limpiar historia
3. Force push (con precaución, coordinar con equipo)
4. Notificar a colaboradores para re-clonar

---

## Cost Analysis

### AWS Resources and Cost Drivers

**Recursos que generan costo**:

1. **S3 Storage**
   - Costo por GB almacenado
   - Requests (PUT, GET, LIST)

2. **CloudFront**
   - Data transfer out (mayor cost driver)
   - Requests (HTTP/HTTPS)

3. **Route 53**
   - Hosted zone (costo fijo mensual)
   - DNS queries

4. **ACM Certificate**
   - **GRATUITO** para certificados públicos

**Principal cost driver**: CloudFront data transfer out

### Workload Assumptions Needed for Detailed Estimation

Para calcular costos mensuales, se necesita:

1. **Tráfico esperado**:
   - Visitantes únicos por mes
   - Páginas vistas por visitante
   - Promedio de MB por página vista

2. **Distribución geográfica**:
   - % tráfico desde Norteamérica
   - % tráfico desde Europa
   - % tráfico desde otros continentes

3. **Assets size**:
   - Tamaño del bundle JS
   - Tamaño del bundle CSS
   - Tamaño de imágenes

4. **Cache hit ratio**:
   - CloudFront cache hit ratio (típicamente 80-90%)

### Qualitative Cost Analysis

**S3 Storage**:
- Costo muy bajo (< $1/mes)
- Landing completa probablemente < 50 MB
- Standard storage: ~$0.023 per GB/mes
- Estimación: **< $1/mes**

**S3 Requests**:
- Costo muy bajo
- GET requests solo cuando CloudFront hace fetch (cache misses)
- Estimación: **< $1/mes**

**CloudFront**:
- **Mayor cost driver**
- Data transfer out:
  - Primeros 10 TB/mes: $0.085 per GB (US/EU)
  - Requests: $0.0075 per 10,000 requests (HTTP)
- Estimación depende de tráfico:
  - **Low usage** (100 visitantes/mes): < $1/mes
  - **Expected usage** (1,000 visitantes/mes): $2-5/mes
  - **High usage** (10,000 visitantes/mes): $20-40/mes

**Route 53**:
- Hosted zone: $0.50/mes (fijo)
- Queries: primeros 1B queries: $0.40 per millón
- Estimación: **$1-2/mes**

**ACM Certificate**:
- **$0/mes** (gratuito para certificados públicos)

**Total estimado**:
- Low usage: **$2-5/mes**
- Expected usage: **$5-10/mes**
- High usage: **$20-50/mes**

**Nota**: Estos son estimados cualitativos. Antes del deployment a producción, se ejecutará el **cost gate** con datos de workload concretos y pricing actual mediante AWS Pricing MCP Server para obtener estimaciones precisas Low / Expected / High.

### Cost Optimizations

**Inmediatas**:
- Habilitar compresión en CloudFront (reduce data transfer)
- Configurar Cache-Control headers apropiados (maximiza cache hit ratio)
- Optimizar imágenes (WebP, compresión)
- Minificar JS/CSS (ya hecho por Vite)

**Futuras** (si el tráfico crece significativamente):
- Usar CloudFront price class regional si el público objetivo está concentrado geográficamente
- Considerar Savings Plan si el tráfico es predecible
- Implementar lazy loading de imágenes
- Code splitting para reducir bundle inicial

### Free Tier Considerations

**AWS Free Tier** (primeros 12 meses de cuenta nueva):
- CloudFront: 1 TB data transfer out, 10M requests
- S3: 5 GB storage, 20,000 GET requests, 2,000 PUT requests
- Route 53: NO incluido en Free Tier

**Importante**: La estimación de costos se basa en **pricing on-demand completo**, NO en Free Tier. Free Tier es temporal y no debe influir en decisiones arquitectónicas.

### Cost Monitoring

**Recomendaciones**:
- Configurar AWS Budget alerts
- Configurar CloudWatch alarms en costos
- Revisar facturación mensualmente
- Configurar alertas si el gasto supera $10/mes (o threshold personalizado)

---

## Design Trade-offs

### Frontend Framework: React vs Alternatives

**Decisión**: React + TypeScript + Vite

**Alternativas consideradas**:

1. **HTML/CSS/JS vanilla**
   - ✅ Más ligero, carga más rápida
   - ✅ No hay overhead de framework
   - ❌ Mantenibilidad: mucho código repetitivo
   - ❌ No hay componentización
   - ❌ Difícil escalar si se agregan secciones

2. **Astro**
   - ✅ Optimizado para sitios estáticos
   - ✅ Renderizado SSG, mínimo JavaScript
   - ✅ Puede usar componentes React si se necesita
   - ❌ Curva de aprendizaje adicional
   - ❌ Comunidad más pequeña
   - ❌ Overhead de aprendizaje para actualizaciones futuras

**Justificación de React**:
- Componentización clara
- Ecosistema maduro
- TypeScript integration excelente
- Fácil agregar interactividad en futuro (ej: filtros en proyectos)
- Conocimiento común en la industria (facilita colaboración)
- Overhead de React es aceptable para este caso de uso

### Styling: CSS Modules vs Tailwind

**Decisión**: CSS Modules + global.css

**Alternativas consideradas**:

1. **Tailwind CSS**
   - ✅ Desarrollo rápido con utility classes
   - ✅ No pensar en nombres de clases
   - ❌ HTML verboso (muchas clases en cada elemento)
   - ❌ Dependencia adicional
   - ❌ Curva de aprendizaje
   - ❌ Dificultad para mantenimiento de diseño consistente sin disciplina

2. **Styled-components / Emotion**
   - ✅ CSS-in-JS, scoping automático
   - ✅ Props dinámicas fáciles
   - ❌ Runtime overhead
   - ❌ Dependencia adicional
   - ❌ Aumenta bundle size
   - ❌ SSR complexity (no necesario aquí, pero podría serlo en futuro)

**Justificación de CSS Modules**:
- Scoping automático sin runtime overhead
- CSS estándar (transferible, sin lock-in)
- No aumenta bundle JS
- Facilita theme management con CSS custom properties
- Sin dependencias adicionales
- Performance óptimo

### Routing: Single Page vs React Router

**Decisión**: Single page sin React Router

**Alternativa considerada**:

1. **React Router**
   - ✅ URLs diferentes para cada sección
   - ✅ Navegación mediante rutas
   - ❌ Complejidad innecesaria para una landing page
   - ❌ Dependencia adicional
   - ❌ Los requisitos NO demandan routing

**Justificación de single page**:
- Requisitos solo requieren navegación entre secciones
- Smooth scroll es suficiente y más simple
- No hay necesidad de URLs distintas para cada sección
- Menor complejidad
- Menor bundle size

### AWS: S3 Private + CloudFront OAC vs S3 Website Hosting

**Decisión**: S3 Private + CloudFront con Origin Access Control

**Alternativa considerada**:

1. **S3 Static Website Hosting**
   - ✅ Más simple de configurar
   - ✅ No necesita CloudFront
   - ❌ Bucket debe ser público
   - ❌ No hay HTTPS nativo (requiere CloudFront de todas formas)
   - ❌ No hay CDN (latencia global alta)
   - ❌ No hay caching en edge

**Justificación de CloudFront + OAC**:
- **Seguridad**: Bucket permanece privado
- **Performance**: CDN global, caching en edge locations
- **HTTPS**: Terminación SSL/TLS en CloudFront
- **Costo**: Ligeramente mayor, pero justificado por seguridad y performance
- **Best practice**: Recomendado por AWS para sitios públicos

### Deployment: Manual vs IaC (Terraform/CDK)

**Decisión**: Primer deployment MANUAL, IaC en futuras iteraciones

**Alternativa considerada**:

1. **Infrastructure as Code desde MVP**
   - ✅ Reproducibilidad automática
   - ✅ Versionado de infraestructura
   - ✅ Facilita múltiples ambientes
   - ❌ Curva de aprendizaje de Terraform/CDK
   - ❌ Tiempo adicional de desarrollo
   - ❌ Complejidad prematura para MVP

**Justificación de deployment manual**:
- **Aprendizaje**: Comprender cada servicio AWS manualmente antes de automatizar
- **MVP scope**: Desplegar una vez, iterar contenido
- **Simplicidad**: No agregar complejidad hasta que sea necesaria
- **Futuro**: IaC se agregará cuando haya necesidad de múltiples ambientes o deployments frecuentes

---

## Risks and Mitigations

### Risk 1: Bundle Size Excesivo

**Descripción**: El bundle de JavaScript puede crecer y afectar tiempo de carga.

**Probabilidad**: Media
**Impacto**: Alto (afecta performance, SEO, experiencia de usuario)

**Mitigación**:
- Vite ya minifica y optimiza
- Evitar agregar librerías pesadas innecesarias
- Medir bundle size después del build: `npm run build` muestra tamaños
- Si el bundle excede 200-300 KB (gzipped), considerar code splitting
- Lighthouse audit identificará problemas de performance

**Indicador**: Si Lighthouse Performance score < 80, investigar bundle size.

### Risk 2: Contenido Profesional Desactualizado

**Descripción**: El contenido del profesional (experiencia, proyectos, certificaciones) puede quedar desactualizado.

**Probabilidad**: Alta
**Impacto**: Medio (afecta credibilidad profesional)

**Mitigación**:
- Contenido está desacoplado en `content/es.ts`
- Actualizaciones son simples: modificar archivo, rebuild, deploy
- Establecer proceso de revisión trimestral del contenido
- Documentar proceso de actualización en README

**Indicador**: Revisar contenido cada 3-6 meses.

### Risk 3: Bucket S3 Expuesto Accidentalmente

**Descripción**: Error en configuración podría hacer el bucket público.

**Probabilidad**: Baja (si se siguen instrucciones)
**Impacto**: Alto (contenido accesible sin CloudFront, bypass de CDN)

**Mitigación**:
- **Block all public access** debe estar habilitado en S3
- Política de bucket solo permite acceso desde CloudFront OAC
- Verificar después de configuración inicial: intentar acceso directo a URL de S3
- Usar AWS Config rules para detectar buckets públicos (opcional, avanzado)

**Indicador**: Intentar `curl https://bucket.s3.amazonaws.com/index.html` debe resultar en Access Denied.

### Risk 4: Cache de CloudFront Durante Actualizaciones

**Descripción**: Después de deployment, usuarios pueden seguir viendo versión antigua en cache.

**Probabilidad**: Media (si no se maneja cache correctamente)
**Impacto**: Medio (confusión, contenido desactualizado visible)

**Mitigación**:
- Assets con hash (JS, CSS) NO requieren invalidación (nuevo hash = nueva URL automática)
- `index.html` tiene `max-age=0` pero puede requerir invalidación ocasional
- Invalidar `/index.html` cuando sea necesario, no siempre `/*`
- Documentar proceso de invalidación en deployment checklist

**Indicador**: Después de deploy, verificar que cambios son visibles en navegación incognito.

### Risk 5: Experiencia Responsive/Accesibilidad Insuficiente

**Descripción**: Diseño puede no funcionar bien en móvil o no ser accesible.

**Probabilidad**: Media
**Impacto**: Alto (afecta experiencia de usuarios móviles y usuarios con discapacidades)

**Mitigación**:
- Testing estructurado en múltiples viewports durante desarrollo
- Usar design tokens y media queries consistentes
- Lighthouse audit identificará problemas de accesibilidad
- Testing manual con navegación por teclado
- Verificar contraste de colores con herramientas de DevTools

**Indicador**: Lighthouse Accessibility score > 90.

### Risk 6: Costos AWS Inesperados

**Descripción**: Tráfico alto inesperado o configuración incorrecta pueden generar costos elevados.

**Probabilidad**: Baja
**Impacto**: Medio (gasto financiero inesperado)

**Mitigación**:
- Configurar AWS Budget alerts ANTES de deployment
- Configurar CloudWatch alarms en costos
- Monitorear facturación mensualmente
- Para MVP, tráfico será bajo (costos < $10/mes esperados)
- Compresión y caching reducen data transfer (principal cost driver)

**Indicador**: Configurar alerta si gasto mensual > $20 (2x expected usage).

### Risk 7: Certificado ACM No Validado

**Descripción**: Si el certificado ACM no se valida correctamente, HTTPS no funcionará.

**Probabilidad**: Baja (si se siguen pasos de validación DNS)
**Impacto**: Alto (sitio no accesible vía HTTPS)

**Mitigación**:
- Seguir proceso de validación DNS en ACM
- Verificar que CNAMEs de validación estén agregados a Route 53
- Esperar a que certificado esté en estado "Issued" antes de configurar CloudFront
- Proceso de validación toma 5-30 minutos típicamente

**Indicador**: Estado del certificado en ACM Console debe ser "Issued".

---

## Summary

### Arquitectura Propuesta

**Frontend**:
- React 18+ con TypeScript
- Vite como build tool
- CSS Modules para estilos específicos + global.css para tokens
- Contenido desacoplado en `content/es.ts`
- Single page application con smooth scroll navigation
- No se usa React Router, Redux, Tailwind, ni UI libraries

**AWS (Futuro)**:
- S3 bucket privado para almacenamiento
- CloudFront con Origin Access Control para CDN y HTTPS
- ACM para certificado SSL/TLS (gratuito)
- Route 53 para DNS management
- Deployment manual inicial, IaC en futuras iteraciones

### Componentes Principales y Responsabilidades

**App.tsx**: Orquesta la estructura general con Navigation y main

**Navigation (`src/components/Navigation/`)**:
- `Navigation`: Menú de navegación con smooth scroll, separado del main

**Components (`src/components/`)**:
- Directorio para componentes compartidos que se crean según necesidad real
- Evitar abstracciones anticipadas
- Candidatos posibles: SectionTitle, Badge (crear si/cuando se necesiten)

**Sections (`src/sections/`)**:
- `Hero`: Sección principal con nombre, título, CTAs
- `About`: Biografía profesional
- `Expertise`: Áreas de expertise con estructura visual clara
- `Experience`: Experiencia profesional en orden cronológico inverso
- `Projects`: Proyectos destacados presentados con claridad
- `Certifications`: Certificaciones y educación
- `Services`: Servicios profesionales ofrecidos
- `Contact`: Información de contacto (LinkedIn, email)

**Content (`src/content/es.ts`)**:
- Módulo TypeScript con todo el contenido profesional
- Fuertemente tipado
- Desacoplado de componentes UI
- Preparado para expansión a `en.ts` en futuro

**Styles**:
- `global.css`: Reset, tipografía, design tokens (CSS custom properties)
- `*.module.css`: Estilos específicos de cada componente/sección

### Decisiones Nuevas Introducidas

1. **No usar React Router**: Navegación mediante smooth scroll, no mediante rutas. Suficiente para requisitos actuales.

2. **Single page sin routing complejo**: Todas las secciones en una página, navegación mediante IDs de sección.

3. **Design tokens en CSS custom properties**: Colores, spacing, tipografía definidos en `:root` para fácil theming futuro.

4. **Estructura de content preparada para i18n**: `content/es.ts` es el módulo MVP, estructura permite agregar `content/en.ts` sin refactoring.

5. **Testing manual estructurado en MVP**: No tests automatizados en MVP; se usa TypeScript compile-time checking, Lighthouse audit, y testing manual estructurado. Tests automatizados se agregan si la complejidad crece.

6. **Cache strategy diferenciada**: `index.html` con `max-age=0`, assets con hash con `max-age=31536000` (inmutable caching).

7. **Invalidación de CloudFront selectiva**: Assets con hash no requieren invalidación; `index.html` se revalida o se invalida (`/index.html`) cuando corresponda; `/*` solo en casos excepcionales.

### Desviaciones respecto de requirements.md

**Ninguna desviación de requisitos funcionales.**

Todos los 17 requisitos funcionales y no funcionales están cubiertos en el diseño:
- ✅ Hero, About, Expertise, Experience, Projects, Certifications, Services, Contact sections
- ✅ Navegación entre secciones
- ✅ Responsive design (móvil, tablet, desktop)
- ✅ LinkedIn y email contact
- ✅ Contenido en español con preparación para inglés futuro
- ✅ Semantic HTML y SEO
- ✅ Accesibilidad
- ✅ Performance optimization
- ✅ TypeScript para mantenibilidad
- ✅ Build y deployment readiness
- ✅ Seguridad (S3 privado, HTTPS, no secrets en código)

**Aclaraciones de implementación**:
- **Requirement 2 (Navigation)**: Implementado con smooth scroll, NO con React Router (decisión de diseño simplificadora)
- **Requirement 13 (Performance)**: Lighthouse se usa para auditoría, pero targets numéricos específicos se definen post-build como se especifica en requisitos
- **Testing**: Se usa estrategia de testing estructurado pero manual en MVP según principio de simplicidad

### Riesgos Relevantes

1. **Bundle size excesivo**: Mitigado con Vite optimization, evitar dependencias pesadas, Lighthouse audit
2. **Contenido desactualizado**: Mitigado con desacoplamiento en `content/es.ts`, proceso de revisión trimestral
3. **Bucket S3 expuesto**: Mitigado con Block Public Access, política restrictiva, verificación post-deployment
4. **Cache de CloudFront**: Mitigado con hash-based assets, cache corta/revalidación de `index.html` e invalidación puntual de `/index.html` cuando corresponda
5. **Responsive/Accesibilidad insuficiente**: Mitigado con testing estructurado, Lighthouse audit
6. **Costos AWS inesperados**: Mitigado con Budget alerts, monitoreo mensual
7. **Certificado ACM no validado**: Mitigado con validación DNS correcta, verificación de estado "Issued"

---

**Diseño completado. Esperando aprobación para proceder a generación de tasks.md.**
