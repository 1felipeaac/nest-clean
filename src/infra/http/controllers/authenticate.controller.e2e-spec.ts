import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { StudentFactory } from "test/factories/make-students";
import { DatabaseModule } from "src/infra/database/database.module";
import { hash } from "bcryptjs";

describe('Authenticate (E2E)', ()=>{
    let app: INestApplication;
    let studentFactory: StudentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        studentFactory = moduleRef.get(StudentFactory)
        await app.init();

      });

    test('[POST] /sessions', async () =>{
      await studentFactory.makePrismaStudent({
        email: 'felipe@email.com',
        password: await hash('123456',8)
      })

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