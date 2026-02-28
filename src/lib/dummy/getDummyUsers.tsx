import * as z from 'zod'
import { BetterAuthUser } from '@/src/lib/auth/server'
import _logger from '@/src/lib/log/Logger'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'
import { Any } from '@/types'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export const IdSchema = z.object({
  name: z.string(),
  value: z.string().catch(() => getUUID()),
})

export const NameSchema = z.object({
  title: z.string(),
  first: z.string().default(() => getRandomName().split(' ')[0]),
  last: z.string().default(() => getRandomName().split(' ')[1]),
})

export const PictureSchema = z.object({
  large: z.string(),
  medium: z.string(),
  thumbnail: z.string(),
})

export const DummyUserSchema = z
  .object({
    name: NameSchema,
    email: z.string().default(() => `${getRandomName().split(' ').join('.').toLowerCase()}@example.com`),
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

const { validate: validateDummyUser, instantiate } = schemaUtilities(DummyUserSchema)

export default async function getDummyUsers(count: number = 10): Promise<BetterAuthUser[]> {
  const endpoint = new URL('https://randomuser.me/api/')
  endpoint.searchParams.append('results', Math.round(count).toString())
  endpoint.searchParams.append('nat', 'AU')
  endpoint.searchParams.append('seed', 'dummyUsers')

  const users = await fetch(endpoint)
    .then((res) => res.json())
    .then((response: Any): BetterAuthUser[] => response.results.map(validateDummyUser))

  if (users.length !== count) {
    logger.error(`Dummy users length does not match requested size (${users.length} vs ${count})`)

    const instantiatedUsers = Array.from({ length: count }, () => validateDummyUser(instantiate()))
    return instantiatedUsers
  }

  return users
}

function getRandomName() {
  const names = [
    'Lucy Matthews',
    'Preston Guerrero',
    'Margot Pierce',
    'Nicolas Grimes',
    'Braelyn Bryant',
    'Jonah Daniels',
    'Ember McCullough',
    'Briar Mercado',
    'Mckinley Leon',
    'Marshall Sherman',
    'Addilyn Huynh',
    'Layton Hernandez',
    'Camila Delacruz',
    'Memphis Tucker',
    'Esther Miller',
    'Benjamin Cantrell',
    'Yamileth Suarez',
    'Soren Orr',
    'Alaiya Farley',
    'Graysen Patton',
    'Lorelei Cabrera',
    'Cade Welch',
    'Amira Wheeler',
    'Kenneth Glenn',
    'Blaire Parker',
    'Caleb Whitney',
    'Madalynn Baldwin',
    'Jaiden Simon',
    'Kalani Pham',
    'Russell Chambers',
    'Makayla Trejo',
    'Wesson Sharp',
    'Camryn Schultz',
    'Cody Cortes',
    'Lea Robbins',
    'Finnegan Wiley',
    'Lauryn Rice',
    'Graham Morton',
    'Mallory Newman',
    'Anderson Waller',
    'Whitley McCarty',
    'Blaise Velasquez',
    'Esme Rios',
    'Israel Sweeney',
    'Yara Nixon',
    'Cory Lozano',
    'Cecelia Barnett',
    'Stephen George',
    'Adelyn Griffin',
    'Ayden Underwood',
    'Ensley Hines',
    'Uriel Andrews',
    'Payton French',
    'Corey Ahmed',
    'Jolie Ahmed',
    'Harry Weaver',
    'Teagan Frazier',
    'Callum Fox',
    'Juliette Guerrero',
    'Bryce Reese',
    'Rosemary Walls',
    'Larry Dawson',
    'Veronica Medrano',
    'Arian Faulkner',
    'Ansley Hopkins',
    'Ali Flynn',
    'Dorothy Cole',
    'Nathaniel Cervantes',
    'Aylin Norton',
    'Callen Tran',
    'Kylie Perkins',
    'Kyrie Cruz',
    'Claire Orozco',
    'Keanu Prince',
    'Greta Ruiz',
    'Austin Watts',
    'Melissa Navarro',
    'Reid McCarthy',
    'Kira Lowery',
    'Jaxxon Maxwell',
    'Kyla Pittman',
    'Valentino Hayden',
    'Avayah Cisneros',
    'Alden Solomon',
    'Mylah Ali',
    'Arjun Ali',
    'Zelda Beasley',
    'Stanley Ward',
    'Ariana Solis',
    'Ronin Short',
    'Cheyenne Spencer',
    'Ace Lopez',
    'Gianna Cantu',
    'Anakin Proctor',
    'Chandler Baker',
    'Ezra Smith',
    'Olivia Rodgers',
    'Mathias Craig',
    'Brynn Liu',
    'Pedro Kennedy',
    'Brianna Brewer',
    'Cruz Dougherty',
    'Alisson Sellers',
    'Madden Lewis',
    'Ellie Church',
    'Terrance Williams',
    'Ava Soto',
    'Barrett Butler',
    'Athena Sweeney',
    'Nixon Jenkins',
    'Rylee McCarthy',
    'Devin Carlson',
    'Kali Rogers',
    'Colton Pugh',
    'Landry Miller',
    'Benjamin Casey',
    'Sylvia Madden',
    'Everest Harper',
    'Ana Vega',
    'Aidan Kerr',
    'Baylee Boone',
    'Mauricio Hurst',
    'Adalee Shannon',
    'Eliel Luna',
    'Journey Jaramillo',
    'Riggs Carpenter',
    'Lilly Gaines',
    'Talon Person',
    'Dylan Cervantes',
    'Kamari Chen',
    'Valeria Khan',
    'Kendrick Lozano',
    'Cecelia Warren',
    'Abel Reeves',
    'Lana Poole',
    'Quincy Poole',
    'Bonnie Booker',
    'Dominik Stuart',
    'Stormi Rowland',
    'Eliezer Bartlett',
    'Aubrielle Wilkins',
    'Yusuf Richardson',
    'Allison Mann',
    'Nehemiah Pena',
    'Rachel Villanueva',
    'Huxley Vaughn',
    'Reign Spencer',
    'Ace Sosa',
    'Cassandra Scott',
    'Leo Ortiz',
  ]

  const randomIndex = Math.round(Math.random() * 10 * names.length) % names.length

  return names[randomIndex]
}
