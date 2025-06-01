import {config} from 'dotenv'

import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'

config({path: '.env', override: true})
config({path: '.env.test', override: true})

const prisma = new PrismaClient

function generateUniqueDataBaseURL(schemaID: string){
    if(!process.env.DATABASE_URL){
        throw new Error('Please provider a DATBASE_URL enviroment variable')
    }
    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schemaID)

    return url.toString()
}

const schemaID = randomUUID()

beforeAll(async () => {

    const databaseURL = generateUniqueDataBaseURL(schemaID)

    process.env.DATABASE_URL = databaseURL

    execSync('pnpm prisma migrate deploy')
    
})
afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`)
    await prisma.$disconnect()
})