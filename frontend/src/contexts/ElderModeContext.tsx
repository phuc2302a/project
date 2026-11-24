import React, { createContext, useContext, useEffect, useState } from 'react'

interface ElderModeContextType {
  isElderMode: boolean
  toggleElderMode: () => void
}

const ElderModeContext = createContext<ElderModeContextType>({
  isElderMode: false,
  toggleElderMode: () => {}
})

export const ElderModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElderMode, setIsElderMode] = useState<boolean>(() => {
    return localStorage.getItem('la_chan_so_elder_mode') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('la_chan_so_elder_mode', isElderMode ? 'true' : 'false')
    if (isElderMode) {
      document.documentElement.classList.add('elder-mode')
    } else {
      document.documentElement.classList.remove('elder-mode')
    }
  }, [isElderMode])

  const toggleElderMode = () => setIsElderMode(prev => !prev)

  return (
    <ElderModeContext.Provider value={{ isElderMode, toggleElderMode }}>
      {children}
    </ElderModeContext.Provider>
  )
}

export const useElderMode = () => useContext(ElderModeContext)
