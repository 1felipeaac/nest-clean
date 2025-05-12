import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchQuestionAnswersUseCase } from "src/domain/forum/application/use-cases/fetch-question-answer";
import { QuestionPresenter } from "../presenters/question-presenter";
import { AnswerPresenter } from "../presenters/answer-presenter";

const pageQueryParamns = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamns)

type PageQueryParamSchema = z.infer<typeof pageQueryParamns>


@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController{

    constructor(
        private fetchQuestionAnswers: FetchQuestionAnswersUseCase
    ){}
    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('questionId') questionId: string
    ){

        const result = await this.fetchQuestionAnswers.execute({
            page,
            questionId
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }

        const answers = result.value.answers

        return {answers: answers.map(AnswerPresenter.toHTTP)}
    }
}