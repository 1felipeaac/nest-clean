import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { PrismaService } from "src/prisma/prisma.service";

describe('Create account (E2E)', ()=>{
    let app: INestApplication;
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule],
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService)
        await app.init();
      });

    test('[POST] /accounts', async () =>{
       const response = await request(app.getHttpServer()).post('/accounts').send({
            name: 'Felipe',
            email: 'felipe@email.com',
            password: '123456'
        })

        expect(response.statusCode).toBe(201)

        const userOnDatabase = await prisma.user.findUnique({
            where: {
                email: 'felipe@email.com',
            }
        })

        expect(userOnDatabase).toBeTruthy()

    })
})