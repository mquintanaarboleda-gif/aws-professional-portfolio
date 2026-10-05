import { expertiseAreas, navigationItems } from '../../content/es'
import styles from './Expertise.module.css'

const heading = navigationItems.find((item) => item.targetId === 'expertise')?.label

export function Expertise() {
  return (
    <section id="expertise" className={styles.expertise}>
      <div className="container">
        <h2>{heading}</h2>
        <ul className={styles.list}>
          {expertiseAreas.map((area) => (
            <li key={area.title} className={styles.item}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
