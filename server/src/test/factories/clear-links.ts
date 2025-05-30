import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export async function clearLinks() {
  await db.delete(schema.links)
}
