import { useState, useEffect } from 'react'

export const useScrollProgress = () => {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      const sections = document.querySelectorAll('section')
      const scrollPosition = window.scrollY + 200

      sections.forEach((section) => {
        const top = (section as HTMLElement).offsetTop
        const height = (section as HTMLElement).clientHeight
        const id = section.getAttribute('id') || ''
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(id)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollProgress = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

  return { scrollY, activeSection, scrollProgress }
}
