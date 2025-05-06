import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "src/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "src/domain/forum/enterprise/entities/question-comment";

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository{
    findById(id: string): Promise<QuestionComment | null> {
        throw new Error("Method not implemented.");
    }
    create(question: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(question: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
        throw new Error("Method not implemented.");
    }

}