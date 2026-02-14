import { useRef, useState, useCallback } from 'react'
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_kcihpts'
const TEMPLATE_ID = 'template_wwan76r'
const PUBLIC_KEY = 'BRQIzv6DfpMLYCmej'

export function useContactForm() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      setStatus('success')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }, [])

  return { formRef, status, handleSubmit }
}
