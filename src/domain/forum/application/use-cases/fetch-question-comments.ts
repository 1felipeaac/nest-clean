import { Either, right } from 'src/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionCommentUseCaseRequest {
  questionId: string,
  page: number
}

type FetchQuestionCommentUseCaseResponse = Either<null,{
    questionComments: QuestionComment[]
}>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}
  async execute({
    questionId,
    page
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const questionComments = await this.questionCommentRepository.findManyByQuestionId(questionId, {page})

    return right({questionComments})
  }
}
