// Inspired by next-themes
// https://github.com/pacocoursey/next-themes
"use client"

import * as React from "react"

const ThemeContext = React.createContext<
  | {
      theme: string
      setTheme: (theme: string) => void
    }
  | undefined
>(undefined)

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  attribute?: "class" | `data-${string}`
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
  nonce?: string
  disableTransitionOnChange?: boolean
}) {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window === "undefined") return props.defaultTheme || "system"
    return localStorage.getItem(props.storageKey || "theme") || props.defaultTheme || "system"
  })

  React.useEffect(() => {
    const root = window.document.documentElement
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    
    root.classList.remove("light", "dark")
    root.classList.add(isDark ? "dark" : "light")
    
    localStorage.setItem(props.storageKey || "theme", theme)
  }, [theme, props.storageKey])

  const value = {
    theme,
    setTheme: (newTheme: string) => {
      setTheme(newTheme)
    },
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
