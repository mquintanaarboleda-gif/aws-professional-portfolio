# AWS Deployment

## Estado

**PRODUCTION DEPLOYED**

Live URL: **https://miltonquintana.com**

Este documento describe el deployment de producción REAL ya ejecutado — no es un checklist previo a un deployment pendiente. Ningún paso queda abierto; cada sección refleja lo que realmente se configuró y se validó.

## Arquitectura

```
Usuario
  │  HTTPS request
  ▼
Route 53  (registros Alias: dominio raíz + www → distribución CloudFront)
  ▼
CloudFront  (certificado ACM asociado, terminación TLS, HTTPS obligatorio)
  │  Request firmado (SigV4) vía Origin Access Control (OAC)
  ▼
S3  (bucket privado, Block Public Access habilitado, sin Static Website Hosting)
```

No aparecen en este documento AWS Account IDs, ARNs reales, Hosted Zone IDs, Distribution IDs, OAC IDs, Certificate IDs ni el nombre real del bucket — todos los identificadores de abajo son placeholders genéricos.

## Cómo se desplegó

- Ejecutado **mediante AWS CLI**, no mediante AWS Console — decisión deliberada (ver [docs/architecture-decisions.md](./docs/architecture-decisions.md#9-no-iac-for-the-first-deployment) y [docs/deployment.md](./docs/deployment.md)).
- Ejecutado usando un **IAM role dedicado de mínimo privilegio**, asumido mediante un profile de AWS CLI separado — nunca con la identidad administradora de amplio acceso usada en la exploración inicial de la cuenta (ver [docs/architecture-decisions.md](./docs/architecture-decisions.md#12-dedicated-least-privilege-iam-role-for-deployment)).
- Cada paso de creación de recursos (registro de dominio, IAM role/policy, certificado ACM, bucket S3, distribución CloudFront, registros Route 53) fue un **approval gate humano explícito** — nada se creó automáticamente sin revisión previa.
- **Sin Infrastructure as Code** (Terraform/CDK/CloudFormation) en este primer deployment — decisión deliberada para construir comprensión práctica de cada recurso antes de automatizarlo.

## Build

```bash
npm run type-check   # tsc -b
npm run lint          # oxlint
npm run build         # tsc -b && vite build → dist/
```

`dist/` contiene salida estática autocontenida: `index.html` y `favicon.svg` sin hash de contenido, y assets con hash inmutables bajo `assets/` (`*.css`, `*.js` — Vite incrusta un hash de contenido en el nombre de archivo). Sin backend, sin server-side rendering, sin secretos de build.

## S3

- Bucket privado, general purpose, creado vía AWS CLI.
- **Block Public Access habilitado en las 4 opciones.**
- **Static Website Hosting nunca habilitado.**
- Encryption at rest: SSE-S3.
- Recibe únicamente el contenido de `dist/`, subido con metadata `Cache-Control` diferenciada por grupo de archivo (ver abajo).

## Origin Access Control (OAC)

- Creado con signing behavior "Sign requests (always)" y firma SigV4, origin type S3.
- OAI (legacy) nunca se usó.

## CloudFront

- Distribución creada con el bucket S3 como origin, acceso al origin vía el OAC anterior.
- **Default Root Object**: `index.html`.
- **Viewer protocol policy**: Redirect HTTP to HTTPS.
- **TLS mínimo**: 1.2.
- **Alternate domain names**: el dominio raíz y `www`.
- **Certificado ACM** (abajo) asociado para ambos.
- Compresión habilitada.

## ACM

- Certificado público solicitado en **us-east-1** (requisito no negociable de CloudFront para cualquier certificado de dominio custom, sin importar la región de los demás recursos).
- Cubre el dominio raíz y `www`.
- Validado vía DNS (registros CNAME temporales en Route 53).
- Estado: **Issued**. Renovación automática por AWS.

## Route 53

- Hosted zone pública para el dominio.
- **Registros Alias** (no CNAME) para el dominio raíz y `www`, apuntando a la distribución CloudFront — Alias es obligatorio en el apex de la zona, donde un CNAME plano no está permitido por el spec de DNS.
- Dominio registrado con **WHOIS privacy protection** y **transfer lock** habilitados.

## Bucket policy

Otorga `s3:GetObject` únicamente al service principal `cloudfront.amazonaws.com`, condicionado a que `AWS:SourceArn` coincida con esta distribución específica:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<bucket-name>/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"
        }
      }
    }
  ]
}
```

Sin `Principal: "*"`. Ninguna otra distribución o cuenta puede satisfacer la condición.

## Estrategia de caché

| Archivo | Cache-Control | Razón |
|---|---|---|
| `assets/*.css`, `assets/*.js` (con hash de contenido) | `public, max-age=31536000, immutable` | El nombre cambia si el contenido cambia — cachear agresivamente es seguro indefinidamente. |
| `index.html` | `public, max-age=0, must-revalidate` | Es el único archivo que referencia los nombres de assets con hash — debe revalidarse siempre para no apuntar a assets viejos. |
| `favicon.svg` | `public, max-age=86400` | Cambia con poca frecuencia; no lleva hash, así que un tiempo de vida acotado evita staleness sin exigir revalidación en cada request. |

**Invalidaciones**: el IAM role usado en este primer deployment **no** incluye `cloudfront:CreateInvalidation` — la invalidación se excluyó deliberadamente de la policy inicial de mínimo privilegio, y el primer deployment no la usó. Como `index.html` se sirve con `max-age=0, must-revalidate`, CloudFront ya revalida contra S3 en cada request, lo cual cubre actualizaciones de contenido rutinarias sin necesitar invalidación. Una invalidación completa `/*` no forma parte de la operación normal de este deployment; si en el futuro se necesitara una invalidación puntual excepcional, requeriría revisar y otorgar ese permiso explícitamente primero, no asumir que ya está disponible.

## HTTPS / TLS

- Las requests HTTP se redirigen a HTTPS en el edge de CloudFront — verificado: `http://<dominio>` → `301` → `https://<dominio>`.
- Certificado TLS verificado como válido para el dominio raíz y para `www`.

## Validaciones realizadas

- Request directo al endpoint propio del bucket S3 → **`403` (Access Denied)**, confirma que el bucket es inalcanzable salvo a través de CloudFront.
- Request al dominio de la distribución CloudFront → **`200`**.
- Request al dominio de producción (raíz y `www`) → **`200`**.
- Requests a los assets CSS/JS con hash → **`200`**, servidos con el `Cache-Control` esperado.
- `index.html` servido con `Cache-Control: public, max-age=0, must-revalidate`, confirmado vía headers de respuesta.

## Resumen de seguridad

- IAM: role dedicado de mínimo privilegio, asumido vía un profile de CLI separado. Sin `s3:PutObjectAcl`. Sin permisos IAM otorgados al role mismo (no puede crear/modificar/escalar policies IAM, incluida la suya). Las acciones de creación de recursos de CloudFront usan `Resource: "*"` únicamente donde el servicio no soporta resource-level permissions para esa acción — nunca una ampliación deliberada. Ningún paso posterior a la creación del role usó permisos de administrador o a nivel de cuenta.
- Sin WAF en este MVP (ver [docs/architecture-decisions.md](./docs/architecture-decisions.md#6-no-waf-in-the-mvp)).
- Modelo de seguridad completo en [docs/security.md](./docs/security.md).

## Costo

Resumen cualitativo de costo en la sección [Estimated Cost](./README.md#estimated-cost) del README — no se duplica aquí para evitar que las cifras queden desincronizadas entre documentos.

## Consideraciones futuras

- Infrastructure as Code (Terraform/CDK) una vez que el proceso manual esté bien comprendido (ver decisión #9).
- Una CloudFront Function para canonicalizar entre dominio raíz y `www`, si llegara a ser necesario (ver decisión #10) — no implementada; ambos hosts sirven directamente hoy.
- Otorgar `cloudfront:CreateInvalidation` al role de deployment, solo si surge una necesidad operativa real — no otorgado hoy.

---

Este documento reemplaza una versión anterior, previa al deployment, que describía un checklist todavía no ejecutado. Ese checklist ya se ejecutó por completo; este documento ahora refleja el resultado real y validado.
