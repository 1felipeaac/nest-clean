import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { GetQuestionBySlugUseCase } from "src/domain/forum/application/use-cases/get-question-by-slug";

@Controller('/questions/:slug')
export class GetQuestionbySlugController{

    constructor(
        private getQuestionbySlugs: GetQuestionBySlugUseCase
    ){}
    @Get()
    async handle(@Param('slug') slug: string){

        const result = await this.getQuestionbySlugs.execute({
            slug,
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }

       
        return {question: QuestionPresenter.toHTTP(result.value.question)}
    }
}