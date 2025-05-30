import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-students";
import { DatabaseModule } from "src/infra/database/database.module";
import { AttachmentFactory } from "test/factories/make-attachments";

describe('Answer question (E2E)', ()=>{
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService
    let studentFactory: StudentFactory
    let attachmentFactory: AttachmentFactory
    let questionFactory: QuestionFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, QuestionFactory, AttachmentFactory]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        attachmentFactory = moduleRef.get(AttachmentFactory)
        jwt = moduleRef.get(JwtService)
        await app.init();

       
      });

    test('[POST] /questions/questionId/answer', async () =>{

       const user = await studentFactory.makePrismaStudent()

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
       })

       const questionId = question.id.toString()

       const attachment1 = await attachmentFactory.makePrismaAttachment()
       const attachment2 = await attachmentFactory.makePrismaAttachment()

       const response = await request(app.getHttpServer())
        .post(`/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            content: 'Nova resposta',
            attachments: [
              attachment1.id.toString(),
              attachment2.id.toString(),
            ]
        })

        expect(response.statusCode).toBe(201)

        const answerOnDatabase = await prisma.answer.findFirst({
            where: {
                content: 'Nova resposta',
            }
        })

        expect(answerOnDatabase).toBeTruthy()

        const attachmentsOnDatabase = await prisma.attachment.findMany({
          where: {
            answerId: answerOnDatabase?.id
          }
        })

        expect(attachmentsOnDatabase).toHaveLength(2)

    })
})