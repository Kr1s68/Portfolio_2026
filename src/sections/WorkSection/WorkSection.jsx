import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { workExperience } from '../../data/workData'
import './WorkSection.css'

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

export default function WorkSection() {
  const [openJob, setOpenJob] = useState(null)

  const handleToggle = useCallback((id) => {
    setOpenJob(prev => prev === id ? null : id)
  }, [])

  return (
    <div className="work-section">
      {workExperience.map((job, index) => {
        const isLast = index === workExperience.length - 1
        const prefix = isLast ? '└── ' : '├── '
        const isOpen = openJob === job.id

        return (
          <div key={job.id} className="work-section__job">
            <button
              className={`work-section__job-label ${isOpen ? 'work-section__job-label--open' : ''}`}
              onClick={() => handleToggle(job.id)}
              aria-expanded={isOpen}
            >
              <span className="work-section__prefix">{prefix}</span>
              <span className="work-section__filename">{job.company.toLowerCase().replace(/\s+/g, '-')}.log</span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div className="work-section__job-content" {...expandAnimation}>
                  <div className="work-section__content-inner">
                    <div className="work-section__role">{job.role}</div>
                    <div className="work-section__company">{job.company}</div>
                    <div className="work-section__period">{job.period}</div>
                    <ul className="work-section__tasks">
                      {job.description.map((task, i) => (
                        <li key={i} className="work-section__task">→ {task}</li>
                      ))}
                    </ul>
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
