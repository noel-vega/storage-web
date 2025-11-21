import z from "zod"



export const ItemSchema = z.object({
  name: z.string(),
  isDir: z.boolean(),
  size: z.int(),
  path: z.string()
})

export type Item = z.infer<typeof ItemSchema>

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
  const data = await response.json()
  console.log(data)
  return ItemSchema.array().parse(data)
}

