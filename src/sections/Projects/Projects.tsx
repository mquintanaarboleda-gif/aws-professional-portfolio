import { navigationItems, projects } from '../../content/es'
import styles from './Projects.module.css'

const heading = navigationItems.find((item) => item.targetId === 'projects')?.label

export function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className="container">
        <h2>{heading}</h2>
        <div className={styles.list}>
          {projects.map((project) => (
            <article key={project.name} className={styles.item}>
              <span className={`${styles.badge} ${styles[project.type]}`}>{project.typeLabel}</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <ul className={styles.focus}>
                {project.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {project.demonstrates && (
                <p className={styles.demonstrates}>
                  <strong>Demuestra:</strong> {project.demonstrates}
                </p>
              )}
              {project.note && <p className={styles.note}>{project.note}</p>}
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.repoLink}>
                  Ver repositorio
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
