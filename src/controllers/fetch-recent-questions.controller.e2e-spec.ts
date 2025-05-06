import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/app.module";
import {Test} from "@nestjs/testing"
import request from 'supertest'
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

describe('Fetch recent question (E2E)', ()=>{
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule],
        })
          .compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        await app.init();

       
      });

    test('[GET] /questions', async () =>{

       const user = await prisma.user.create({
        data:{
            name: 'Felipe',
            email: 'felipe@email.com',
            password: '123456',
        }
       })

       const accessToken = jwt.sign({sub: user.id}) 

       await prisma.question.createMany({
        data: [
            {
                title: "Questao 01",
                slug: "questao-01",
                content: "Conteudo da questão 01",
                authorId: user.id
            },
            {
                title: "Questao 02",
                slug: "questao-02",
                content: "Conteudo da questão 02",
                authorId: user.id
            },
        ]
       })

       const response = await request(app.getHttpServer())
        .get('/questions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({title: "Questao 01"}),
                expect.objectContaining({title: "Questao 02"})
            ]
        })

    })
})