import ExpandGrid from './ExpandGrid'
import Reveal from './Reveal'

function Book({ book, index }) {
  return (
    <div className="book" style={{ '--o': 0.35 + (index % 4) * 0.17 }}>
      <span className="book__spine" aria-hidden="true" />
      <div className="book__body">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        {book.genre && <span className="chip">{book.genre}</span>}
      </div>
    </div>
  )
}

export default function More({ interests, story, books, booksVisible }) {
  return (
    <section className="sec" id="more">
      <div className="wrap">
        <Reveal className="tag">More</Reveal>
        <Reveal as="h2">
          My <em>interests</em>
        </Reveal>
        <Reveal as="p" className="sub">
          Beyond the code
        </Reveal>
        <ExpandGrid items={interests.items} visible={interests.initialVisible} />

        <Reveal as="h2" className="h2--gap">
          More about <em>me</em>
        </Reveal>
        <Reveal as="p" className="sub">
          The story so far
        </Reveal>
        <div className="tale">
          {story.map((text, i) => (
            <Reveal as="p" key={text.slice(0, 40)} className={i === 0 ? 'tale__lead' : ''} delay={i * 60}>
              {text}
            </Reveal>
          ))}
        </div>

        <Reveal as="h2" className="h2--gap">
          Books I’ve <em>read</em>
        </Reveal>
        <Reveal as="p" className="sub">
          A small shelf of what I’ve read so far
        </Reveal>
        <ExpandGrid
          items={books}
          visible={booksVisible}
          gridClass="grid--books"
          keyOf={(b) => b.title}
          renderItem={(book, i) => <Book book={book} index={i} />}
        />
      </div>
    </section>
  )
}
