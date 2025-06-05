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
import { waitFor } from "test/utils/wait-for";
import { DomainEvents } from "src/core/events/domain-events";

describe('On Answer Created (E2E)', ()=>{
    let app: INestApplication;
    let prisma: PrismaService;
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
        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        jwt = moduleRef.get(JwtService)
        await app.init();

        DomainEvents.shouldRun = true
       
      });

    it('should send a notification when answer is created', async () =>{

       const user = await studentFactory.makePrismaStudent()

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
       })

       const questionId = question.id.toString()

       await request(app.getHttpServer())
        .post(`/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            content: 'Nova resposta',
            attachments: []
        })

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