import { useContext, type PropsWithChildren, useState, createContext } from "react"

export type StorageContext = {
  path: string
  setPath: (path: string) => void
}

export const StorageContext = createContext<StorageContext | null>(null)

export function useStorageContext() {
  const context = useContext(StorageContext)
  if (!context) throw new Error("StorageProvider not found")
  return context
}

export function StorageProvider(props: PropsWithChildren) {
  const [path, setPath] = useState("/")
  return <StorageContext.Provider value={{ path, setPath }}>
    {props.children}
  </StorageContext.Provider>
}
