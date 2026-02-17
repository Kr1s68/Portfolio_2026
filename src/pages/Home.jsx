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
import GithubActivity from "../components/GithubActivity/GithubActivity";
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
        <div className="file-content__title-row">
          <h2 className="file-content__title">{project.name} </h2>
          {project.github && (
            <a
              className="file-content__github-link"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View GitHub profile"
            >
              <svg
                className="file-content__github-icon"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              <p style={{ marginInline: "10px" }}>{"(Click me)"}</p>
            </a>
          )}
        </div>
        <div className="file-content__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="file-content__tag">
              [{tag}]
            </span>
          ))}
        </div>
        <p className="file-content__text">{project.description}</p>
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
        <div className="file-content__title-row">
          <h2 className="file-content__title">{github.content_title}</h2>
          <a
            className="file-content__github-link"
            href={`https://github.com/${github.name}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View GitHub profile"
          >
            <svg
              className="file-content__github-icon"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <p style={{ marginInline: "10px" }}>
              {"(Since, you're already here... Please follow me on GitHub)"}
            </p>
          </a>
        </div>
        <p className="file-content__text">{github.activity_paragraphs[0]}</p>
        <GithubCalednar
          username={github.name}
          from={sixMonthsAgo.toISOString()}
          to={today.toISOString()}
        />
        <h3 className="file-content__section-heading">
          {github.activity_paragraphs[1]}
        </h3>
        <ul className="file-content__list">
          {github.repos.map((repo, i) => (
            <li key={i}>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
              <p className="file-content__text">{repo.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="file-content__right">
        <h2 className="file-content__title">Public Contributions History</h2>
        <GithubActivity username={github.name} limit={50} />
      </div>
    </div>
  );
}
