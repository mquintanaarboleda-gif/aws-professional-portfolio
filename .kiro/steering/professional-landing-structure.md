---
inclusion: fileMatch
fileMatchPattern: ["src/**", "public/**", "index.html", "package.json", "vite.config.ts", "tsconfig*.json", ".kiro/specs/professional-landing-page/**"]
---

# Professional Landing Page - Project Structure

> Fuente de verdad: `.kiro/specs/professional-landing-page/requirements.md`, `design.md` y `tasks.md` aprobados. Si este archivo contradice esos documentos, prevalecen los documentos aprobados.

## Directory Organization

Estructura conceptual aprobada (raíz del repositorio):

```
./
├── public/                  # Assets estáticos servidos as-is (ej: favicon)
├── src/
│   ├── components/          # Componentes compartidos, solo cuando exista necesidad real
│   │   └── Navigation/      # Navegación principal, cuando corresponda
│   ├── sections/            # Secciones de contenido de la landing
│   ├── content/             # Contenido profesional desacoplado (es.ts)
│   ├── types/               # Definiciones TypeScript (ej: content.ts)
│   ├── assets/              # Assets importados por componentes
│   ├── styles/              # Estilos globales (global.css)
│   ├── App.tsx              # Componente raíz
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

No introducir carpetas adicionales (`utils/`, `helpers/`, `services/`, `hooks/`, etc.) sin una necesidad concreta.

## Page Structure

```
App
├── Navigation
├── main
│   ├── Hero
│   ├── About
│   ├── Expertise
│   ├── Experience
│   ├── Projects
│   ├── Certifications (incluye Education)
│   ├── Services
│   └── Contact
└── Footer (solo si aporta contenido útil)
```

Navigation NO es una content section: se renderiza fuera de `<main>`.

## Component Organization

### Shared components (`src/components/`)

**Regla**: crear un componente compartido únicamente cuando exista reutilización real o una responsabilidad transversal clara. Evitar abstracciones anticipadas.

- No crear por adelantado componentes genéricos (Button, Card, Section, ContactLink u otros).
- Un patrón repetido en varias secciones, o una responsabilidad que cruza secciones, justifica extraer un componente.
- Candidatos posibles (no obligatorios): por ejemplo un `SectionTitle`, si varias secciones comparten exactamente el mismo formato de título.
- Navigation vive en `components/Navigation/` cuando corresponda, separada de las content sections.

**Características**:
- Props tipadas con TypeScript
- Estilos en CSS Modules (`ComponentName.module.css`)

### Sections (`src/sections/`)

Secciones de contenido de la landing, montadas dentro de `<main>` en `App.tsx`.

- `Hero`: nombre, rol profesional, propuesta de valor
- `About`: introducción profesional
- `Expertise`: áreas principales de expertise
- `Experience`: experiencia profesional en orden cronológico inverso
- `Projects`: proyectos destacados, presentados con claridad
- `Certifications`: certificaciones y formación académica, distinguidas visualmente
- `Services`: servicios profesionales
- `Contact`: LinkedIn y email

**Características**:
- Obtienen su contenido de `src/content/es.ts`
- Usan componentes compartidos solo cuando existan
- Estilos específicos en CSS Modules
- La presentación visual concreta (lista, grid, timeline, etc.) se decide durante la implementación según el contenido real y el diseño visual; no está prescrita

## Content Management

### Content Structure (`src/content/es.ts`)

El contenido profesional vive separado de los componentes para facilitar actualizaciones y la futura incorporación de `en.ts` sin reestructuración significativa de la UI.

- Las interfaces viven en `src/types/content.ts`
- `es.ts` contiene únicamente información real aprobada por el profesional (fuente de contenido original mantenida fuera de este repositorio público)
- NO inventar experiencia, logros, proyectos, tecnologías, certificaciones, servicios ni métricas

**Ejemplo de patrón** (solo estructura, sin contenido real):
```typescript
// src/types/content.ts
export interface HeroContent {
  name: string;
  title: string;
  tagline: string;
}

// src/content/es.ts
import type { HeroContent } from '../types/content';

export const heroContent: HeroContent = {
  // valores tomados de profile-source.md aprobado
};

// src/sections/Hero/Hero.tsx
import { heroContent } from '../../content/es';
import styles from './Hero.module.css';

export const Hero = () => (
  <section id="hero" className={styles.hero}>
    <h1>{heroContent.name}</h1>
  </section>
);
```

## Styling Conventions

### Global Styles (`src/styles/global.css`)

**Contenido apropiado**:
- CSS reset mínimo
- Tipografía base
- Design tokens como CSS custom properties (spacing, breakpoints documentados, estructura de color/tipografía)
- Reglas verdaderamente globales (body, html, links base, estilos de foco)

**NO incluir**:
- Estilos específicos de componentes o secciones
- Layouts complejos
- Estilos que solo se usan en un lugar
- Branding, colores finales o fuentes específicas no aprobados

### Component Styles (CSS Modules)

Cada componente/sección tiene su propio `.module.css` que consume los design tokens globales:
```css
/* Hero.module.css */
.hero {
  padding: var(--spacing-lg) var(--spacing-md);
}
```

## Naming Conventions

### Files
- Components / sections: PascalCase (`Hero.tsx`, `Navigation.tsx`)
- CSS Modules: PascalCase con `.module.css` (`Hero.module.css`)
- Content files: lowercase (`es.ts`, `en.ts` futuro)
- Types: lowercase (`content.ts`)

### TypeScript
- Interfaces: PascalCase con sufijo descriptivo (`HeroContent`, `ExpertiseArea`)
- Props interfaces: `ComponentNameProps`

### CSS Classes
- Convención BEM-like dentro de CSS Modules:
  - Block: `.hero`
  - Element: `.hero__title`
  - Modifier: `.hero--compact`

### Variables
- CSS custom properties: kebab-case con prefijo semántico (`--color-text`, `--spacing-md`)
- TypeScript: camelCase (`heroContent`, `expertiseAreas`)

## Responsibilities

### Components
- Responsabilidad única
- Props tipadas
- Presentacionales, sin lógica de negocio

### Sections
- Definen la estructura y el layout de cada sección
- Renderizan el contenido de `content/`

### Content
- Solo datos, sin lógica
- Tipado con interfaces TypeScript
- Actualizable sin tocar componentes

### Styles
- Global: solo lo verdaderamente global
- Modules: estilos específicos de componentes/secciones

## Import Conventions

### Orden de imports
```typescript
// 1. External libraries
import { StrictMode } from 'react';

// 2. Internal components (cuando existan)
import { Navigation } from '../components/Navigation/Navigation';

// 3. Content
import { heroContent } from '../../content/es';

// 4. Types
import type { HeroContent } from '../../types/content';

// 5. Styles
import styles from './Hero.module.css';
```

## File Size Guidelines

- Components: idealmente < 200 líneas
- Sections: hasta 300-400 líneas es aceptable
- CSS Modules: idealmente < 150 líneas

Si un archivo crece demasiado, considerar dividirlo cuando la división simplifique el código.

## Extensibility

### Internacionalización (sin implementar aún)
- `src/content/es.ts` ✅ MVP
- `src/content/en.ts` ⏳ candidato futuro, junto con el selector de idioma
- Agregar un segundo idioma NO debe requerir reestructuración significativa de los componentes UI

### Nuevas secciones
- Agregar carpeta en `sections/`
- Agregar contenido en `content/es.ts`
- Montar en `App.tsx`

## What NOT to do

- ❌ No mezclar contenido profesional hardcodeado en componentes
- ❌ No crear componentes genéricos por adelantado
- ❌ No tratar Navigation como una content section
- ❌ No crear carpetas `utils/`, `helpers/`, `services/` innecesarias
- ❌ No crear "arquitectura por capas" compleja para una landing estática
- ❌ No ignorar TypeScript (no usar `any` sin justificación)
