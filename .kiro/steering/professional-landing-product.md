---
inclusion: fileMatch
fileMatchPattern: ["src/**", "public/**", "index.html", "package.json", "vite.config.ts", "tsconfig*.json", ".kiro/specs/professional-landing-page/**"]
---

# Professional Landing Page - Product Context

> Fuente de verdad: `.kiro/specs/professional-landing-page/requirements.md` y `design.md` aprobados. Si este archivo contradice esos documentos, prevalecen requirements.md / design.md.

## Product Overview

Landing page profesional para un Solution Architect / Cloud Architect / Technical Presales. El objetivo es permitir que recruiters, hiring managers, CTOs, líderes técnicos, partners o potenciales clientes comprendan rápidamente:

- Quién es el profesional
- Qué problemas puede resolver
- Experiencia relevante
- Expertise técnico
- Proyectos destacados
- Certificaciones y formación
- Servicios profesionales
- Cómo contactarlo

**Nota importante**: NO es simplemente un CV publicado como página web. Es una herramienta profesional de presentación y posicionamiento.

## Target Users

### Principales
1. **Hiring Manager / CTO / Líder Técnico**: Evalúa candidatos para roles de arquitectura o liderazgo técnico
2. **Recruiter Técnico**: Busca perfiles especializados en arquitectura cloud y soluciones empresariales

### Secundarios
3. **Cliente Potencial**: Busca contratar servicios de consultoría o arquitectura
4. **Partner o Integrador Tecnológico**: Evalúa colaboración en proyectos

## Problem Statement

Los profesionales técnicos necesitan una presencia digital profesional que:
- Transmita credibilidad y expertise técnico
- Sea fácil de encontrar y compartir
- Presente su experiencia de forma clara y estructurada
- Permita contacto directo sin intermediarios
- No requiera mantenimiento técnico constante

## MVP Scope

### Secciones incluidas
1. **Hero**: Nombre, rol, propuesta de valor
2. **Sobre mí**: Breve introducción profesional
3. **Expertise**: Áreas principales de conocimiento técnico
4. **Experiencia**: Trayectoria profesional resumida, en orden cronológico inverso
5. **Proyectos destacados**: Casos de éxito y proyectos relevantes
6. **Certificaciones y formación**: Credenciales profesionales
7. **Servicios**: Servicios profesionales ofrecidos
8. **Contacto**: LinkedIn y email (mailto)

La navegación entre secciones es un elemento de la página, no una sección de contenido.

### Contenido profesional
- La fuente de verdad del contenido fue un documento aprobado por el profesional (mantenido fuera de este repositorio público); el contenido ya integrado vive en `src/content/es.ts`.
- NO inventar experiencia, logros, proyectos, tecnologías, certificaciones, servicios ni métricas.
- Fotografía e imágenes profesionales son contenido opcional pendiente de definición.

### Idioma
- MVP completamente en **español**
- La arquitectura debe permitir incorporar inglés posteriormente sin reestructuración significativa de los componentes UI
- NO implementar internacionalización ni selector ES/EN hasta que exista contenido en ambos idiomas

## Out of Scope

**NO incluir en MVP**:
- Autenticación de usuarios
- Sistema de usuarios
- Base de datos
- CMS (Content Management System)
- Blog
- Newsletter
- Chatbot
- Amazon Bedrock
- API Gateway
- Lambda functions
- Formulario con backend
- Panel administrativo
- Contenedores
- Kubernetes
- Microservicios
- Infrastructure as Code (el primer deployment es manual)
- Selector de idioma o implementación de i18n
- Analytics
- Testimonios
- Casos de estudio detallados (más allá de resúmenes de proyectos)

## Success Criteria

Un MVP exitoso debe:
- Cumplir los requirements y criterios de aceptación aprobados
- Funcionar correctamente en desktop, tablet y móvil
- Transmitir profesionalismo visual
- Permitir contacto directo (LinkedIn, email)
- Ser fácil de compartir (URL limpia)
- Ser fácil de actualizar (modificar contenido sin tocar componentes)
- Generar un production build que se pueda desplegar a S3 sin transformaciones adicionales

### Performance
Conforme a requirements.md:
- Production build minificado y optimizado
- Imágenes optimizadas para web
- Lazy loading para imágenes no críticas cuando corresponda
- Evitar JavaScript y dependencias innecesarias
- Lighthouse se utiliza durante testing; los objetivos numéricos se definirán después de disponer del primer production build

## Candidate Future Enhancements

No forman parte del MVP:
- Versión en inglés y selector de idioma
- Formulario de contacto con backend
- CI/CD
- Infrastructure as Code

La clave: **preparación no significa implementación anticipada**.
