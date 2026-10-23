import ExpandGrid from './ExpandGrid'
import Img from './Img'
import Reveal from './Reveal'

export default function Projects({ skills, skillsVisible, projects }) {
  const items = skills.map((s) => ({ ...s, tag: '-skill' }))
  const list = [...projects].reverse()
  return (
    <section className="sec" id="projects">
      <div className="wrap">
        <Reveal className="tag">Projects</Reveal>
        <Reveal as="h2">
          My <em>skills</em>
        </Reveal>
        <Reveal as="p" className="sub">
          Showcasing my best work and technical skills
        </Reveal>
        <ExpandGrid items={items} visible={skillsVisible} />

        <Reveal as="h2" className="h2--gap">
          My <em>work</em>
        </Reveal>
        <Reveal as="p" className="sub">
          Selected projects
        </Reveal>
        <div className="stack">
          {list.map((p, i) => (
            <Reveal as="article" className="wcard" key={p.title}>
              <div className="whead">
                <span className="wn">{String(i + 1).padStart(2, '0')}</span>
                <span className="wt">Project</span>
                <span className="wline" />
              </div>
              <div className="project">
                <div className="project__text">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="chips">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <a className="btn" href={p.link} target="_blank" rel="noopener noreferrer">
                    View on GitHub &gt;&gt;
                  </a>
                </div>
                <div className="project__img">
                  <Img name={p.image} alt={`Screenshot of ${p.title}`} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
