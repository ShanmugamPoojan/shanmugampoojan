import About from './components/About'
import BackgroundFX from './components/BackgroundFX'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Journey from './components/Journey'
import LightboxProvider from './components/Lightbox'
import More from './components/More'
import Nav from './components/Nav'
import Projects from './components/Projects'
import Terminal from './components/Terminal'
import ThemeToggle from './components/ThemeToggle'
import useTheme from './hooks/useTheme'
import raw from './data/portfolio.json'
import { smartQuotes } from './utils/typography'

const data = smartQuotes(raw)

export default function App() {
  const { theme, toggle } = useTheme()
  return (
    <LightboxProvider>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <BackgroundFX />
      <Nav />
      <ThemeToggle theme={theme} onToggle={toggle} />
      <main>
        <Hero hero={data.home.hero} />
        <About profile={data.profile} about={data.about} />
        <Journey intro={data.journeyIntro} chapters={data.journey} achievements={data.achievements} notes={data.journeyNotes} />
        <Projects skills={data.skillsList} skillsVisible={data.skillsInitialVisible} projects={data.projects} />
        <More interests={data.more.interests} story={data.more.story} books={data.more.books} booksVisible={data.more.booksVisible} />
      </main>
      <Footer footer={data.footer} social={data.social} email={data.profile.email} />
      <Terminal />
    </LightboxProvider>
  )
}
