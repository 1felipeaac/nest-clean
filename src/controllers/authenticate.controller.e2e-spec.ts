import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { PrismaService } from "src/prisma/prisma.service";

describe('Authenticate (E2E)', ()=>{
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

        await request(app.getHttpServer()).post('/accounts').send({
          name: 'Felipe',
          email: 'felipe@email.com',
          password: '123456',
        });
      });

    test('[POST] /sessions', async () =>{

       const response = await request(app.getHttpServer()).post('/sessions').send({
            email: 'felipe@email.com',
            password: '123456'
        })

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
          access_token: expect.any(String)
        })

    })
})