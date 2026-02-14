import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { recommendations } from '../../data/recommendationsData'
import './RecommendationsSection.css'

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

export default function RecommendationsSection() {
  const [openRec, setOpenRec] = useState(null)

  const handleToggle = useCallback((id) => {
    setOpenRec(prev => prev === id ? null : id)
  }, [])

  return (
    <div className="recs-section">
      {recommendations.map((rec, index) => {
        const isLast = index === recommendations.length - 1
        const prefix = isLast ? '└── ' : '├── '
        const isOpen = openRec === rec.id

        return (
          <div key={rec.id} className="recs-section__rec">
            <button
              className={`recs-section__label ${isOpen ? 'recs-section__label--open' : ''}`}
              onClick={() => handleToggle(rec.id)}
              aria-expanded={isOpen}
            >
              <span className="recs-section__prefix">{prefix}</span>
              <span className="recs-section__filename">{rec.author.toLowerCase().replace(/\s+/g, '-')}.txt</span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div className="recs-section__content" {...expandAnimation}>
                  <div className="recs-section__content-inner">
                    <blockquote className="recs-section__quote">"{rec.text}"</blockquote>
                    <div className="recs-section__author">
                      — {rec.author}, {rec.role} at {rec.company}
                    </div>
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
