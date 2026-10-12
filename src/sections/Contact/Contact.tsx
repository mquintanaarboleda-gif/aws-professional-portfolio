import { contactInfo, navigationItems } from '../../content/es'
import styles from './Contact.module.css'

const heading = navigationItems.find((item) => item.targetId === 'contact')?.label

export function Contact() {
  const telHref = `tel:${contactInfo.phone.replace(/\s+/g, '')}`
  const mailto = (subject: string) =>
    `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}`

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <h2>{heading}</h2>
        {/* "Hablemos" is new UI copy (not es.ts content), consistent with
            the existing precedent of hardcoded UI microcopy in this
            component (e.g. "Email:", "Teléfono:"). */}
        <p className={styles.lead}>Hablemos</p>
        <div className={styles.inquiries}>
          {[contactInfo.inquiries.services, contactInfo.inquiries.professional].map((inquiry) => (
            <div key={inquiry.subject} className={styles.inquiry}>
              <h3>{inquiry.heading}</h3>
              <p>{inquiry.description}</p>
              <a href={mailto(inquiry.subject)}>{inquiry.actionLabel}</a>
            </div>
          ))}
        </div>
        <ul className={styles.channels}>
          <li>
            <span className={styles.label}>Email: </span>
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </li>
          <li>
            <span className={styles.label}>Teléfono: </span>
            <a href={telHref}>{contactInfo.phone}</a>
          </li>
          <li>
            <span className={styles.label}>LinkedIn: </span>
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <span className={styles.label}>GitHub: </span>
            <a href={contactInfo.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        </ul>
        <ul className={styles.list}>
          <li>
            <span className={styles.label}>Ubicación: </span>
            {contactInfo.location}
          </li>
          <li>
            <span className={styles.label}>Alcance: </span>
            {contactInfo.reach}
          </li>
        </ul>
      </div>
    </section>
  )
}
