import { Comment as PrismaComment, Prisma } from "@prisma/client"
import { UniqueEntityID } from "src/core/entities/unique-entity-id"
import { QuestionComment } from "src/domain/forum/enterprise/entities/question-comment"

export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaComment):QuestionComment{
        if(!raw.questionId){
            throw new Error('Invalid comment type')
        }
        return QuestionComment.create({
            content: raw.content,
            authorId: new UniqueEntityID(raw.authorId),
            questionId: new UniqueEntityID(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    } 
    
    static toPrisma(answercomment: QuestionComment): Prisma.CommentUncheckedCreateInput {
        return{
            id: answercomment.id.toString(),
            authorId: answercomment.authorId.toString(),
            answerId: answercomment.questionId.toString(),
            content: answercomment.content,
            createdAt: answercomment.createdAt,
            updatedAt: answercomment.updatedAt
        }
    }
}