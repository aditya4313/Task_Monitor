import { MongoClient, Db, MongoClientOptions } from 'mongodb'

// MongoDB Atlas connection string
// URL encode the password to handle special characters safely
const password = encodeURIComponent('5OAmEY2puAK4sy2Q')
const defaultUri = `mongodb+srv://adityaevan433_db_user:${password}@cluster0.izae84x.mongodb.net/goal_tracker?retryWrites=true&w=majority&appName=Cluster0`

const uri: string = process.env.MONGODB_URI || defaultUri

// MongoDB connection options for Atlas
// Note: mongodb+srv:// automatically handles TLS, don't set tls options explicitly
const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 30000, // Timeout after 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 30000, // Connection timeout
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 1, // Maintain at least 1 socket connection
  maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
  retryWrites: true,
  retryReads: true,
  // Don't set TLS options - mongodb+srv:// handles it automatically
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise
    
    // Test the connection
    await client.db('admin').command({ ping: 1 })
    
    return client.db('goal_tracker')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // More helpful error messages
    if (errorMessage.includes('SSL') || errorMessage.includes('TLS')) {
      throw new Error(
        `MongoDB SSL/TLS connection error. Please check:\n` +
        `1. Your internet connection\n` +
        `2. MongoDB Atlas cluster is running\n` +
        `3. Your IP address is whitelisted in Atlas Network Access\n` +
        `4. Connection string is correct\n\n` +
        `Error: ${errorMessage}`
      )
    }
    
    throw new Error(
      `Failed to connect to MongoDB: ${errorMessage}\n\n` +
      'Please check your MONGODB_URI in .env.local:\n' +
      '  • MongoDB Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goal_tracker\n\n' +
      'Make sure:\n' +
      '  • MongoDB Atlas cluster is running\n' +
      '  • Your IP is whitelisted in Atlas Network Access (or use 0.0.0.0/0 for all IPs)\n' +
      '  • Database user credentials are correct'
    )
  }
}

export default clientPromise
