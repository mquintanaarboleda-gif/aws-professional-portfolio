# AWS Deployment — Checklist de preparación

> Este documento es preparación de despliegue. **No describe un deployment ya ejecutado.**
> No se crearon recursos AWS, no se ejecutó AWS CLI y no se hizo deploy al redactarlo.
> El primer deployment será **manual, mediante AWS Console**, con fines de aprendizaje.
> AWS CLI puede usarse en deployments *posteriores*, no en el primero.
> Infrastructure as Code (Terraform/CDK/CloudFormation) queda fuera de esta fase; se evaluará después.

## 1. Build de producción

Comandos, ejecutados desde la raíz del repositorio:

```bash
npm run type-check   # tsc -b — sin errores de tipos, strict mode activo
npm run lint          # oxlint — sin hallazgos
npm run build         # tsc -b && vite build — genera dist/
```

Resultado verificado en esta sesión (build real, no estimado):

```
dist/index.html                   1.55 kB │ gzip:  0.71 kB
dist/assets/index-CgF0QByM.css   10.13 kB │ gzip:  2.23 kB
dist/assets/index-DkO7tM9C.js   243.79 kB │ gzip: 76.11 kB
```

Los nombres de archivo con hash (`index-CgF0QByM.css`, `index-DkO7tM9C.js`) cambian en cada build cuando cambia el contenido; no son valores fijos para citar en configuración, son solo evidencia de que el build genera archivos con hash de contenido.

## 2. Contenido de `dist/`

Árbol real generado por `npm run build` (verificado en esta sesión):

```
dist/
├── index.html              (sin hash en el nombre)
├── favicon.svg              (sin hash en el nombre)
└── assets/
    ├── index-<hash>.css    (hash de contenido en el nombre)
    └── index-<hash>.js     (hash de contenido en el nombre)
```

Esta distinción (con hash vs. sin hash) es la base de la estrategia de caché de la sección 6: todo lo que vive bajo `assets/` lleva hash de Vite y es inmutable; `index.html` y `favicon.svg` no llevan hash y deben revalidarse en cada visita.

Es la salida completa; no hay backend, no hay API routes, no hay archivos de configuración de servidor que subir — es contenido estático listo para un bucket S3, consistente con Requirement 17.2/17.3 (HTML/CSS/JS listos para hosting, sin transformación adicional).

## 3. Arquitectura AWS objetivo (aprobada, no desplegada)

```
Usuario
  │  HTTPS request (https://<dominio-pendiente>)
  ▼
Route 53  (registro Alias → distribución CloudFront)
  ▼
CloudFront + ACM (TLS, HTTPS obligatorio, Default Root Object: index.html)
  │  request firmado vía OAC (SigV4)
  ▼
Origin Access Control (OAC)
  ▼
S3 (bucket privado, Block Public Access: ON, sin Static Website Hosting)
```

Puntos no negociables de esta arquitectura, ya aprobados:

- **S3 privado**, nunca accesible directamente desde Internet. Un intento de acceso directo (`https://<bucket>.s3.amazonaws.com/index.html` o la URL del bucket) debe resultar en **403 Access Denied**.
- **CloudFront es el único canal público** hacia el contenido.
- **OAC, no OAI** (OAI es legacy, no se usa).
- **ACM obligatoriamente en us-east-1** para el certificado que usa CloudFront, sin importar la región del bucket S3 (requisito técnico no negociable de CloudFront).
- **Sin WAF** en este MVP.
- **Sin API Gateway, Lambda, backend, base de datos ni autenticación** — la landing es 100% estática.
- **Sin contenedores.**
- **Sin IaC** en el primer deployment (Terraform/CDK/CloudFormation quedan para una fase posterior, no definida todavía).

## 4. Checklist de configuración por servicio

### 4.1 S3

- [ ] Crear bucket S3 (general purpose), nombre único pendiente de decisión humana (ver sección 7).
- [ ] **Block Public Access: ON** (las 4 opciones activadas).
- [ ] **Static Website Hosting: deshabilitado** (nunca activarlo; activarlo haría el bucket servible públicamente por su propia URL, lo cual contradice la arquitectura aprobada).
- [ ] Encryption at rest: **SSE-S3**.
- [ ] Versioning: opcional, recomendado para poder revertir un deployment.
- [ ] Bucket policy: solo permite `s3:GetObject` al *service principal* `cloudfront.amazonaws.com`, condicionado a que `AWS:SourceArn` coincida con el ARN de la distribución CloudFront específica (no un wildcard, no "cualquier CloudFront"). Plantilla (del design.md aprobado, con placeholders a reemplazar cuando existan los recursos reales):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<nombre-bucket>/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"
        }
      }
    }
  ]
}
```

- [ ] Subir el contenido de `dist/` al bucket (manual, vía AWS Console, en el primer deployment).
- [ ] Verificar que el acceso directo al bucket o a sus objetos devuelve **403 Access Denied**.

### 4.2 CloudFront

- [ ] Crear distribución con origin = el bucket S3 anterior.
- [ ] Origin access: **Origin Access Control (OAC)**, signing behavior "Sign requests (always)".
- [ ] **Default Root Object: `index.html`**.
- [ ] Viewer protocol policy: **Redirect HTTP to HTTPS** (HTTPS obligatorio).
- [ ] TLS mínimo: 1.2.
- [ ] Allowed HTTP methods: GET, HEAD, OPTIONS (sitio estático, sin escritura).
- [ ] Compresión automática (Gzip/Brotli): habilitada.
- [ ] Alternate domain names (CNAMEs): dominio(s) definitivo(s) — **pendiente**, ver sección 7.
- [ ] Certificado SSL: el de ACM (sección 4.3), **obligatoriamente en us-east-1**.
- [ ] Cache behaviors: ver sección 6 (estrategia de caché).
- [ ] Sin WAF asociado (fuera de alcance del MVP).

### 4.3 ACM (AWS Certificate Manager)

- [ ] Solicitar certificado en **us-east-1** (no la región del bucket; CloudFront exige específicamente us-east-1 para certificados custom-domain).
- [ ] Domain names: el dominio definitivo y su variante `www` si aplica — **pendiente**, ver sección 7.
- [ ] Validation method: **DNS validation** (requiere Route 53 ya configurado o acceso al DNS del dominio).
- [ ] Esperar a que el certificado pase a estado `Issued` antes de asociarlo a CloudFront.
- [ ] Renovación: automática, gestionada por AWS, sin acción manual recurrente.

### 4.4 Route 53

- [ ] Hosted zone para el dominio definitivo — **pendiente**, ver sección 7.
- [ ] Registro **Alias** (tipo A), no CNAME, apuntando a la distribución CloudFront (obligatorio para apex domain, ej. `dominio.com` sin `www`).
- [ ] Registro Alias equivalente para `www.dominio.com` si se decide soportarlo.
- [ ] CNAMEs temporales de validación de ACM, mientras el certificado está pendiente.
- [ ] DNSSEC: opcional, solo si el TLD lo soporta.
- [ ] Health checks: no necesarios (sitio estático simple, sin failover entre orígenes).

## 5. HTTPS obligatorio

- CloudFront configurado con **Redirect HTTP to HTTPS** (ningún tráfico HTTP plano se sirve sin redirección).
- TLS 1.2 como mínimo soportado.
- El certificado proviene de ACM (sección 4.3); sin él, CloudFront no puede servir el dominio custom por HTTPS.

## 6. Estrategia de caché

Basada en el contenido real de `dist/` (sección 2): los dos archivos con hash (`assets/index-*.css`, `assets/index-*.js`) son inmutables por construcción (Vite genera un hash nuevo si el contenido cambia); `index.html` y `favicon.svg` no tienen hash y deben revalidarse.

| Archivo | Cache-Control sugerido | Razón |
|---|---|---|
| `assets/index-<hash>.css`, `assets/index-<hash>.js` | `max-age=31536000, immutable` (1 año) | El nombre cambia si el contenido cambia; cachear agresivamente es seguro, un deploy nuevo nunca sobreescribe una URL ya cacheada |
| `index.html` | `max-age=0, must-revalidate` | Es el único archivo que referencia los assets con hash; debe sedir siempre la versión más reciente para no apuntar a assets viejos |
| `favicon.svg` | `max-age=86400` (1 día) | Cambia con poca frecuencia; no lleva hash, pero no es crítico para la actualidad del contenido |

Reglas de invalidación de CloudFront:
- Los assets con hash **normalmente no requieren invalidación** — un deploy nuevo genera nombres nuevos, así que la versión vieja en caché simplemente deja de referenciarse.
- `index.html` puede invalidarse puntualmente (`/index.html`) cuando se necesite forzar que CloudFront vuelva a S3 antes de que expire su TTL.
- **Invalidar `/*` no es práctica normal.** Se reserva para casos excepcionales (ej. un cambio estructural mayor), nunca como parte del flujo rutinario de deployment.
- Costo de invalidación: las primeras 1000 rutas invalidadas por mes son gratis; después, USD 0.005 por ruta (cifra de referencia del design.md aprobado, no verificada con AWS Pricing en esta sesión — ver sección 8 sobre costos).

## 7. Decisiones que requieren intervención humana

Ninguna de estas se decidió ni se asumió en esta sesión. Son bloqueantes para pasar de "checklist" a "ejecución":

1. **Nombre de dominio definitivo** — no existe todavía. Bloquea: ACM (domain names), CloudFront (alternate domain names / CNAMEs), Route 53 (hosted zone y registros Alias), y toda la metadata SEO dependiente de URL (sección 9).
2. **Nombre del bucket S3** — los nombres de bucket son globalmente únicos en AWS; debe elegirse y confirmarse al momento de crear el recurso, no antes.
3. **Región del bucket S3** — design.md sugiere `us-east-1` como opción por defecto, pero es una decisión abierta, no una obligación (a diferencia de ACM, que sí debe estar en us-east-1 por requisito técnico de CloudFront).
4. **Cuenta AWS y región de facturación** — no se asumió ninguna cuenta ni configuración de facturación existente.
5. **Decisión de incluir o no `www`** como variante del dominio (afecta ACM, CloudFront CNAMEs y Route 53).
6. **Aprobación explícita de producción** — Requirement del cost gate (sección 8) y aprobación humana explícita antes de cualquier deployment real, independientemente de que este documento ya esté listo.

## 8. Costos — pendiente, cost gate requerido

No se estimó ningún costo en este documento. Motivo: esta sesión no tiene acceso a AWS Pricing MCP Server ni a ninguna fuente de precios AWS en vivo, y la instrucción explícita de esta task es no inventar precios.

Antes de cualquier recomendación o ejecución de deployment a producción, corresponde ejecutar el **cost gate**:

- Región AWS a confirmar (ver sección 7).
- Servicios incluidos: S3 (almacenamiento + requests), CloudFront (data transfer out + requests + invalidaciones), Route 53 (hosted zone + queries), ACM (gratuito).
- Escenarios obligatorios: Low / Expected / High, cada uno con sus propios supuestos de workload (visitas/mes, GB transferidos/mes, requests/mes).
- Precios unitarios actuales, obtenidos de AWS Pricing MCP Server cuando esté disponible — no de memoria.
- Costo bruto on-demand como cifra principal de planeación; Free Tier/créditos solo como nota aparte, nunca como justificación de la arquitectura.
- Identificación del mayor driver de costo (previsiblemente CloudFront data transfer out, según el análisis cualitativo de design.md, pero sin cifras reales todavía).
- Aprobación humana explícita de la estimación antes de desplegar a producción.

Esto está fuera del alcance de Task 18 (que es documental) y se deja explícitamente pendiente para la fase correspondiente (PHASE 10, bloqueada).

## 9. Metadata SEO pendiente de dominio

Documentado también en `index.html` desde Task 15: no se agregó `canonical`, `og:url` ni `og:image` porque dependen de una URL de producción que todavía no existe. Quedan pendientes para cuando el dominio definitivo (sección 7, punto 1) esté aprobado:

- `<link rel="canonical" href="https://<dominio-definitivo>/">`
- `<meta property="og:url" content="https://<dominio-definitivo>/">`
- `<meta property="og:image" content="https://<dominio-definitivo>/<ruta-imagen>">` — además requiere que se apruebe y genere una imagen social, lo cual tampoco existe todavía; no es solo un tema de URL.

## 10. Seguridad — resumen de restricciones aplicadas a este checklist

- Ninguna credencial AWS, access key o secreto se incluye en este documento, en el código fuente, ni se agregó a ningún archivo del repositorio.
- El deployment (cuando se ejecute) debe usar credenciales de usuario/rol con **mínimo privilegio**:
  - `s3:PutObject`, `s3:ListBucket` sobre el bucket específico.
  - `cloudfront:CreateInvalidation` sobre la distribución específica.
  - **No** `s3:PutObjectAcl` (los objetos no necesitan ACLs individuales; el acceso se controla con Block Public Access + bucket policy + OAC, no con ACLs por objeto).
  - Sin permisos administrativos amplios "por si acaso".
- S3 permanece inaccesible directamente desde Internet; CloudFront es el único canal público.
- Sin WAF en este MVP (decisión ya aprobada, no una omisión).

## 11. Estado de esta task

- No se creó ningún recurso AWS.
- No se ejecutó ningún comando de AWS CLI.
- No se realizó ningún deploy.
- Este documento es preparación/documentación únicamente, consistente con el alcance de PHASE 9 y con el bloqueo explícito de PHASE 10 (Production Deployment) hasta que se complete el cost gate y exista aprobación humana explícita.
