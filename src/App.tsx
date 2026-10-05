import { Navigation } from './components/Navigation/Navigation'
import { About } from './sections/About/About'
import { Certifications } from './sections/Certifications/Certifications'
import { Contact } from './sections/Contact/Contact'
import { Experience } from './sections/Experience/Experience'
import { Expertise } from './sections/Expertise/Expertise'
import { Hero } from './sections/Hero/Hero'
import { Projects } from './sections/Projects/Projects'
import { Services } from './sections/Services/Services'

// Root component: orchestrates Navigation (outside <main>, not a content
// section) and the content sections inside <main>, in the approved order.
function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <header>
        <Navigation />
      </header>
      {/* tabIndex={-1}: lets the skip link actually move focus into
          <main> (not just scroll it into view), the standard pattern for
          skip-link targets. Not reachable via sequential Tab order on its
          own (no positive tabindex), only as a programmatic focus target. */}
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Expertise />
        <Experience />
        <Projects />
        <Certifications />
        <Services />
        <Contact />
      </main>
    </>
  )
}

export default App
