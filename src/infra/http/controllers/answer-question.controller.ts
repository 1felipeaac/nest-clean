import { BadRequestException, Body, Controller, Param, Post, } from "@nestjs/common";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { AnswerQuestionsUseCase } from "src/domain/forum/application/use-cases/answer-question";
const answerquestionBodySchema = z.object({
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(answerquestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerquestionBodySchema>

@Controller('/questions/:questionId/answer')
export class AnswerQuestionController{

    constructor(
        private answerQuestion: AnswerQuestionsUseCase
    ){}
    @Post()
    async handle(
        @CurrentUser() user: UserPayload, 
        @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
        @Param('questionId') questionId: string
    ){
        const { content } = body

        const userId = user.sub

        const result = await this.answerQuestion.execute({
            content,
            questionId,
            authorId: userId,
            attachmentsIds: []
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }
    }

}