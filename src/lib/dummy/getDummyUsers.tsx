import * as z from 'zod'
import { BetterAuthUser } from '@/src/lib/auth/server'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'
import { Any } from '@/types'

export const IdSchema = z.object({
  name: z.string(),
  value: z.string().catch(() => getUUID()),
})

export const NameSchema = z.object({
  title: z.string(),
  first: z.string(),
  last: z.string(),
})

export const PictureSchema = z.object({
  large: z.string(),
  medium: z.string(),
  thumbnail: z.string(),
})

export const DummyUserSchema = z
  .object({
    name: NameSchema,
    email: z.string(),
    id: IdSchema,
    picture: PictureSchema,
  })
  .transform(
    (user): BetterAuthUser => ({
      createdAt: new Date(Date.now()),
      emailVerified: !!Math.round(Math.random()),
      updatedAt: new Date(Date.now()),
      image: user.picture.thumbnail,
      isAnonymous: !!Math.round(Math.random()),
      id: user.id.value,
      email: user.email,
      name: `${user.name.first} ${user.name.last}`,
    }),
  )
export type DummyUser = z.infer<typeof DummyUserSchema>

const { validate: validateDummyUser } = schemaUtilities(DummyUserSchema)

export default async function getDummyUsers(count: number = 10): Promise<BetterAuthUser[]> {
  const endpoint = new URL('https://randomuser.me/api/')
  endpoint.searchParams.append('results', Math.round(count).toString())
  endpoint.searchParams.append('nat', 'AU')
  endpoint.searchParams.append('seed', 'dummyUsers')

  const users = await fetch(endpoint)
    .then((res) => res.json())
    .then((response: Any) => response.results.map(validateDummyUser))

  return users
}
