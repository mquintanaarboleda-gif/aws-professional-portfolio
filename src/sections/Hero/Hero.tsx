import { heroContent } from '../../content/es'
import styles from './Hero.module.css'

export function Hero() {
  const { name, title, tagline, cta } = heroContent

  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
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
    </section>
  )
}
