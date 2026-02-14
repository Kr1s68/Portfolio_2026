import { motion, AnimatePresence } from 'framer-motion'

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

export default function ProjectCard({ project, isLast, isOpen, onToggle }) {
  const prefix = isLast ? '└── ' : '├── '

  return (
    <div className="project-card">
      <button
        className={`project-card__label ${isOpen ? 'project-card__label--open' : ''}`}
        onClick={() => onToggle(project.id)}
        aria-expanded={isOpen}
      >
        <span className="project-card__prefix">{prefix}</span>
        <span className="project-card__filename">{project.fileName}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="project-card__content" {...expandAnimation}>
            <div className="project-card__content-inner">
              <div className="project-card__name">{project.name}</div>
              <div className="project-card__tags">
                {project.tags.map(tag => (
                  <span key={tag} className="project-card__tag">[{tag}]</span>
                ))}
              </div>
              <p className="project-card__description">{project.description}</p>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card__link"
                >
                  → Visit Website
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
