import { Either, right } from 'src/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchQuestionCommentUseCaseRequest {
  questionId: string,
  page: number
}

type FetchQuestionCommentUseCaseResponse = Either<null,{
    comments: CommentWithAuthor[]
}>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}
  async execute({
    questionId,
    page
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const comments = await this.questionCommentRepository.findManyByQuestionIdWithAuthor(questionId, {page})

    return right({comments})
  }
}
