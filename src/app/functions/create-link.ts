import { db } from "@/infra/db";
import { links } from "@/infra/db/schemas/links";
import { Either, makeRight, makeLeft } from "@/infra/shared/either";
import { z } from "zod";

export const createLinkInput = z.object({
  shortUrl: z.string().min(1),
  originalUrl: z.string().url(),
})

type CreateLinkInput = z.infer<typeof createLinkInput>

export async function createLink(input: CreateLinkInput): Promise<Either<Error, {}>> {
  try {
    await db.insert(links).values({ 
      short_url: input.shortUrl, 
      original_url: input.originalUrl 
    })

    return makeRight({ })
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return makeLeft(new Error(`Short URL "${input.shortUrl}" already exists`))
    }
    return makeLeft(error instanceof Error ? error : new Error('Unknown error occurred'))
  }
}