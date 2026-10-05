import {
  certifications,
  education,
  navigationItems,
  professionalDevelopment,
  technicalFoundation,
} from '../../content/es'
import type { Period } from '../../types/content'
import styles from './Certifications.module.css'

const heading = navigationItems.find((item) => item.targetId === 'certifications')?.label

function formatPeriod(period: Period): string {
  return period.end === null ? `${period.start} – Actualidad` : `${period.start} – ${period.end}`
}

export function Certifications() {
  return (
    <section id="certifications" className={styles.certifications}>
      <div className="container">
        <h2>{heading}</h2>

        <div className={styles.group}>
          {/* No own h3: the section h2 ("Certificaciones") already states it,
              so a redundant subheading immediately below is avoided. */}
          <ul className={`${styles.list} ${styles.certGrid}`}>
            {certifications.map((certification) => (
              <li key={certification.name} className={styles.item}>
                <strong>{certification.name}</strong>
                {certification.issuer && <p className={styles.meta}>{certification.issuer}</p>}
                {(certification.issueDate || certification.expirationDate) && (
                  <p className={styles.meta}>
                    {certification.issueDate}
                    {certification.expirationDate ? ` – ${certification.expirationDate}` : ''}
                  </p>
                )}
                {certification.verificationUrl && (
                  <a href={certification.verificationUrl} target="_blank" rel="noopener noreferrer">
                    Verificar
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.group}>
          <h3>Formación y desarrollo profesional</h3>
          <ul className={`${styles.list} ${styles.devGrid}`}>
            {professionalDevelopment.map((entry) => (
              <li key={entry.name} className={styles.item}>
                <strong>{entry.name}</strong>
                {entry.status && <span className={styles.status}>{entry.status}</span>}
                {entry.provider && <p className={styles.meta}>{entry.provider}</p>}
                {entry.detail && <p className={styles.meta}>{entry.detail}</p>}
                {entry.period && <p className={styles.meta}>{entry.period}</p>}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.group}>
          <h3>Base técnica</h3>
          <ul className={styles.foundationList}>
            {technicalFoundation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.group}>
          <h3>Educación</h3>
          <ul className={`${styles.list} ${styles.eduGrid}`}>
            {education.map((entry) => (
              <li key={entry.degree} className={styles.item}>
                <strong>{entry.degree}</strong>
                <p className={styles.meta}>{entry.institution}</p>
                <p className={styles.meta}>{formatPeriod(entry.period)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
