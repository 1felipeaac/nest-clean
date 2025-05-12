import { BadRequestException, Body, Controller, HttpCode,  Param,  Patch,  Put, } from "@nestjs/common";
import { CurrentUser } from "src/infra/auth/current-user-decorator";
import { UserPayload } from "src/infra/auth/jwt.strategy";
import { ChooseQuestionBestAnswersUseCase } from "src/domain/forum/application/use-cases/choose-question-best-answer";


@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController{

    constructor(
        private chooseQuestionBestAnswer: ChooseQuestionBestAnswersUseCase
    ){}
    @Patch()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload, 
        @Param('answerId') answerId: string
    ){

        const userId = user.sub

        const result = await this.chooseQuestionBestAnswer.execute({
            authorId: userId,
            answerId
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }
    }

}