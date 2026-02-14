import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { bio, skills, interests } from '../../data/aboutData'
import './AboutSection.css'

const FILES = [
  { id: 'bio', label: 'bio.txt' },
  { id: 'skills', label: 'skills.log' },
  { id: 'interests', label: 'interests.txt' },
]

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

export default function AboutSection() {
  const [openFile, setOpenFile] = useState(null)

  const handleToggle = useCallback((id) => {
    setOpenFile(prev => prev === id ? null : id)
  }, [])

  return (
    <div className="about-section">
      {FILES.map((file, index) => {
        const isLast = index === FILES.length - 1
        const prefix = isLast ? '└── ' : '├── '
        const isOpen = openFile === file.id

        return (
          <div key={file.id} className="about-section__file">
            <button
              className={`about-section__file-label ${isOpen ? 'about-section__file-label--open' : ''}`}
              onClick={() => handleToggle(file.id)}
              aria-expanded={isOpen}
            >
              <span className="about-section__prefix">{prefix}</span>
              <span className="about-section__filename">{file.label}</span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div className="about-section__file-content" {...expandAnimation}>
                  <div className="about-section__content-inner">
                    {file.id === 'bio' && <BioContent />}
                    {file.id === 'skills' && <SkillsContent />}
                    {file.id === 'interests' && <InterestsContent />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

function BioContent() {
  return (
    <div className="about-bio">
      {bio.split('\n\n').map((paragraph, i) => (
        <p key={i} className="about-bio__paragraph">{paragraph}</p>
      ))}
    </div>
  )
}

function SkillsContent() {
  return (
    <div className="about-skills">
      {skills.map((group) => (
        <div key={group.category} className="about-skills__group">
          <span className="about-skills__category">{group.category}:</span>
          <span className="about-skills__items">{group.items.join(', ')}</span>
        </div>
      ))}
    </div>
  )
}

function InterestsContent() {
  return (
    <ul className="about-interests">
      {interests.map((interest, i) => (
        <li key={i} className="about-interests__item">→ {interest}</li>
      ))}
    </ul>
  )
}
