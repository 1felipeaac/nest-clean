import { Injectable } from "@nestjs/common";
import { QuestionAttachmentsRepository } from "src/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "src/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository{

    constructor(private prisma: PrismaService){}
    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        const questionAttachment = await this.prisma.attachment.findMany({
            where: {
                questionId
            },
         })
 
         return questionAttachment.map(PrismaQuestionAttachmentMapper.toDomain)
    }
    async deleteManyByQuestionId(questionId: string): Promise<void> {
        
        await this.prisma.attachment.deleteMany({
            where:{
                questionId
            }
        })
    }

}