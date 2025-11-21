import { fetchContents, type Item } from "@/api/fetch-contents"
import { useStorageContext } from "@/providers/StorageProvider"
import { useQuery } from "@tanstack/react-query"
import { FileIcon, FolderIcon } from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu"

export function ContentsArea() {
  const { path } = useStorageContext()
  const query = useQuery({
    queryKey: ['storage', path],
    queryFn: () => fetchContents({ path })
  })

  return <ContextMenu>
    <ContextMenuTrigger>
      <ul className="h-full text-sm border-8">
        {query.data?.map(item => (
          <li key={item.name}>
            {item.isDir ? (
              <DirectoryItem item={item} />
            ) : <FileItem item={item} />}
          </li>
        ))}
      </ul>
    </ContextMenuTrigger>

    <ContextMenuContent>
      <ContextMenuItem>
        <FolderIcon size={18} />
        Create folder
      </ContextMenuItem>

    </ContextMenuContent>
  </ContextMenu>
}

export function DirectoryItem(props: { item: Item }) {
  const { setPath } = useStorageContext()
  const handleClick = () => {
    setPath(props.item.path)
  }
  const handleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  return <div className="flex gap-2 text-sm" onContextMenu={handleContextMenu} onClick={handleClick}><ItemIcon type={"folder"} />{props.item.name}</div>
}

export function FileItem(props: { item: Item }) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  return <div className="flex gap-2 text-sm" onContextMenu={handleContextMenu}><ItemIcon type={"file"} />{props.item.name}</div>
}

export type ItemType = "file" | "folder"

export function ItemIcon(props: { type: ItemType }) {

  return props.type === "file" ? <FileIcon size={16} /> : <FolderIcon size={16} className="fill-yellow-500" />
}
