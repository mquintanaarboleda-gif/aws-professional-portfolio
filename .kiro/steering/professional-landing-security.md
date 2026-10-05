---
inclusion: fileMatch
fileMatchPattern: ["src/**", "public/**", "index.html", "package.json", "vite.config.ts", "tsconfig*.json", ".kiro/specs/professional-landing-page/**"]
---

# Professional Landing Page - Security Guidelines

> Fuente de verdad: `.kiro/specs/professional-landing-page/requirements.md` y `design.md` aprobados. Si este archivo contradice esos documentos, prevalecen requirements.md / design.md.

## Security Principles

### Principio fundamental
**No almacenar secretos ni credenciales en el código fuente, el frontend ni el repositorio.**

Este proyecto es una landing page estática pública. Todo el contenido del bundle es visible en el navegador.

## Secret Management

### ❌ NUNCA incluir en código ni en el repositorio
- AWS Access Keys / Secret Access Keys
- Contraseñas
- Tokens de API privados
- Claves privadas o certificados privados
- Cualquier credencial
- Información personal sensible no destinada a ser pública

### ✅ Información pública aceptable
- Email profesional
- URL de LinkedIn
- Nombre, título, experiencia (contenido público aprobado)
- URLs de proyectos públicos

### Variables de entorno
- El MVP NO necesita variables de entorno.
- Las variables `VITE_*` se incrustan en el bundle y son públicas: nunca usarlas para secretos.

## Frontend Security

### Enlaces externos
Los enlaces externos (LinkedIn, proyectos) que abren en nueva pestaña usan:
```html
<a href="external-url" rel="noopener noreferrer" target="_blank">
```

Esto previene `window.opener` hijacking y leakage innecesario de referrer.

### Sin recolección de datos en el MVP
- Sin formularios
- Sin cookies
- Sin analytics
- El contacto (LinkedIn, mailto) es una acción iniciada por el usuario

## AWS Security Architecture

### Bucket S3
**Configuración requerida**:
- ✅ Bucket **privado**
- ✅ Block Public Access activado
- ✅ Sin public read access
- ✅ Sin S3 Static Website Hosting
- ✅ Acceso SOLO mediante CloudFront Origin Access Control (OAC)
- ✅ Encryption at rest: SSE-S3
- Versioning: opcional (útil para rollback)

**Bucket policy** (solo la distribución CloudFront específica puede leer objetos):
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

**Comportamiento esperado**: el acceso directo al bucket o a sus objetos debe resultar en Access Denied.

### CloudFront
**Configuración requerida**:
- ✅ Punto público único de acceso
- ✅ Origin Access Control (OAC) para acceder a S3; NO usar Origin Access Identity (OAI) legacy
- ✅ HTTPS obligatorio (Redirect HTTP to HTTPS)
- ✅ TLS 1.2 mínimo
- ✅ Certificado de ACM
- ✅ Default Root Object: `index.html`

Security headers (HSTS, `X-Content-Type-Options`, etc.): opcionales, candidatos para evaluar en el futuro; no son requisito del MVP.

### ACM (AWS Certificate Manager)
- Certificado SSL/TLS provisto por ACM, con renovación automática
- El certificado usado por CloudFront para el custom domain debe crearse/importarse en **us-east-1**
- Validación DNS mediante Route 53

### Route 53
- Registros Alias hacia la distribución CloudFront
- Health checks: no necesarios para este sitio estático
- DNSSEC: opcional, si el TLD lo soporta

## IAM Principles

### Mínimo privilegio
- No usar credenciales root para operar.
- Preferir credenciales temporales y roles sobre access keys de larga duración.
- No dar permisos administrativos amplios "por si acaso".
- Cada persona usa sus propias credenciales; no compartirlas.

**Deployment user/role (actualizaciones posteriores al primer deployment manual)** solo necesita:
- `s3:PutObject` y `s3:ListBucket` sobre el bucket específico
- `cloudfront:CreateInvalidation` sobre la distribución específica

NO necesita permisos para crear/eliminar buckets, modificar políticas IAM ni acceder a otros recursos AWS.

## Dependency Security

- Ejecutar `npm audit` regularmente y resolver vulnerabilidades
- Commitear `package-lock.json`
- Revisar cada dependencia antes de agregarla: bien mantenida, con uso amplio, sin indicios de typosquatting
- Cuando exista CI/CD (candidato futuro), usar `npm ci`

## Version Control Security

### .gitignore
Debe excluir como mínimo:
```
.env
.env.*
node_modules/
dist/
```

### No commitear
- ❌ Credenciales AWS
- ❌ Variables de entorno con secretos
- ❌ Archivos de configuración local con paths absolutos personales
- ❌ Build artifacts (`dist/`)

Pre-commit hooks para detectar secretos: opcionales.

## Incident Response

### Si se comprometen credenciales AWS
1. Rotar/desactivar inmediatamente
2. Revisar CloudTrail para acciones no autorizadas
3. Revisar facturación y eliminar recursos no autorizados
4. Investigar cómo se comprometieron

### Si se descubre un secreto en el historial de Git
1. Rotar el secreto inmediatamente
2. Limpiar el historial (ej: `git-filter-repo`) solo con aprobación explícita, ya que requiere reescribir historia
3. Coordinar con colaboradores

## Deployment Security

- El primer deployment es manual, para comprender y verificar cada configuración de seguridad.
- Verificar Block Public Access, OAC, bucket policy y HTTPS antes de considerar el deployment terminado.
- Production deployment requiere verification completa, cost gate y aprobación humana explícita.

## Cost Security

- Configurar AWS Budget alerts antes del deployment
- Revisar facturación mensualmente
- La estimación de costos detallada se realiza mediante el cost gate antes de producción

## What NOT to do

- ❌ No usar S3 Static Website Hosting
- ❌ No hacer el bucket S3 público
- ❌ No usar Origin Access Identity (OAI) legacy
- ❌ No commitear archivos `.env`
- ❌ No hardcodear credenciales AWS
- ❌ No compartir credenciales entre personas
- ❌ No servir el sitio por HTTP sin redirección a HTTPS
- ❌ No ignorar `npm audit` warnings
- ❌ No dar permisos IAM amplios "por si acaso"
- ❌ No desplegar a producción sin validar configuraciones de seguridad
