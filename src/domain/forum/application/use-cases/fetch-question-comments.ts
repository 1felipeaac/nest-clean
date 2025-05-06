import { Either, right } from 'src/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentUseCaseRequest {
  questionId: string,
  page: number
}

type FetchQuestionCommentUseCaseResponse = Either<null,{
    questionComments: QuestionComment[]
}>

export class FetchQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}
  async execute({
    questionId,
    page
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const questionComments = await this.questionCommentRepository.findManyByQuestionId(questionId, {page})

    return right({questionComments})
  }
}
