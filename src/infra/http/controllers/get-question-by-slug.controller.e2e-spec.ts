import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "src/infra/database/database.module";
import { StudentFactory } from "test/factories/make-students";
import { QuestionFactory } from "test/factories/make-question";
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";

describe('Get question by slug (E2E)', ()=>{
    let app: INestApplication;
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
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
        questionFactory = moduleRef.get(QuestionFactory)
        await app.init();

       
      });

    test('[GET] /questions/:slug', async () =>{

       const user = await studentFactory.makePrismaStudent()

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       await questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: "Questao 01",
        slug: Slug.create('questao-01')
       })

       const response = await request(app.getHttpServer())
        .get('/questions/questao-01')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            question: expect.objectContaining({title: "Questao 01"}),
            
        })

    })
})