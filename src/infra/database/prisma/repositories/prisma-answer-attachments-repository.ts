import { Injectable } from "@nestjs/common";
import { AnswerAttachmentsRepository } from "src/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "src/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachments-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository{
    constructor(private prisma: PrismaService){}
    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        const answerAttachment = await this.prisma.attachment.findMany({
            where: {
                answerId
            },
         })
 
         return answerAttachment.map(PrismaAnswerAttachmentMapper.toDomain)
    }
    async deleteManyByAnswerId(answerId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where:{
                answerId
            }
        })
    }

}