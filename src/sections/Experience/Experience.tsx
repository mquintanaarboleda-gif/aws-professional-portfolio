import { experienceEntries, navigationItems } from '../../content/es'
import type { Period } from '../../types/content'
import styles from './Experience.module.css'

const heading = navigationItems.find((item) => item.targetId === 'experience')?.label

// The two most recent roles stay fully visible without interaction; the
// earlier roles are collapsed by default (see <details> below) but keep
// every field from es.ts (no content is removed, only presentation changes).
const recentEntries = experienceEntries.slice(0, 2)
const pastEntries = experienceEntries.slice(2)

function formatPeriod(period: Period): string {
  return period.end === null ? `${period.start} – Actualidad` : `${period.start} – ${period.end}`
}

export function Experience() {
  return (
    <section id="experience" className={styles.experience}>
      <div className="container">
        <h2>{heading}</h2>
        <div className={styles.entries}>
          {recentEntries.map((entry) => (
            <article key={`${entry.company}-${entry.role}-${entry.period.start}`} className={styles.entry}>
              <h3>{entry.role}</h3>
              <p className={styles.company}>
                {entry.company}
                {entry.location ? ` · ${entry.location}` : ''}
              </p>
              <p className={styles.period}>{formatPeriod(entry.period)}</p>
              {entry.summary && <p className={styles.summary}>{entry.summary}</p>}
              {entry.achievements.length > 0 && (
                <ul className={styles.achievements}>
                  {entry.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <div className={styles.pastEntries}>
          {pastEntries.map((entry) => (
            <details key={`${entry.company}-${entry.role}-${entry.period.start}`} className={styles.pastEntry}>
              <summary className={styles.pastSummary}>
                {entry.role} — {entry.company} · {formatPeriod(entry.period)}
              </summary>
              <p className={styles.company}>
                {entry.company}
                {entry.location ? ` · ${entry.location}` : ''}
              </p>
              <p className={styles.period}>{formatPeriod(entry.period)}</p>
              {entry.summary && <p className={styles.summary}>{entry.summary}</p>}
              {entry.achievements.length > 0 && (
                <ul className={styles.achievements}>
                  {entry.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
