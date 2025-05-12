import { AnswersRepository } from "src/domain/forum/application/repositories/answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { ResourceNotFoundError } from "src/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "src/core/errors/errors/not-allowed-error";
import { Either, left, right } from "src/core/either";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { Injectable } from "@nestjs/common";

interface EditAnswersUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError,{
    answer: Answer
}>

@Injectable()
export class EditAnswersUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
    ) {}
  async execute({
    answerId,
    authorId, 
    content,
    attachmentsIds
  }: EditAnswersUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if(authorId !== answer.authorId.toString()){
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const questionAttachmentList = new AnswerAttachmentList(currentQuestionAttachments)

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id
      })
    })

    questionAttachmentList.update(questionAttachments)

    answer.attachments = questionAttachmentList
    answer.content = content

    await this.answerRepository.save(answer);

    return right({ answer });
  }
}
