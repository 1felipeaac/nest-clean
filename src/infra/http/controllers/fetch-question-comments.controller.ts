import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchQuestionCommentsUseCase } from "src/domain/forum/application/use-cases/fetch-question-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamns = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamns)

type PageQueryParamSchema = z.infer<typeof pageQueryParamns>


@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController{

    constructor(
        private fetchQuestionComments: FetchQuestionCommentsUseCase
    ){}
    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('questionId') questionId: string
    ){

        const result = await this.fetchQuestionComments.execute({
            page,
            questionId
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }

        const comments = result.value.comments

        return {comments: comments.map(CommentWithAuthorPresenter.toHTTP)}
    }
}