import { fetchContents } from '@/api/fetch-contents'
import { ContentsArea, DirectoryItem, FileItem } from '@/components/ContentsArea'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { useStorageContext } from '@/providers/StorageProvider'
import { queryOptions } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

function getQueryOptions({ path }: { path: string }) {
  return queryOptions({
    queryKey: ['storage', path],
    queryFn: () => fetchContents({ path })
  })
}

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const home = await getContext().queryClient.ensureQueryData(getQueryOptions({ path: "/" }))
    return { home }
  },
  component: App,
})

function App() {
  const { home } = Route.useRouteContext()
  const { path } = useStorageContext()

  return (
    <div className="h-screen divide-y flex flex-col">
      <nav className="h-10">
        <Path />
      </nav>
      <div className="flex-1 flex divide-x">
        <ul className="h-full p-2 min-w-52">
          {home.map(item => (
            <li key={item.name}>
              {item.isDir ?
                <DirectoryItem item={item} />
                :
                <FileItem item={item} />
              }
            </li>
          ))}
        </ul>
        <main className="flex-1">
          {path === "/" ? "Home" : <>
            <ContentsArea />
          </>}
        </main>
      </div>
    </div>
  )
}


function Path() {
  const { path } = useStorageContext()
  return <div>{path}</div>
}
