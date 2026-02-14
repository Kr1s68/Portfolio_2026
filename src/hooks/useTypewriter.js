import { useState, useEffect, useCallback } from 'react'

export function useTypewriter(text, speed = 60, startDelay = 0) {
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone] = useState(false)

  const reset = useCallback(() => {
    setDisplayedText('')
    setIsDone(false)
  }, [])

  useEffect(() => {
    reset()

    const delayTimeout = setTimeout(() => {
      let index = 0

      const interval = setInterval(() => {
        index++
        setDisplayedText(text.slice(0, index))

        if (index >= text.length) {
          clearInterval(interval)
          setIsDone(true)
        }
      }, speed)

      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(delayTimeout)
  }, [text, speed, startDelay, reset])

  return { displayedText, isDone }
}
