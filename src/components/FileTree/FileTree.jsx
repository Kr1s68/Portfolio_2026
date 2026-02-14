import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FileTree.css";

const TREE = [
  {
    id: "work",
    label: "work",
    files: [
      { id: "bitmovin-2025", label: "bitmovin.log" },
      { id: "kirova-2022", label: "kirova-ood-2022.log" },
      { id: "kirova-2021", label: "kirova-ood-2021.log" },
      { id: "Ubisoft 2022 - Present", label: "ubisoft.log" },
    ],
  },
  {
    id: "projects",
    label: "projects",
    files: [
      { id: "pl4yer", label: "pl4yer.md" },
      { id: "steam-api", label: "steam-api.md" },
      { id: "video-editor", label: "video-editor.md" },
      { id: "aromatica-bulgaria", label: "aromatica-bulgaria.md" },
      { id: "studify-ai", label: "studify-ai.md" },
      { id: "dream-builder", label: "dream-builder.md" },
      { id: "mind-map", label: "mind-map.md" },
    ],
  },
  {
    id: "freelance",
    label: "freelance",
    files: [
      { id: "web-development", label: "web-development.txt" },
      { id: "ui-ux-design", label: "ui-ux-design.txt" },
      { id: "coaching", label: "coaching.txt" },
    ],
  },
  {
    id: "testimonials",
    label: "testimonials",
    files: [{ id: "rec-stefan-lederer", label: "stefan-lederer.txt" }],
  },
  {
    id: "about",
    label: "about",
    files: [
      { id: "bio", label: "bio.txt" },
      { id: "skills", label: "skills.log" },
      { id: "interests", label: "interests.txt" },
    ],
  },
  {
    id: "contact",
    label: "contact",
    files: [
      { id: "contact-form", label: "send-message.sh" },
      { id: "socials", label: "socials.txt" },
    ],
  },
];

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
};

export default function FileTree({ activeFile, onFileSelect }) {
  const [openDir, setOpenDir] = useState(null);

  const handleDirToggle = useCallback((id) => {
    setOpenDir((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="file-tree">
      {TREE.map((dir, dirIndex) => {
        const isLastDir = dirIndex === TREE.length - 1;
        const dirPrefix = isLastDir ? "└── " : "├── ";
        const isDirOpen = openDir === dir.id;

        return (
          <div key={dir.id} className="file-tree__dir">
            <button
              className={`file-tree__dir-label ${isDirOpen ? "file-tree__dir-label--open" : ""}`}
              onClick={() => handleDirToggle(dir.id)}
              aria-expanded={isDirOpen}
            >
              <span className="file-tree__prefix">{dirPrefix}</span>
              <span className="file-tree__dir-name">{dir.label}/</span>
            </button>

            <AnimatePresence>
              {isDirOpen && (
                <motion.div className="file-tree__files" {...expandAnimation}>
                  <div className="file-tree__files-inner">
                    {dir.files.map((file, fileIndex) => {
                      const isLastFile = fileIndex === dir.files.length - 1;
                      const filePrefix = isLastFile ? "└── " : "├── ";
                      const isActive = activeFile === file.id;

                      return (
                        <button
                          key={file.id}
                          className={`file-tree__file ${isActive ? "file-tree__file--active" : ""}`}
                          onClick={() => onFileSelect(file.id)}
                        >
                          <span className="file-tree__prefix">
                            {filePrefix}
                          </span>
                          <span className="file-tree__file-name">
                            {file.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
