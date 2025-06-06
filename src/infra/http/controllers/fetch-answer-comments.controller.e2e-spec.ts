import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-students";
import { DatabaseModule } from "src/infra/database/database.module";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";

describe('Fetch answer comments (E2E)', ()=>{
    let app: INestApplication;
    let jwt: JwtService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let answerFactory: AnswerFactory
    let answerCommentFactory: AnswerCommentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        jwt = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        answerCommentFactory = moduleRef.get(AnswerCommentFactory)
        await app.init();

       
      });

    test('[GET] /answer/:answerId/comments', async () =>{

      const user = await studentFactory.makePrismaStudent({
        name: 'Felipe'
       })

       const accessToken = jwt.sign({sub: user.id.toString()})
       const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
        })

      const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id
      })

       await Promise.all([
           answerCommentFactory.makePrismaAnswerComment({
                authorId: user.id,
                answerId: answer.id,
                content: "Comment 01"
           }),
           answerCommentFactory.makePrismaAnswerComment({
                authorId: user.id,
                answerId: answer.id,
                content: "Comment 02"
           })
       ]) 

       const answerId = answer.id.toString()

       const response = await request(app.getHttpServer())
       .get(`/answers/${answerId}/comments`)
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