// Primary navigation, rendered outside <main> (it is not a content section).
import type { MouseEvent } from 'react'

import { heroContent, navigationItems } from '../../content/es'
import styles from './Navigation.module.css'

// Presentation-only derivation: the brand's secondary line reuses the first
// clause of the existing heroContent.title (split by " | "), not a new
// string. heroContent.name is rendered in full.
const brandRole = heroContent.title.split(' | ')[0]

function handleNavClick(event: MouseEvent<HTMLAnchorElement>, targetId: string) {
  const target = document.getElementById(targetId)
  if (!target) {
    return
  }
  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth' })
}

export function Navigation() {
  return (
    <div className={styles.bar}>
      <p className={styles.brand}>
        <span className={styles.brandName}>{heroContent.name}</span>
        <span className={styles.brandRole}>{brandRole}</span>
      </p>
      <nav aria-label="Navegación principal" className={styles.nav}>
        <ul className={styles.list}>
          {navigationItems.map((item) => (
            <li key={item.targetId}>
              <a href={`#${item.targetId}`} onClick={(event) => handleNavClick(event, item.targetId)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
