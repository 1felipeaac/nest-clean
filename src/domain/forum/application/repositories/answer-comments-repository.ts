import { PaginationParams } from "src/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class AnswerCommentsRepository {
    abstract findById(id: string):Promise<AnswerComment | null>
    abstract create(answer: AnswerComment): Promise<void>
    abstract delete(answer: AnswerComment): Promise<void>
    abstract findManyByAnswerId(answerId: string, params: PaginationParams):Promise<AnswerComment[]>
    abstract findManyByAnswerIdWithAuthor(answerId: string, params: PaginationParams):Promise<CommentWithAuthor[]>
}