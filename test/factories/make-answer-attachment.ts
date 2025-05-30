
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { AnswerAttachment, AnswerAttachmentProps } from 'src/domain/forum/enterprise/entities/answer-attachment';
import { PrismaService } from "src/infra/database/prisma/prisma.service";

export function makeAnswerAttachment(
    override:Partial<AnswerAttachmentProps> = {},
    id?: UniqueEntityID
    ){
    const answerAttachment = AnswerAttachment.create({
        answerId:  new UniqueEntityID(),
        attachmentId: new UniqueEntityID(),
        ...override
      }, id)

      return answerAttachment
}

@Injectable()
export class AnswerAttachmentFactory{
  constructor(private prisma: PrismaService){}

  async makePrismaAttachmentAttachment(data: Partial<AnswerAttachmentProps> ={}):Promise<AnswerAttachment>{
    const attachmentAttachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where:{
        id: attachmentAttachment.attachmentId.toString()
      },
      data:{ answerId: attachmentAttachment.answerId.toString()}
    })

    return attachmentAttachment
  }
}