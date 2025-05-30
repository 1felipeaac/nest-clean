import { PaginationParams } from "src/core/repositories/pagination-params";
import { Answer } from "src/domain/forum/enterprise/entities/answer";

export abstract class AnswersRepository {
  abstract findById(id: string): Promise<Answer | null>;
  abstract create(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
  abstract save(answer: Answer): Promise<void>;
  abstract findManyByQuestionId(questionId: string, params: PaginationParams):Promise<Answer[]>
}
