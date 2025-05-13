import { Either, right } from 'src/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'

interface FetchAnswerCommentUseCaseRequest {
  answerId: string,
  page: number
}

type FetchAnswerCommentUseCaseResponse = Either<null ,{
    answerComments: AnswerComment[]
}>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}
  async execute({
    answerId,
    page
  }: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
    const answerComments = await this.answerCommentRepository.findManyByAnswerId(answerId, {page})

    return right({answerComments})
  }
}
