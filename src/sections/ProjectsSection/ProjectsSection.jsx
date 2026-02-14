import { useState, useCallback } from 'react'
import { projects } from '../../data/projectsData'
import ProjectCard from './ProjectCard'
import './ProjectsSection.css'

export default function ProjectsSection() {
  const [openProject, setOpenProject] = useState(null)

  const handleToggle = useCallback((id) => {
    setOpenProject(prev => prev === id ? null : id)
  }, [])

  return (
    <div className="projects-section">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          isLast={index === projects.length - 1}
          isOpen={openProject === project.id}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}
