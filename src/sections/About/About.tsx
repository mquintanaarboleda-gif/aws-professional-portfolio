import { aboutContent } from '../../content/es'
import styles from './About.module.css'

export function About() {
  const { heading, paragraphs, approach } = aboutContent

  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <h2>{heading}</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
        {approach && (
          <div className={styles.approach}>
            <h3>{approach.title}</h3>
            <ol className={styles.steps}>
              {approach.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className={styles.statement}>{approach.statement}</p>
          </div>
        )}
      </div>
    </section>
  )
}
