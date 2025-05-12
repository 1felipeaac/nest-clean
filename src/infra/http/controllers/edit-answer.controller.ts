import { BadRequestException, Body, Controller, HttpCode,  Param,  Put, } from "@nestjs/common";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { EditAnswersUseCase } from "src/domain/forum/application/use-cases/edit-answer";
const editanswerBodySchema = z.object({
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(editanswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editanswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController{

    constructor(
        private editAnswer: EditAnswersUseCase
    ){}
    @Put()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload, 
        @Body(bodyValidationPipe) body: EditAnswerBodySchema,
        @Param('id') answerId: string
    ){
        const { content } = body

        const userId = user.sub

        const result = await this.editAnswer.execute({
            content,
            authorId: userId,
            attachmentsIds: [],
            answerId
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }
    }

}