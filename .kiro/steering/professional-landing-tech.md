---
inclusion: fileMatch
fileMatchPattern: ["src/**", "public/**", "index.html", "package.json", "vite.config.ts", "tsconfig*.json", ".kiro/specs/professional-landing-page/**"]
---

# Professional Landing Page - Technical Decisions

> Fuente de verdad: `.kiro/specs/professional-landing-page/requirements.md` y `design.md` aprobados. Si este archivo contradice esos documentos, prevalecen requirements.md / design.md.

## Technology Stack

### Frontend
- **React**: versión estable compatible con el setup de Vite aprobado
- **TypeScript**
- **Vite** como build tool y dev server
- **CSS Modules** para estilos específicos de componentes

### Setup actual
- El proyecto fue inicializado con el template oficial `react-ts` de Vite.
- Las versiones instaladas son las definidas por ese template y quedan fijadas en `package-lock.json`.
- No cambiar versiones de React, Vite o TypeScript sin una necesidad concreta y justificada.
- `vite.config.ts` se mantiene en su configuración default salvo necesidad concreta y justificada. El build debe generar `dist/`.

### Styling Approach
- **CSS Modules** para estilos específicos de cada componente o sección
- **global.css** pequeño para:
  - CSS reset mínimo
  - Tipografía base
  - Design tokens (spacing, breakpoints, estructura de color y tipografía)
  - Reglas verdaderamente globales (por ejemplo, estilos de foco)
- No fijar branding, colores finales, fuentes específicas ni fotografía hasta que exista dirección visual aprobada.

### Content Management
- El contenido profesional debe estar **separado** de los componentes
- Estructura prevista: `src/content/es.ts` (TypeScript para type safety)
- Los componentes renderizan contenido y NO contienen grandes cantidades de texto profesional hardcodeado
- Los componentes pueden recibir contenido por props o importarlo del módulo de contenido; lo obligatorio es la separación entre contenido y UI

**Ejemplo**:
```typescript
// ❌ EVITAR: texto profesional hardcodeado en el componente
const Hero = () => <h1>Nombre Apellido - Cargo profesional</h1>;

// ✅ PREFERIR: el componente renderiza contenido del módulo de contenido
import { heroContent } from '../../content/es';
const Hero = () => <h1>{heroContent.name}</h1>;
```

## Dependency Principles

### Regla fundamental
**No se introduce ninguna dependencia adicional salvo que resuelva un requisito concreto y su necesidad esté justificada.**

### Dependencias del MVP
- React, React DOM
- TypeScript
- Vite y su plugin oficial de React
- Las devDependencies incluidas por el template oficial

### Fuera del MVP
No forman parte del MVP ni son opciones previstas:
- React Router (la navegación es entre secciones de una sola página)
- Redux u otros state managers globales
- Tailwind u otros CSS frameworks
- UI component libraries
- Librerías de i18n
- Librerías de fetching / HTTP (no hay backend ni API)
- Librerías de animación o de iconos pesadas
- AWS SDK

## Build & Deployment

### Build Process
- `npm run build` genera el bundle optimizado en `dist/`
- Output: HTML, CSS, JS estáticos listos para subir a S3 sin transformaciones adicionales

### Deployment Target (Futuro)
**Arquitectura AWS aprobada**:
```
Usuario → Route 53 → CloudFront → Origin Access Control → S3 (privado)
```

**Decisiones AWS**:
- ❌ NO utilizar S3 Static Website Hosting
- ✅ Bucket S3 privado
- ✅ CloudFront como punto público de acceso
- ✅ CloudFront accede a S3 mediante Origin Access Control
- ✅ Default Root Object: `index.html`
- ✅ HTTPS con CloudFront + ACM (certificado en us-east-1)
- ✅ Caching: assets con hash con cache de larga duración y normalmente sin invalidación; `index.html` con cache corta/revalidación e invalidación puntual cuando corresponda. La invalidación `/*` no es práctica normal.
- ✅ El primer deployment será MANUAL para comprender los servicios
- ⏳ Infrastructure as Code y CI/CD quedan fuera del MVP inicial
- ⛔ Production deployment requiere verification completa, cost gate y aprobación humana explícita

### Development
- `npm run dev` para desarrollo local con hot reload de Vite
- TypeScript checks en desarrollo y en `npm run build`

## Code Quality

### TypeScript
- Tipos explícitos para props y estructuras de contenido
- Evitar `any`
- Interfaces para estructuras de contenido

### Component Design
- Componentes funcionales
- Props claramente tipadas
- Separación de responsabilidades (presentación vs contenido)

### Testing
Conforme a design.md, testing proporcional al MVP:
- TypeScript type checking
- Production build exitoso
- Testing manual estructurado: navegación, links externos, responsive, accesibilidad básica
- Lighthouse como herramienta de evaluación, sin threshold numérico obligatorio
- No se incluyen tests automatizados en el MVP

## Performance Considerations

Conforme a requirements.md:
- Production build minificado (Vite)
- Imágenes optimizadas para web
- Lazy loading para imágenes no críticas cuando corresponda
- Evitar JavaScript y dependencias innecesarias
- Los objetivos numéricos de Lighthouse se definirán después del primer production build

## Accessibility

- HTML semántico
- ARIA solo cuando el HTML semántico no sea suficiente
- Navegación por teclado funcional y foco visible
- Contraste de colores adecuado (WCAG AA mínimo)
- Alt text en imágenes significativas

## SEO Basics

- `lang="es"`, title y meta description
- Open Graph tags básicos
- Estructura HTML semántica y jerarquía de headings correcta

## Browser Support

- Últimas 2 versiones de Chrome, Firefox, Safari, Edge
- Mobile Safari (iOS)
- Chrome Mobile (Android)
- No se requiere soporte para IE11

## Architecture Principles

1. **Simplicidad**: Usar la solución más simple que satisfaga los requisitos
2. **Sin sobreingeniería**: No agregar patrones complejos innecesariamente
3. **Separación de concerns**: Contenido, componentes y estilos separados
4. **Type safety**: TypeScript para prevenir errores
5. **Mantenibilidad**: Código claro sobre código clever
6. **Performance**: Optimización razonable sin optimización prematura

## What NOT to do

- ❌ No introducir Redux ni state management global
- ❌ No introducir React Router
- ❌ No aplicar Clean Architecture / DDD para una landing estática
- ❌ No crear backend ni API
- ❌ No agregar complejidad "por si acaso en el futuro"
- ❌ No introducir microservicios ni contenedores para una aplicación estática
