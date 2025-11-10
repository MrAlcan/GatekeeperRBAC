import { Pool, type QueryResult, type QueryResultRow } from 'pg'
import { environments } from '@/infrastructure/config'

const PG_HOST = environments.POSTGRES_DB_HOST
const PG_PORT = environments.POSTGRES_DB_PORT
const PG_USER = environments.POSTGRES_DB_USER
const PG_PASSWORD = environments.POSTGRES_DB_PASS
const PG_DATABASE = environments.POSTGRES_DB_NAME

if ( !PG_HOST || !PG_PORT || !PG_USER || !PG_PASSWORD || !PG_DATABASE ) {
  throw new Error( 'Missing required Postgres env vars' )
}

export class RbacClient {
  private static instance: RbacClient
  private pool: Pool

  private constructor() {
    this.pool = new Pool({
      host: PG_HOST,
      port: Number( PG_PORT ),
      user: PG_USER,
      password: PG_PASSWORD,
      database: PG_DATABASE,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  }

  static getInstance(): RbacClient {
    if ( !RbacClient.instance ) {
      RbacClient.instance = new RbacClient()
    }
    return RbacClient.instance
  }

  async query<R extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<R>> {
    return this.pool.query<R>( text, params )
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}