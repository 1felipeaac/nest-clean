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
import { waitFor } from "test/utils/wait-for";
import { DomainEvents } from "src/core/events/domain-events";

describe('On Question Best Answer chosen (E2E)', ()=>{
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService
    let studentFactory: StudentFactory
    let answerFactory: AnswerFactory
    let questionFactory: QuestionFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, QuestionFactory, AnswerFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        jwt = moduleRef.get(JwtService)
        await app.init();

        DomainEvents.shouldRun = true

      });

    it('should send a notification when question best answer is chosen', async () =>{

       const user = await studentFactory.makePrismaStudent()

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
       })

       const questionId = question.id

       const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId
       })

       const answerId = answer.id.toString()

       await request(app.getHttpServer())
        .patch(`/answers/${answerId}/choose-as-best`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      await waitFor(async () => {
        const notificationOnDatabase = await prisma.notification.findFirst({
            where: {
                recipientId: user.id.toString()
            }
        })

        expect(notificationOnDatabase).not.toBeNull()
      })

    })
})