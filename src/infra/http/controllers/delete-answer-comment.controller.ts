import { BadRequestException, Controller, Delete, HttpCode,  Param } from "@nestjs/common";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { DeleteAnswerCommentsUseCase } from "src/domain/forum/application/use-cases/delete-answer-comment";


@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController{

    constructor(
        private deleteAnswerComment: DeleteAnswerCommentsUseCase
    ){}
    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload, 
        @Param('id') answerCommentId: string
    ){


        const userId = user.sub

        const result = await this.deleteAnswerComment.execute({
            answerCommentId,
            authorId: userId
        })

        if(result.isLeft()){
            console.log(result.value)
            throw new BadRequestException()
        }
    }

}