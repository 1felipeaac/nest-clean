import { PaginationParams } from "src/core/repositories/pagination-params";
import { Answer } from "src/domain/forum/enterprise/entities/answer";

export interface AnswersRepository {
  findById(id: string): Promise<Answer | null>;
  create(answer: Answer): Promise<void>;
  delete(answerId: Answer): Promise<void>;
  save(answer: Answer): Promise<void>;
  findManyByQuestionId(questiondId: string, params: PaginationParams):Promise<Answer[]>
}
