import { BadRequestException, Body, Controller, HttpCode,  Param,  Put, } from "@nestjs/common";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { EditQuestionsUseCase } from "src/domain/forum/application/use-cases/edit-question";
const editquestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(editquestionBodySchema)

type EditQuestionBodySchema = z.infer<typeof editquestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController{

    constructor(
        private editQuestion: EditQuestionsUseCase
    ){}
    @Put()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload, 
        @Body(bodyValidationPipe) body: EditQuestionBodySchema,
        @Param('id') questionId: string
    ){
        const { title, content } = body

        const userId = user.sub

        const result = await this.editQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: [],
            questionId
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }
    }

}