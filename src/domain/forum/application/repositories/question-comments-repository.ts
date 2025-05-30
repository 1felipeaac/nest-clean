import { PaginationParams } from "src/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";

export abstract class QuestionCommentsRepository {
    abstract findById(id: string):Promise<QuestionComment | null>
    abstract create(question: QuestionComment): Promise<void>
    abstract delete(question: QuestionComment): Promise<void>
    abstract findManyByQuestionId(questionId: string, params: PaginationParams):Promise<QuestionComment[]>
}