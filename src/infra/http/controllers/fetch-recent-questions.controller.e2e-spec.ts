import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-students";
import { DatabaseModule } from "src/infra/database/database.module";
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";

describe('Fetch recent question (E2E)', ()=>{
    let app: INestApplication;
    let jwt: JwtService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, QuestionFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        jwt = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        await app.init();

       
      });

    test('[GET] /questions', async () =>{

       const user = await studentFactory.makePrismaStudent()

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       await Promise.all([
           questionFactory.makePrismaQuestion({
                title: "Questao 01",
                slug: Slug.create("questao-01"),
                authorId: user.id
           }),
           questionFactory.makePrismaQuestion({
                title: "Questao 02",
                slug: Slug.create("questao-02"),
                authorId: user.id
           })
       ]) 


       const response = await request(app.getHttpServer())
        .get('/questions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            questions: expect.arrayContaining([
                expect.objectContaining({title: "Questao 02"}),
                expect.objectContaining({title: "Questao 01"}),
            ])
        })

    })
})