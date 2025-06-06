import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { FetchAnswerCommentsUseCase } from "src/domain/forum/application/use-cases/fetch-answer-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamns = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamns)

type PageQueryParamSchema = z.infer<typeof pageQueryParamns>


@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController{

    constructor(
        private fetchAnswerComments: FetchAnswerCommentsUseCase
    ){}
    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('answerId') answerId: string
    ){

        const result = await this.fetchAnswerComments.execute({
            page,
            answerId
        })

        if(result.isLeft()){
            throw new BadRequestException()
        }

        const comments = result.value.comments

        return {comments: comments.map(CommentWithAuthorPresenter.toHTTP)}
    }
}