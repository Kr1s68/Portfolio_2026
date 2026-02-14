import { useEffect, useRef } from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'
import './TypewriterText.css'

export default function TypewriterText({ text, speed = 60, startDelay = 0, onComplete }) {
  const { displayedText, isDone } = useTypewriter(text, speed, startDelay)
  const calledRef = useRef(false)

  useEffect(() => {
    if (isDone && onComplete && !calledRef.current) {
      calledRef.current = true
      onComplete()
    }
  }, [isDone, onComplete])

  return (
    <span className="typewriter">
      <span className="typewriter__text">{displayedText}</span>
      <span className={`typewriter__cursor ${isDone ? 'typewriter__cursor--blink' : ''}`}>_</span>
    </span>
  )
}
