import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Answer } from 'src/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from 'src/domain/forum/application/repositories/answers-repository'
import { Either, right } from 'src/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionsUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUsecaseResponse = Either<null, {
  answer: Answer
}>

export class AnswerQuestionsUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds
  }: AnswerQuestionsUseCaseRequest): Promise<AnswerQuestionUsecaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answersAttachments = attachmentsIds.map(attachmentId => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id
      })
    })

    answer.attachments = new AnswerAttachmentList(answersAttachments)


    await this.answerRepository.create(answer)

    return right({answer})
  }
}
