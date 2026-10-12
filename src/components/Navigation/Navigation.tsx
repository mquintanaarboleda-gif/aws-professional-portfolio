// Primary navigation, rendered outside <main> (it is not a content section).
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { heroContent, navigationItems } from '../../content/es'
import styles from './Navigation.module.css'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <div className={styles.bar} onKeyDown={handleKeyDown}>
      <p className={styles.brand}>
        <span className={styles.brandName}>{heroContent.name}</span>
      </p>
      <button
        ref={menuButton}
        type="button"
        className={styles.menuButton}
        aria-controls="primary-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? 'Cerrar menú' : 'Menú'}
      </button>
      <nav
        id="primary-navigation"
        aria-label="Navegación principal"
        className={`${styles.nav} ${isOpen ? styles.open : ''}`}
      >
        <ul className={styles.list}>
          {navigationItems.map((item) => (
            <li key={item.targetId}>
              <a href={`#${item.targetId}`} onClick={() => setIsOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
