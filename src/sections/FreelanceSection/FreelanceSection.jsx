import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { freelanceServices } from '../../data/freelanceData'
import './FreelanceSection.css'

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

export default function FreelanceSection() {
  const [openService, setOpenService] = useState(null)

  const handleToggle = useCallback((id) => {
    setOpenService(prev => prev === id ? null : id)
  }, [])

  return (
    <div className="freelance-section">
      {freelanceServices.map((service, index) => {
        const isLast = index === freelanceServices.length - 1
        const prefix = isLast ? '└── ' : '├── '
        const isOpen = openService === service.id

        return (
          <div key={service.id} className="freelance-section__service">
            <button
              className={`freelance-section__label ${isOpen ? 'freelance-section__label--open' : ''}`}
              onClick={() => handleToggle(service.id)}
              aria-expanded={isOpen}
            >
              <span className="freelance-section__prefix">{prefix}</span>
              <span className="freelance-section__filename">{service.id}.txt</span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div className="freelance-section__content" {...expandAnimation}>
                  <div className="freelance-section__content-inner">
                    <div className="freelance-section__title">{service.title}</div>
                    <p className="freelance-section__description">{service.description}</p>
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
