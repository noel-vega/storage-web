import { fetchContents, type TItem } from '@/api/fetch-contents'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { FileIcon, FolderIcon } from 'lucide-react'
import { useState } from 'react'

function getQueryOptions({ path }: { path: string }) {
  return queryOptions({
    queryKey: ['storage', path],
    queryFn: () => fetchContents({ path })
  })
}

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const root = await getContext().queryClient.ensureQueryData(getQueryOptions({ path: "/" }))
    return { root }
  },
  component: App,
})

type ItemType = "file" | "folder"

function ItemIcon(props: { type: ItemType }) {
  return props.type === "file" ? <FileIcon /> : <FolderIcon className="fill-yellow-500" />
}


function App() {
  const { root } = Route.useRouteContext()
  const [path, setPath] = useState("/")

  const query = useQuery({
    queryKey: ['storage', path],
    queryFn: () => fetchContents({ path })
  })

  const handleClickFolder = (item: TItem) => {
    setPath(item.name)
  }

  return (
    <div className="h-screen divide-y flex flex-col">
      <nav className="h-10">
        {path}
      </nav>
      <div className="flex-1 flex divide-x">
        <ul className="h-full p-2 min-w-52">
          {root.map(x => (
            <li key={x.name}>
              {x.isDir ? <>
                <div className="flex gap-3 py-1" onClick={() => handleClickFolder(x)}><ItemIcon type={"folder"} />{x.name}</div>
              </> : <>
                <div className="flex gap-3 py-1"><ItemIcon type={"file"} />{x.name}</div>
              </>}
            </li>
          ))}
        </ul>
        <main className="flex-1 p-2">
          {path === "" ? "Home" : <>
            <ul className="h-full text-sm">
              {query.data?.map(x => (
                <li key={x.name}>
                  <div className="flex gap-2" onClick={() => x.isDir ? handleClickFolder(x) : null}><ItemIcon type={x.isDir ? "folder" : "file"} />{x.name}</div>
                </li>
              ))}
            </ul>

          </>}
        </main>
      </div>

    </div>
  )
}
