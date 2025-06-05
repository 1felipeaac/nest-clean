import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "src/infra/database/database.module";
import { StudentFactory } from "test/factories/make-students";
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";
import { NotificationFactory } from "test/factories/make-notification";
import { PrismaService } from "src/infra/database/prisma/prisma.service";

describe('Read Notification (E2E)', ()=>{
    let app: INestApplication;
    let studentFactory: StudentFactory
    let notificationFactory: NotificationFactory 
    let jwt: JwtService
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule, DatabaseModule],
          providers: [StudentFactory, NotificationFactory, PrismaService]
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        jwt = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        notificationFactory = moduleRef.get(NotificationFactory)
        prisma = moduleRef.get(PrismaService)
        await app.init();

       
      });

    test('[PATCH] /notifications/:notificatonId/read', async () =>{

       const user = await studentFactory.makePrismaStudent({
        name: 'Felipe'
       })

       const accessToken = jwt.sign({sub: user.id.toString()}) 

       const notification = await notificationFactory.makePrismaNotification({
        recipientId: user.id,
       })

       const notificationId = notification.id.toString()

       const response = await request(app.getHttpServer())
        .patch(`/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(response.statusCode).toBe(204)
        
        const notificationOnDatabase = await prisma.notification.findFirst({
            where:{
                recipientId: user.id.toString()
            }
        })

        expect(notificationOnDatabase?.readAt).not.toBeNull()

    })
})