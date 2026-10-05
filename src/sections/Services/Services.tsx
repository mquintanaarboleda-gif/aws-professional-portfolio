import { navigationItems, services } from '../../content/es'
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
      </div>
    </section>
  )
}
