import { heroContent } from '../../content/es'
import styles from './Hero.module.css'

export function Hero() {
  const { name, title, tagline, architectureFlow, cta } = heroContent

  return (
    <section id="hero" className={styles.hero}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.title}>{title}</p>
          <p className={styles.tagline}>{tagline}</p>
          <div className={styles.actions}>
            <a href={cta.primaryAction} className={styles.primaryCta}>
              {cta.primary}
            </a>
            {cta.secondary && cta.secondaryAction && (
              <a href={cta.secondaryAction} className={styles.secondaryCta}>
                {cta.secondary}
              </a>
            )}
          </div>
        </div>
        <figure className={styles.method}>
          <figcaption>{architectureFlow.title}</figcaption>
          <ol className={styles.flow}>
            {architectureFlow.stages.map((stage) => (
              <li key={stage}>{stage}</li>
            ))}
          </ol>
          <p className={styles.outcome}>{architectureFlow.outcome}</p>
          <p className={styles.visuallyHidden}>{architectureFlow.description}</p>
        </figure>
      </div>
    </section>
  )
}
