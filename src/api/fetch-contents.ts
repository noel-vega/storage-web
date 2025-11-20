import z from "zod"



export const ItemSchema = z.object({
  name: z.string(),
  isDir: z.boolean(),
  size: z.int()
})

export type TItem = z.infer<typeof ItemSchema>

type FetchContentsParams = {
  path: string
}

export async function fetchContents(params: FetchContentsParams) {
  const response = await fetch("/api/contents",
    {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
  return ItemSchema.array().parse(await response.json())
}

