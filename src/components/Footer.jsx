import Reveal from './Reveal'

function Quote({ text, accent }) {
  const at = accent ? text.indexOf(accent) : -1
  if (at < 0) return text
  return (
    <>
      {text.slice(0, at)}
      <em>{accent}</em>
      {text.slice(at + accent.length)}
    </>
  )
}

export default function Footer({ footer, social, email }) {
  return (
    <footer className="footer" id="contact">
      <Reveal as="h2">
        <Quote text={footer.quote} accent={footer.accent} />
      </Reveal>
      <div className="btns">
        <a className="btn btn--primary" href={social.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="btn" href={social.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a className="btn" href={`mailto:${email}`}>
          Email
        </a>
      </div>
      <p className="made">Made with love by Shanmugam Poojan &lt;3</p>
    </footer>
  )
}
