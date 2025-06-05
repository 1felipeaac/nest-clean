import { 
    Question as PrismaQuestion, 
    User as PrismaUser, 
    Attachment as PrismaAttachment 
} from "@prisma/client"; 
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { QuestionDetails } from "src/domain/forum/enterprise/entities/value-objects/question-detail";
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";
import { PrismaAttachmentMapper } from "./prisma-attachments-mapper";

type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaUser
    attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
    static toDomain(raw: PrismaQuestionDetails):QuestionDetails{
        return QuestionDetails.create({
            questionId: new UniqueEntityID(raw.id),
            authorId: new UniqueEntityID(raw.authorId),
            author: raw.author.name,
            title: raw.title,
            content: raw.content,
            slug: Slug.create(raw.slug),
            attachments:raw.attachments.map(PrismaAttachmentMapper.toDomain),
            bestAnswerId: raw.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
            createdAt: raw.createAt,
            updatedAt: raw.updatedAt
        })
    }
}