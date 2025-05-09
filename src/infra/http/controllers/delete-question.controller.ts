import { BadRequestException, Body, Controller, Delete, HttpCode,  Param,  Put, } from "@nestjs/common";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";

import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { DeleteQuestionsUseCase } from "src/domain/forum/application/use-cases/delete-question";


@Controller('/questions/:id')
export class DeleteQuestionController{

    constructor(
        private deleteQuestion: DeleteQuestionsUseCase
    ){}
    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload, 
        @Param('id') questionId: string
    ){


        const userId = user.sub

        const result = await this.deleteQuestion.execute({
            questionId,
            authorId: userId
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }
    }

}