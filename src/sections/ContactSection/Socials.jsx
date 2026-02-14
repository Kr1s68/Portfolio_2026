import './ContactSection.css'

export default function Socials() {
  return (
    <div className="contact-section">
      <div className="contact-section__info">
        <span className="contact-section__label">email:</span>
        <a href="mailto:kboyanov19@abv.bg" className="contact-section__email">
          kboyanov19@abv.bg
        </a>
      </div>
      <div className="contact-section__info">
        <span className="contact-section__label">linkedin:</span>
        <a href="https://www.linkedin.com/in/kboyanov13/" target="_blank" rel="noopener noreferrer" className="contact-section__link">
          kboyanov13
        </a>
      </div>
      <div className="contact-section__info">
        <span className="contact-section__label">instagram:</span>
        <a href="https://www.instagram.com/kboyanov13/" target="_blank" rel="noopener noreferrer" className="contact-section__link">
          @kboyanov13
        </a>
      </div>
    </div>
  )
}
