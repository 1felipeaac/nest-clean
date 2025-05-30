import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "src/infra/database/database.module";
import { StudentFactory } from "test/factories/make-students";
import { QuestionFactory } from "test/factories/make-question";

describe('Upload Attachments (E2E)', ()=>{
    let app: INestApplication;
    let studentFactory: StudentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, QuestionFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        jwt = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        await app.init();

       
      });

    test('[POST] /attachments', async () =>{

       const user = await studentFactory.makePrismaStudent()

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       const response = await request(app.getHttpServer())
        .post('/attachments')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', './test/e2e/sample-upload.png')

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
          attachmentId: expect.any(String)
        })

    })
})