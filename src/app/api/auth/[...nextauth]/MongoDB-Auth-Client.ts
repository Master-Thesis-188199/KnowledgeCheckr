import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb'
import env from '@/lib/Shared/Env'

const args = env.NEXTAUTH_MONGODB_EXTRA_URI_ARGS ? `/?${env.NEXTAUTH_MONGODB_EXTRA_URI_ARGS}` : ''
const URI = `mongodb://${env.NEXTAUTH_MONGODB_HOST_NAME}:${env.NEXTAUTH_MONGODB_PORT}${args}`

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let mongoDbClient: MongoClient

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by Hot Module Replacement
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(URI, options)
  }
  mongoDbClient = globalWithMongo._mongoClient
} else {
  // In production mode, it's best to not use a global variable.
  mongoDbClient = new MongoClient(URI, options)
}

export default mongoDbClient
