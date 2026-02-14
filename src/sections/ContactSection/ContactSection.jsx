import { useContactForm } from '../../hooks/useContactForm'
import './ContactSection.css'

export default function ContactSection() {
  const { formRef, status, handleSubmit } = useContactForm()

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

      <form ref={formRef} onSubmit={handleSubmit} className="contact-section__form">
        <div className="contact-section__field">
          <label className="contact-section__prompt">&gt; name:</label>
          <input
            type="text"
            name="user_name"
            required
            className="contact-section__input"
            autoComplete="name"
          />
        </div>
        <div className="contact-section__field">
          <label className="contact-section__prompt">&gt; email:</label>
          <input
            type="email"
            name="user_email"
            required
            className="contact-section__input"
            autoComplete="email"
          />
        </div>
        <div className="contact-section__field">
          <label className="contact-section__prompt">&gt; message:</label>
          <textarea
            name="message"
            required
            rows={4}
            className="contact-section__textarea"
          />
        </div>

        <button
          type="submit"
          className="contact-section__submit"
          disabled={status === 'sending'}
        >
          [{status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}]
        </button>

        {status === 'success' && (
          <div className="contact-section__status contact-section__status--ok">
            [OK] Message sent. I'll be in touch soon.
          </div>
        )}
        {status === 'error' && (
          <div className="contact-section__status contact-section__status--err">
            [ERR] Failed to send. Try kboyanov19@abv.bg directly.
          </div>
        )}
      </form>
    </div>
  )
}
