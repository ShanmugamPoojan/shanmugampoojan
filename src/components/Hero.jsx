import Avatar from './Avatar'

export default function Hero({ hero }) {
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <Avatar />
      <div className="hero__text">
        <div className="tag">Portfolio</div>
        <h1>
          Hello world,
          <br />I’m <em>{hero.name}</em>
        </h1>
        <p className="hero__role">{hero.subtitle}</p>
        <p className="hero__lead">{hero.description}</p>
        <div className="btns">
          <a className="btn btn--primary" href="#projects">
            View my work
          </a>
          <a className="btn" href="#journey">
            My journey
          </a>
        </div>
      </div>
    </section>
  )
}
