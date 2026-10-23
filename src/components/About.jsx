import Img from './Img'
import Mosaic from './Mosaic'
import Reveal from './Reveal'

export default function About({ profile, about }) {
  return (
    <section className="sec" id="about">
      <div className="wrap">
        <div className="about">
          <Reveal className="portrait">
            <Img name={about.photo} alt={`Portrait of ${profile.name}`} />
          </Reveal>
          <div className="about__text">
            <Reveal className="tag">About me</Reveal>
            <Reveal as="h2">
              Who am <em>I</em>?
            </Reveal>
            <Reveal as="p">{profile.subtitle}</Reveal>
            <Reveal as="p">{about.intro}</Reveal>
            <Reveal as="p">{about.interests}</Reveal>
          </div>
        </div>

        <Reveal className="story">
          <Mosaic images={about.story.images} label={`Moments from ${profile.name}'s journey`} />
          <div className="cols cols--cap">
            {about.story.paragraphs.map((text) => (
              <p key={text.slice(0, 40)}>{text}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
