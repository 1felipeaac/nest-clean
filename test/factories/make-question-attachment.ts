import { Injectable } from "@nestjs/common";
import { Attachment } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { AttachmentProps } from "src/domain/forum/enterprise/entities/attachment";
import { QuestionAttachment, QuestionAttachmentProps } from 'src/domain/forum/enterprise/entities/question-attachment';
import { PrismaAttachmentMapper } from "src/infra/database/prisma/mappers/prisma-attachments-mapper";
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { makeAttachment } from "./make-attachments";

export function makeQuestionAttachment(
    override:Partial<QuestionAttachmentProps> = {},
    id?: UniqueEntityID
    ){
    const questionAttachment = QuestionAttachment.create({
        questionId:  new UniqueEntityID(),
        attachmentId: new UniqueEntityID(),
        ...override
      }, id)

      return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory{
  constructor(private prisma: PrismaService){}

  async makePrismaQuestionAttachment(data: Partial<QuestionAttachmentProps> ={}):Promise<QuestionAttachment>{
    const questionAttachment = makeQuestionAttachment(data)

    await this.prisma.attachment.update({
      where:{
        id: questionAttachment.attachmentId.toString()
      },
      data:{ questionId: questionAttachment.questionId.toString()}
    })

    return questionAttachment
  }
}