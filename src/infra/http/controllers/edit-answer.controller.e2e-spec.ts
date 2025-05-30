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
import { AttachmentFactory } from "test/factories/make-attachments";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";

describe('Edit Answer (E2E)', ()=>{
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService
    let studentFactory: StudentFactory
    let answerFactory: AnswerFactory
    let attachmentFactory: AttachmentFactory
    let answerAttachmentFactory: AnswerAttachmentFactory
    let questionFactory: QuestionFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, QuestionFactory, AnswerFactory, AttachmentFactory, AnswerAttachmentFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
        attachmentFactory = moduleRef.get(AttachmentFactory)
        jwt = moduleRef.get(JwtService)
        await app.init();

       
      });

    test('[PUT] /answers/:id', async () =>{

       const user = await studentFactory.makePrismaStudent()

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
       })
       const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id
       })

       const answerId = answer.id.toString()

       const attachment1 = await attachmentFactory.makePrismaAttachment()
       const attachment2 = await attachmentFactory.makePrismaAttachment()

       await answerAttachmentFactory.makePrismaAttachmentAttachment({
        attachmentId: attachment1.id,
        answerId: answer.id
       })
       await answerAttachmentFactory.makePrismaAttachmentAttachment({
        attachmentId: attachment2.id,
        answerId: answer.id
       })

       const attachment3 = await attachmentFactory.makePrismaAttachment()

       const response = await request(app.getHttpServer())
        .put(`/answers/${answerId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            content: 'Novo conteudo da resposta',
            attachments: [
              attachment1.id.toString(),
              attachment3.id.toString()
            ]
        })

        expect(response.statusCode).toBe(204)

        const answerOnDatabase = await prisma.answer.findFirst({
            where: {
                content: 'Novo conteudo da resposta',
            }
        })

        expect(answerOnDatabase).toBeTruthy()

        const attachmentsOnDatabase = await prisma.attachment.findMany({
          where: {
            answerId: answerOnDatabase?.id
          }
        })

        expect(attachmentsOnDatabase).toHaveLength(2)
        expect(attachmentsOnDatabase).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: attachment1.id.toString(),
            }),
            expect.objectContaining({
              id: attachment3.id.toString(),
            }),
          ])
        )

    })
})