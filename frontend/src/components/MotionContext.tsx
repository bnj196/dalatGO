import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { ReactNode } from 'react'

export type PlatformType = 'desktop' | 'tablet' | 'mobile' | 'watch' | 'tv'
export type ContentPersonality = 'ecommerce' | 'editorial' | 'saas'

interface MotionContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  platform: PlatformType
  durationModifier: number
  motionIntensity: number
  viewportWidth: number
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined)

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('dalatgo_theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialReducedMotion(): boolean {
  const saved = localStorage.getItem('dalatgo_reduced_motion')
  if (saved !== null) return saved === 'true'
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getPlatform(width: number): { platform: PlatformType; modifier: number } {
  if (width < 380) return { platform: 'watch', modifier: 0.6 }
  if (width <= 768) return { platform: 'mobile', modifier: 0.8 }
  if (width <= 1024) return { platform: 'tablet', modifier: 0.9 }
  if (width <= 1440) return { platform: 'desktop', modifier: 1.0 }
  return { platform: 'tv', modifier: 1.3 }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme)
  const [reducedMotion, setReducedMotionState] = useState<boolean>(getInitialReducedMotion)
  const [width, setWidth] = useState<number>(() => typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { platform, modifier } = useMemo(() => getPlatform(width), [width])

  // In dark mode, motion intensity is reduced by 10-20% (here 18% -> 0.82)
  const motionIntensity = theme === 'dark' ? 0.82 : 1.0

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-motion', reducedMotion ? 'reduced' : 'standard')
    root.setAttribute('data-platform', platform)
    root.style.setProperty('--platform-dur-mod', modifier.toString())
    root.style.setProperty('--motion-intensity', motionIntensity.toString())
    localStorage.setItem('dalatgo_theme', theme)
  }, [theme, reducedMotion, platform, modifier, motionIntensity])

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme)
  }

  const toggleReducedMotion = () => {
    setReducedMotionState(prev => {
      const next = !prev
      localStorage.setItem('dalatgo_reduced_motion', String(next))
      return next
    })
  }

  return (
    <MotionContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        reducedMotion,
        toggleReducedMotion,
        platform,
        durationModifier: modifier,
        motionIntensity,
        viewportWidth: width,
      }}
    >
      {children}
    </MotionContext.Provider>
  )
}

export function useMotion() {
  const context = useContext(MotionContext)
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider')
  }
  return context
}
