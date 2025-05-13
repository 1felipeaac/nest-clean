import { BadRequestException, Body, Controller, Param, Post, } from "@nestjs/common";
import { CommentOnAnswersUseCase } from "src/domain/forum/application/use-cases/comment-on-answer";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";

const commentonanswerBodySchema = z.object({
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(commentonanswerBodySchema)

type CommentOnAnswerBodySchema = z.infer<typeof commentonanswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController{

    constructor(
        private commentOnAnswer: CommentOnAnswersUseCase
    ){}
    @Post()
    async handle(
        @CurrentUser() user: UserPayload, 
        @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
        @Param('answerId') answerId: string
    ){
        const { content } = body

        const userId = user.sub

        const result = await this.commentOnAnswer.execute({
            content,
            answerId,
            authorId: userId,
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }
    }

}