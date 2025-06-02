import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-students";
import { DatabaseModule } from "src/infra/database/database.module";
import { QuestionCommentFactory } from "test/factories/make-question-comment";

describe('Fetch question comments (E2E)', ()=>{
    let app: INestApplication;
    let jwt: JwtService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let questionCommentFactory: QuestionCommentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        jwt = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        questionCommentFactory = moduleRef.get(QuestionCommentFactory)
        await app.init();

       
      });

    test('[GET] /questions/:questionId/comments', async () =>{

       const user = await studentFactory.makePrismaStudent({
        name: 'Felipe'
       })

       const accessToken = jwt.sign({sub: user.id.toString()})
       const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
        })

       await Promise.all([
           questionCommentFactory.makePrismaQuestionComment({
                authorId: user.id,
                questionId: question.id,
                content: "Comment 01"
           }),
           questionCommentFactory.makePrismaQuestionComment({
                authorId: user.id,
                questionId: question.id,
                content: "Comment 02"
           })
       ]) 

       const questionId = question.id.toString()

       const response = await request(app.getHttpServer())
       .get(`/questions/${questionId}/comments`)
       .set('Authorization', `Bearer ${accessToken}`)
       .send()
       
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            comments: expect.arrayContaining([
                expect.objectContaining({content: "Comment 02", authorName: 'Felipe'}),
                expect.objectContaining({content: "Comment 01", authorName: 'Felipe'}),
            ])
        })

    })
})