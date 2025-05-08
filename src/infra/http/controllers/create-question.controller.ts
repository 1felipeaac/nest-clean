import { BadRequestException, Body, Controller, Post, } from "@nestjs/common";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { z } from "zod";
import { CreateQuestionsUseCase } from "src/domain/forum/application/use-cases/create-question";
const createquestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(createquestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createquestionBodySchema>

@Controller('/questions')
export class CreateQuestionController{

    constructor(
        private createQuestion: CreateQuestionsUseCase
    ){}
    @Post()
    async handle(
        @CurrentUser() user: UserPayload, 
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema
    ){
        const { title, content } = body

        const userId = user.sub

        const result = await this.createQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: []
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }
    }

}