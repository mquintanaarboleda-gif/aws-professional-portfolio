# Implementation Plan: Professional Landing Page

## Overview

Este plan de implementación convierte el diseño aprobado de la landing page profesional en una secuencia ordenada y verificable de tareas de desarrollo. La arquitectura utiliza React + TypeScript + Vite para crear una aplicación web estática que presenta la experiencia profesional de un Solution Architect / Cloud Architect.

**Principio fundamental**: Implementar únicamente lo aprobado en requirements.md y design.md, sin agregar abstracciones anticipadas, tecnologías o dependencias no justificadas.

**Secuencia de ejecución**: Las tasks se ejecutan secuencialmente, una por una, por un usuario trabajando en Kiro. No se incluye planificación de paralelismo.

---

## PHASE 1 — Project Scaffolding

- [x] 1. Initialize project and verify scaffolding
  - Ejecutar `npm create vite@latest projects/professional-landing-page -- --template react-ts`
  - Instalar dependencias con `npm install`
  - Eliminar boilerplate innecesario (README de ejemplo, `assets/react.svg`, contenido de ejemplo en `App.tsx`/`App.css`)
  - Verificar que `npm run dev` inicia sin errores y que `npm run build` genera `dist/`
  - NO modificar `vite.config.ts` en este punto; usar la configuración default de Vite salvo que surja una necesidad concreta más adelante (si surge, debe justificarse explícitamente antes de modificarlo)
  - _Requirements: Requirement 17 (Build and Deployment Readiness), Technical Constraints_

---

## PHASE 2 — Base Architecture

- [x] 2. Create directory structure
  - Crear dentro de `projects/professional-landing-page/src/`:
    - `components/` (componentes compartidos; crear subcarpetas como `Navigation/` solo cuando corresponda, sin anticipar reutilización que no existe)
    - `sections/` (secciones de contenido)
    - `content/` (contenido desacoplado)
    - `types/` (definiciones TypeScript)
    - `assets/` (assets importados por componentes)
    - `styles/` (estilos globales)
  - _Requirements: Requirement 12 (Internationalization Preparation), Requirement 16 (Code Maintainability)_

- [x] 3. Set up App.tsx with semantic scaffold
  - Implementar estructura HTML5 semántica básica: elemento de navegación y `<main>` contenedor
  - NO implementar secciones de contenido todavía, solo la estructura contenedora vacía
  - _Requirements: Requirement 1 (Hero Section), Requirement 14 (Semantic HTML and SEO)_

---

## ⚠️ CHECKPOINT HUMANO — Professional Content Source

- [x] 4. Create and obtain approval for profile-source.md
  - Crear `projects/professional-landing-page/content/profile-source.md` con la fuente de verdad del contenido profesional: identidad, propuesta de valor, about, áreas de expertise, experiencia profesional, proyectos destacados, certificaciones, educación, servicios, LinkedIn URL, email de contacto
  - NO inventar contenido profesional
  - Este archivo debe quedar aprobado por el usuario antes de avanzar a PHASE 3
  - El scaffolding técnico de PHASE 1-2 no depende de este contenido y puede completarse antes

---

## PHASE 3 — Content Model + Content Integration

⚠️ **Prerequisito**: `profile-source.md` aprobado (Task 4)

- [x] 5. Define TypeScript interfaces for content structure
  - Crear `src/types/content.ts` con las interfaces definidas en el diseño: `HeroContent`, `AboutContent`, `ExpertiseArea`, `ExperienceEntry`, `Project`, `Certification`, `Education`, `Service`, `ContactInfo`, `NavigationItem`, `ContentStructure`
  - _Requirements: Requirement 16 (Code Maintainability), Requirement 12_

- [x] 6. Create src/content/es.ts with real approved content
  - Transformar el contenido de `profile-source.md` hacia `src/content/es.ts`, tipado según `types/content.ts`
  - NO inventar experiencia, logros, proyectos, tecnologías, certificaciones, servicios o métricas que no estén en `profile-source.md`
  - Verificar que el contenido satisface las interfaces sin errores de tipo
  - _Requirements: Requirement 1, Requirement 3, Requirement 4, Requirement 5, Requirement 6, Requirement 7, Requirement 8, Requirement 9, Requirement 11_

---

## PHASE 4 — Visual Foundation

- [x] 7. Implement global styles and accessibility foundation
  - Crear `src/styles/global.css` con reset mínimo, tipografía base, design tokens estructurales (spacing scale, breakpoints documentados en comentarios: móvil <768px, tablet 768-1023px, desktop ≥1024px) y variables de color/tipografía como estructura (sin fijar branding, paleta final ni fuentes definitivas; esos valores se definen cuando exista dirección visual aprobada)
  - Implementar estilos de foco visibles globalmente (`:focus-visible`) para navegación por teclado
  - Importar `global.css` en `main.tsx`
  - _Requirements: Requirement 10 (Responsive Design), Requirement 15 (Accessibility), Requirement 16_

---

## PHASE 5 — Page Implementation

- [x] 8. Implement Navigation, Hero and About sections
  - Navigation: menú con links a las secciones principales, smooth scroll al hacer click, HTML semántico (`<nav>`, `<ul>`, `<li>`). La navegación debe ser responsive, simple y accesible; el patrón visual concreto para móvil (hamburguesa u otra solución) se decide durante la implementación según diseño visual y necesidad real, sin obligación de usar un menú hamburguesa
  - Hero: nombre, título, tagline y CTAs según diseño, con heading semántico apropiado (h1), visible above-the-fold
  - About: heading y párrafos de biografía con HTML semántico
  - Todas importan su contenido correspondiente de `content/es.ts`
  - _Requirements: Requirement 1 (Hero Section), Requirement 2 (Navigation Between Sections), Requirement 10, Requirement 14, Requirement 15_

- [x] 9. Implement Expertise and Experience sections
  - Expertise: lista o grid de áreas de expertise con título y descripción, agrupadas lógicamente, con jerarquía visual
  - Experience: entradas en orden cronológico inverso, mostrando empresa, rol, período, resumen y logros
  - Ambas con layout responsive según viewport
  - _Requirements: Requirement 3 (Expertise Display), Requirement 4 (Professional Experience Display), Requirement 10, Requirement 14_

- [x] 10. Implement Projects and Certifications/Education sections
  - Projects: presentar cada proyecto con nombre, descripción y tecnologías; incluir link externo con `rel="noopener noreferrer"` y `target="_blank"` donde exista `url`. La presentación visual (grid, lista u otra) debe responder correctamente en distintos viewports, sin obligación de usar un patrón de grid específico salvo que esté aprobado en requirements.md/design.md
  - Certifications/Education: certificaciones con emisor, fechas y verification URL cuando existan; educación académica distinguida visualmente de las certificaciones
  - _Requirements: Requirement 5 (Featured Projects Display), Requirement 6 (Certifications and Education Display), Requirement 10, Requirement 14_

- [x] 11. Implement Services and Contact sections
  - Services: lista de servicios con nombre y descripción, usando jerarquía visual si existen categorías
  - Contact: link a LinkedIn con `rel="noopener noreferrer"` y `target="_blank"`, mailto link para email, ambos con labels o iconos claros
  - _Requirements: Requirement 7 (Services Display), Requirement 8 (LinkedIn Access), Requirement 9 (Email Contact), Requirement 14, Requirement 15_

- [x] 12. Wire all sections into App.tsx
  - Importar y renderizar todas las secciones en orden dentro de `<main>`: Hero, About, Expertise, Experience, Projects, Certifications, Services, Contact
  - Asegurar que cada sección tiene un `id` apropiado para que la navegación funcione
  - Verificar que el smooth scroll de Navigation llega correctamente a cada sección
  - _Requirements: Requirement 2, Requirement 14_

---

## PHASE 6 — Responsive + Accessibility

- [x] 13. Verify and refine responsive behavior
  - Probar en Chrome DevTools con viewports: 375px (móvil), 768px (tablet), 1440px (desktop)
  - Verificar que no hay scroll horizontal en ningún viewport
  - Verificar que todos los touch targets son ≥44x44px en móvil
  - Ajustar CSS Modules de las secciones y Navigation según sea necesario
  - _Requirements: Requirement 10 (Responsive Design)_

- [x] 14. Verify keyboard navigation, focus and contrast
  - Probar navegación completa con teclado (Tab, Enter) en todos los elementos interactivos
  - Verificar que los indicadores de foco son visibles
  - Verificar contraste de color adecuado (WCAG AA mínimo) con herramientas de DevTools
  - Verificar que el HTML es semántico y agregar ARIA labels únicamente donde el HTML semántico no sea suficiente
  - _Requirements: Requirement 15 (Accessibility)_

---

## PHASE 7 — SEO

- [x] 15. Implement SEO meta tags and verify markup
  - Configurar `<html lang="es">`, `<title>`, meta description y Open Graph tags básicos (og:title, og:description, og:type) en `index.html`
  - Verificar jerarquía de headings correcta (h1 único, sin saltos de nivel)
  - Agregar alt text apropiado para imágenes significativas y `alt=""` para imágenes decorativas
  - _Requirements: Requirement 11 (Spanish Content Language), Requirement 14 (Semantic HTML and SEO), Requirement 15_

---

## PHASE 8 — Verification

- [x] 16. Run type checking and production build
  - Ejecutar `npm run type-check` (`tsc --noEmit`) y resolver cualquier error de tipos, sin `any` implícitos
  - Ejecutar `npm run build` y verificar que completa sin errores ni warnings críticos
  - Verificar que `dist/index.html` existe junto con assets optimizados y minificados
  - _Requirements: Requirement 13 (Performance), Requirement 16 (Code Maintainability), Requirement 17 (Build and Deployment Readiness)_

- [x] 17. Perform functional, responsive, accessibility and Lighthouse review
  - Servir el build con `npm run preview` y verificar navegación, smooth scroll, link a LinkedIn (nueva tab, `rel="noopener noreferrer"`) y mailto link
  - Repetir verificación responsive en Chrome, Firefox, Safari (desktop) y Safari iOS (mobile)
  - Ejecutar Lighthouse (Desktop y Mobile) desde Chrome DevTools y revisar Performance, Accessibility, Best Practices, SEO, sin exigir un threshold numérico obligatorio
  - Documentar cualquier problema crítico encontrado
  - _Requirements: Requirement 2, Requirement 8, Requirement 9, Requirement 10, Requirement 13, Requirement 14, Requirement 15_
  - **Evidencia de cierre**: el entorno de ejecución de Kiro no tiene navegador real instalado (sin Chrome/Firefox/Safari, sin binario de Chromium para Lighthouse/Playwright), por lo que la verificación cross-browser y de Lighthouse no pudo ejecutarse ni simularse desde este entorno. Esta task se cierra con **validación manual humana** (realizada directamente por el usuario en su propio navegador, fuera de este entorno), quien confirmó: navegación interna, responsive, enlaces externos, mailto, teléfono, comportamiento visual general, y ausencia de problemas críticos visibles. No se ejecutó Lighthouse como parte de esta evidencia (no fue reportado por el usuario como validado); si se requiere esa auditoría específica, queda pendiente de una corrida posterior en un entorno con Chrome DevTools disponible.

---

## PHASE 9 — AWS Deployment Preparation

⚠️ **Importante**: NO desplegar AWS en esta fase. Solo documentación de preparación.

- [x] 18. Create AWS deployment checklist document
  - Crear `projects/professional-landing-page/AWS_DEPLOYMENT.md` con checklist basado en el diseño aprobado:
    - S3 bucket privado (Block Public Access: ON), sin Static Website Hosting
    - CloudFront como punto de acceso público, con Origin Access Control (OAC)
    - Default Root Object: `index.html`
    - Certificado ACM en us-east-1 (obligatorio para CloudFront), validado por DNS
    - Route 53 con registros Alias hacia CloudFront
    - HTTPS obligatorio (Redirect HTTP to HTTPS)
    - Verificación de que el acceso directo a S3 resulta en Access Denied
    - Estrategia de caching: assets versionados/con hash con cache de larga duración y normalmente sin invalidación; `index.html` con cache corta/revalidación e invalidación puntual cuando corresponda; invalidación `/*` NO como práctica normal, solo para casos excepcionales
  - El primer deployment (creación y configuración de recursos) será MANUAL con fines de aprendizaje; AWS CLI puede mencionarse únicamente como alternativa posterior, no como requisito del primer deployment
  - _Requirements: Requirement 17, Technical Constraints (Deployment Target)_

---

## PHASE 10 — Production Deployment (Future)

⚠️ **NO ejecutar en esta sesión. Esta fase permanece bloqueada.**

Esta fase queda pendiente para el futuro y requiere, en orden:

1. Verification completa (PHASE 8) finalizada y sin problemas críticos abiertos
2. **Cost Gate**: estimación de costos AWS mensuales (Low / Expected / High usage) basada en workload real, usando precios actuales de AWS
3. Revisión de la estimación de costos y de la arquitectura
4. Aprobación humana explícita para desplegar a producción

Cuando se ejecute, seguir el checklist documentado en PHASE 9 (Task 18).

---

## Notes

- Las tasks siguen estrictamente requirements.md y design.md aprobados; no se introducen tecnologías, dependencias o funcionalidades adicionales (Router, Redux, Tailwind, UI libraries, hamburger menu obligatorio, grid obligatorio para Projects, etc.)
- El patrón de navegación móvil y la presentación visual de Projects se decidirán durante la implementación, respetando los requisitos de responsive design y accesibilidad, sin un patrón visual prescrito de antemano
- `vite.config.ts` se mantiene en su configuración default salvo necesidad concreta justificada; el build debe seguir generando `dist/`
- El contenido profesional NO debe inventarse; se integra desde `profile-source.md` (Task 4) hacia `content/es.ts` (Task 6)
- El checkpoint humano (Task 4) bloquea PHASE 3 en adelante, pero no bloquea PHASE 1-2 (scaffolding técnico)
- Testing es manual y estructurado; no se implementan tests automatizados en este MVP
- AWS deployment (PHASE 9) es preparación documental únicamente; la ejecución real (PHASE 10) requiere cost gate y aprobación humana explícita, y permanece bloqueada
- Cada task indica los Requirements relevantes de requirements.md para trazabilidad
- El Task Dependency Graph refleja ejecución estrictamente secuencial (una task por wave, en orden), sin planificación de paralelismo

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2"] },
    { "id": 2, "tasks": ["3"] },
    { "id": 3, "tasks": ["4"] },
    { "id": 4, "tasks": ["5"] },
    { "id": 5, "tasks": ["6"] },
    { "id": 6, "tasks": ["7"] },
    { "id": 7, "tasks": ["8"] },
    { "id": 8, "tasks": ["9"] },
    { "id": 9, "tasks": ["10"] },
    { "id": 10, "tasks": ["11"] },
    { "id": 11, "tasks": ["12"] },
    { "id": 12, "tasks": ["13"] },
    { "id": 13, "tasks": ["14"] },
    { "id": 14, "tasks": ["15"] },
    { "id": 15, "tasks": ["16"] },
    { "id": 16, "tasks": ["17"] },
    { "id": 17, "tasks": ["18"] }
  ]
}
```
