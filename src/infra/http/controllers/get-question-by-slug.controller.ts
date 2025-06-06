import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { GetQuestionBySlugUseCase } from "src/domain/forum/application/use-cases/get-question-by-slug";
import { QuestionDetailsPresenter } from "../presenters/question-details";

@Controller('/questions/:slug')
export class GetQuestionBySlugController{

    constructor(
        private getQuestionBySlugs: GetQuestionBySlugUseCase
    ){}
    @Get()
    async handle(@Param('slug') slug: string){

        const result = await this.getQuestionBySlugs.execute({
            slug,
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }

       
        return {question: QuestionDetailsPresenter.toHTTP(result.value.question)}
    }
}