import { Injectable } from "@nestjs/common";
import { AnswerAttachmentsRepository } from "src/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "src/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachments-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository{
    constructor(private prisma: PrismaService){}

    async createMany(attachments: AnswerAttachment[]): Promise<void> {
        if(attachments.length === 0){
            return
        }
        const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)
        await this.prisma.attachment.updateMany(data)
    }
    async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
        if(attachments.length === 0){
            return
        }

        const attachmentIds = attachments.map((attachment) => {
            return attachment.id.toString()
        })

        await this.prisma.attachment.deleteMany({
            where: {
                id: {
                    in: attachmentIds
                }
            }
        })
    }
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