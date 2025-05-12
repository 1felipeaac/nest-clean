import { BadRequestException, Body, Controller, Param, Post, } from "@nestjs/common";
import { CommentOnQuestionsUseCase } from "src/domain/forum/application/use-cases/comment-on-question";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";

const commentonquestionBodySchema = z.object({
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(commentonquestionBodySchema)

type CommentOnQuestionBodySchema = z.infer<typeof commentonquestionBodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController{

    constructor(
        private commentOnQuestion: CommentOnQuestionsUseCase
    ){}
    @Post()
    async handle(
        @CurrentUser() user: UserPayload, 
        @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
        @Param('questionId') questionId: string
    ){
        const { content } = body

        const userId = user.sub

        const result = await this.commentOnQuestion.execute({
            content,
            questionId,
            authorId: userId,
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }
    }

}