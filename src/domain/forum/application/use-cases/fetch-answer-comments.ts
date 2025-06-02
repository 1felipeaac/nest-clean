import { Either, right } from 'src/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchAnswerCommentUseCaseRequest {
  answerId: string,
  page: number
}

type FetchAnswerCommentUseCaseResponse = Either<null ,{
    comments: CommentWithAuthor[]
}>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}
  async execute({
    answerId,
    page
  }: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
    const comments = await this.answerCommentRepository.findManyByAnswerIdWithAuthor(answerId, {page})

    return right({comments})
  }
}
