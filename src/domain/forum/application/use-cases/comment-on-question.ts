import { QuestionsRepository } from 'src/domain/forum/application/repositories/questions-repository'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Either, left, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface CommentOnQuestionsUseCaseRequest {
  authorId: string,
  questionId: string,
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<ResourceNotFoundError ,{
    questionComment: QuestionComment
}>

@Injectable()
export class CommentOnQuestionsUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
    ) {}
  async execute({
    authorId,
    questionId, 
    content
  }: CommentOnQuestionsUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if(!question){
        return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
        authorId: new UniqueEntityID(authorId),
        questionId: new UniqueEntityID(questionId),
        content
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({questionComment})
  }
}
