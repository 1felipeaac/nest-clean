
import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { AttachmentsRepository } from "src/domain/forum/application/repositories/attachments-repository"
import { PrismaAttachmentMapper } from "../mappers/prisma-attachments-mapper"
import { Attachment } from "src/domain/forum/enterprise/entities/attachment"


@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository{

    constructor(private prisma: PrismaService){}

  
    async create(attachment: Attachment): Promise<void> {
        const data = PrismaAttachmentMapper.toPrisma(attachment)

        await this.prisma.attachment.create({
            data
        })
    }

}