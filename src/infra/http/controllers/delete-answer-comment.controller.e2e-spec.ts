import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-students";
import { DatabaseModule } from "src/infra/database/database.module";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";

describe('Delete answer comment (E2E)', ()=>{
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService
    let studentFactory: StudentFactory
    let answerCommentFactory: AnswerCommentFactory
    let answerFactory: AnswerFactory
    let questionFactory: QuestionFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerCommentFactory = moduleRef.get(AnswerCommentFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        jwt = moduleRef.get(JwtService)
        await app.init();

       
      });

    test('[DELETE] /answers/comments/:id', async () =>{

       const user = await studentFactory.makePrismaStudent()

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
       })

       const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id
       })


       const answerComment = await answerCommentFactory.makePrismaAnswerComment({
        answerId: answer.id,
        authorId: user.id
       })
    
       const answerCommitId = answerComment.id.toString()

       const response = await request(app.getHttpServer())
        .delete(`/answers/comments/${answerCommitId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(response.statusCode).toBe(204)

        const commentOnDatabase = await prisma.comment.findUnique({
            where: {
                id: answerCommitId
            }
        })

        expect(commentOnDatabase).toBeNull()

    })
})