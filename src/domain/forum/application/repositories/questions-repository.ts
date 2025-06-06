import { PaginationParams } from 'src/core/repositories/pagination-params'
import { Question } from 'src/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-detail'

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract create(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
}
