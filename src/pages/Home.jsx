import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TerminalHeader from "../components/TerminalHeader/TerminalHeader";
import TypewriterText from "../components/TypewriterText/TypewriterText";
import FileTree from "../components/FileTree/FileTree";
import { workExperience } from "../data/workData";
import { projects } from "../data/projectsData";
import { freelanceServices } from "../data/freelanceData";
import { recommendations } from "../data/recommendationsData";
import { bio, skills, interests, github } from "../data/aboutData";
import GithubCalednar from "../components/GithubCalendar/GithubCalendar";
import ContactForm from "../sections/ContactSection/ContactForm";
import Socials from "../sections/ContactSection/Socials";
import "./App.css";

//TODO: Add a "github.app" file with a github commit history and other data inspired by enscribe.dev

function getFileContent(fileId, onFileSelect) {
  const job = workExperience.find((j) => j.id === fileId);
  if (job)
    return {
      title: `~/work/${job.company.toLowerCase().replace(/\s+/g, "-")}.log`,
      content: <WorkContent job={job} />,
    };

  const project = projects.find((p) => p.id === fileId);
  if (project)
    return {
      title: `~/projects/${project.fileName}`,
      content: <ProjectContent project={project} />,
    };

  const service = freelanceServices.find((s) => s.id === fileId);
  if (service)
    return {
      title: `~/freelance/${service.id}.txt`,
      content: <FreelanceContent service={service} />,
    };

  if (fileId === "all-testimonials")
    return {
      title: "~/testimonials/testimonials.txt",
      content: <TestimonialsContent />,
    };

  if (fileId === "bio")
    return { title: "~/about/bio.txt", content: <BioContent /> };
  if (fileId === "skills")
    return {
      title: "~/about/skills.log",
      content: <SkillsContent onFileSelect={onFileSelect} />,
    };
  if (fileId === "interests")
    return { title: "~/about/interests.txt", content: <InterestsContent /> };
  if (fileId === "github")
    return { title: "~/about/github.app", content: <GithubContent /> };

  if (fileId === "contact-form")
    return { title: "~/contact/send-message.sh", content: <ContactForm /> };
  if (fileId === "socials")
    return { title: "~/contact/socials.txt", content: <Socials /> };

  return null;
}

const panelAnimation = {
  initial: { x: 60, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [isSplit, setIsSplit] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBootComplete(true);
  }, []);

  const handleFileSelect = useCallback((id) => {
    setActiveFile((prev) => {
      const next = prev === id ? null : id;
      if (next) setIsSplit(true);
      return next;
    });
  }, []);

  const handleExitComplete = useCallback(() => {
    if (!activeFile) setIsSplit(false);
  }, [activeFile]);

  const fileContent = activeFile
    ? getFileContent(activeFile, handleFileSelect)
    : null;

  return (
    <div className={`layout ${isSplit ? "layout--split" : "layout--centered"}`}>
      <div className="layout__sidebar">
        <div className="terminal">
          <TerminalHeader />
          <div className="terminal__body">
            <div className="terminal__prompt-line">
              <span className="terminal__user">kristiyan@portfolio</span>
              <span className="terminal__separator">:</span>
              <span className="terminal__path">~</span>
              <span className="terminal__dollar">$ </span>
              <TypewriterText
                text="ls"
                speed={120}
                startDelay={500}
                onComplete={handleBootComplete}
              />
            </div>

            {bootComplete && (
              <div className="terminal__content">
                <FileTree
                  activeFile={activeFile}
                  onFileSelect={handleFileSelect}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="layout__panel">
        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          {fileContent && (
            <motion.div
              key={activeFile}
              className={`content-panel`}
              {...panelAnimation}
            >
              <div className="content-panel__header">
                <span className="content-panel__path">{fileContent.title}</span>
                <button
                  className="content-panel__close"
                  onClick={() => setActiveFile(null)}
                  aria-label="Close panel"
                >
                  [x]
                </button>
              </div>
              <div className="content-panel__body">{fileContent.content}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Inline content components ---------- */

function WorkContent({ job }) {
  return (
    <div className="file-content">
      <h2 className="file-content__title">{job.role}</h2>
      <div className="file-content__subtitle">{job.company}</div>
      <div className="file-content__meta">{job.period}</div>

      <h3 className="file-content__section-heading">## What I did</h3>
      <ul className="file-content__list">
        {job.whatIDid.map((item, i) => (
          <li key={i}>→ {item}</li>
        ))}
      </ul>

      <h3 className="file-content__section-heading">## What I learned</h3>
      <ul className="file-content__list">
        {job.whatILearned.map((item, i) => (
          <li key={i}>→ {item}</li>
        ))}
      </ul>

      <h3 className="file-content__section-heading">## What I'd do</h3>
      <ul className="file-content__list">
        {job.whatIdDo.map((item, i) => (
          <li key={i}>→ {item}</li>
        ))}
      </ul>

      <a
        className="file-content__link"
        href="/Kristiyan_Boyanov_CV.pdf"
        download
      >
        → Download my CV
      </a>
    </div>
  );
}

function ProjectContent({ project }) {
  return (
    <div className="file-content file-content--split">
      <div className="file-content__left">
        <h2 className="file-content__title">{project.name}</h2>
        <div className="file-content__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="file-content__tag">
              [{tag}]
            </span>
          ))}
        </div>
        <p className="file-content__text">{project.description}</p>
        {project.github && (
          <a
            className="file-content__link"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            → View on GitHub
          </a>
        )}
        {project.sections?.map((section, i) => (
          <div key={i}>
            <h3 className="file-content__section-heading">{section.heading}</h3>
            <p className="file-content__text">{section.text}</p>
          </div>
        ))}
      </div>
      {project.images?.length > 0 && (
        <div className="file-content__right">
          {project.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${project.name} ${i + 1}`}
              className="file-content__image"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FreelanceContent({ service }) {
  return (
    <div className="file-content">
      <h2 className="file-content__title">{service.title}</h2>
      {service.sections.map((section, i) => (
        <div key={i}>
          <h3 className="file-content__section-heading">{section.heading}</h3>
          <p className="file-content__text">{section.text}</p>
        </div>
      ))}
    </div>
  );
}

function TestimonialsContent() {
  return (
    <div className="file-content">
      {recommendations.map((rec) => (
        <div key={rec.id} className="file-content__testimonial">
          <blockquote className="file-content__quote">"{rec.text}"</blockquote>
          <div className="file-content__author">
            — {rec.author}, {rec.role} at {rec.company}
          </div>
        </div>
      ))}
    </div>
  );
}

function BioContent() {
  return (
    <div className="file-content">
      {bio.split("\n\n").map((paragraph, i) => (
        <p key={i} className="file-content__text">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function SkillsContent({ onFileSelect }) {
  return (
    <div className="file-content">
      {skills.map((group) => (
        <div key={group.category} className="file-content__skill-group">
          <h3 className="file-content__section-heading">## {group.category}</h3>
          <ul className="file-content__skill-list">
            {group.items.map((skill) => (
              <li key={skill.name} className="file-content__skill-item">
                <span className="file-content__skill-name">{skill.name}</span>
                {skill.projects?.length > 0 && (
                  <span className="file-content__skill-projects">
                    {skill.projects.map((proj, i) => (
                      <button
                        key={proj.id}
                        className="file-content__skill-project-link"
                        onClick={() => onFileSelect(proj.id)}
                      >
                        {i > 0 && " "}[{proj.label}]
                      </button>
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function InterestsContent() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="file-content">
      <ul className="file-content__list">
        {interests.map((interest, i) => (
          <li key={i}>
            {interest.recommendations ? (
              <>
                <button
                  className="file-content__interest-toggle"
                  onClick={() =>
                    setOpenIndex((prev) => (prev === i ? null : i))
                  }
                >
                  {openIndex === i ? "▾" : "▸"} {interest.text}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.ul
                      className="file-content__book-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {interest.recommendations.map((item, j) => (
                        <li key={j} className="file-content__book-item">
                          — {item}
                        </li>
                      ))}
                      {interest.note && (
                        <p className="file-content__interest-note">
                          {interest.note}
                        </p>
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>→ {interest.text}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function GithubContent() {
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  return (
    <div className="file-content file-content--split">
      <div className="file-content__left">
        <h2 className="file-content__title">{github.title}</h2>
        <GithubCalednar
          username={github.title}
          from={sixMonthsAgo.toISOString()}
          to={today.toISOString()}
        />
      </div>
      <div className="file-content__right"></div>
    </div>
  );
}
