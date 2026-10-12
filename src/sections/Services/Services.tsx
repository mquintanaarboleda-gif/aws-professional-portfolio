import { contactInfo, navigationItems, services, servicesInvitation } from '../../content/es'
import styles from './Services.module.css'

const heading = navigationItems.find((item) => item.targetId === 'services')?.label

export function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className="container">
        <h2>{heading}</h2>
        <ul className={styles.list}>
          {services.map((service) => (
            <li key={service.name} className={styles.item}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </li>
          ))}
        </ul>
        <div className={styles.invitation}>
          <h3>{servicesInvitation.heading}</h3>
          <p>{servicesInvitation.description}</p>
          <a href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(contactInfo.inquiries.services.subject)}`}>
            {servicesInvitation.actionLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
