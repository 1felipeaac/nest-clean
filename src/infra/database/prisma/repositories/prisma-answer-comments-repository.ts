import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "src/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "src/domain/forum/enterprise/entities/answer-comment";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comments-mapper";
import { CommentWithAuthor } from "src/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository{

    constructor(private prisma: PrismaService){}
    async findById(id: string): Promise<AnswerComment | null> {
        const answerComment = await this.prisma.comment.findUnique({
            where: {
                id
            }
        })

        if(!answerComment){
            return null
        }

        return PrismaAnswerCommentMapper.toDomain(answerComment)
    }
    async create(answer: AnswerComment): Promise<void> {
        const data = PrismaAnswerCommentMapper.toPrisma(answer)

        await this.prisma.comment.create({
            data
        })
    }
    async delete(answer: AnswerComment): Promise<void> {
        await this.prisma.comment.delete({
            where:{
                id: answer.id.toString()
            }
        })
    }
    async findManyByAnswerId(answerId: string, {page}: PaginationParams): Promise<AnswerComment[]> {
        const answer = await this.prisma.comment.findMany({
            where: {
                answerId
            },
            orderBy:{
                createdAt: 'desc'
            },
            take: 20,
            skip: (page - 1) * 20
         })
 
         return answer.map(PrismaAnswerCommentMapper.toDomain)
    }

    async findManyByAnswerIdWithAuthor (answerId: string, {page}: PaginationParams): Promise<CommentWithAuthor[]> {
        const answerComments = await this.prisma.comment.findMany({
            where: {
                answerId
            },
            include: {
                author: true
            },
            orderBy:{
                createdAt: 'desc'
            },
            take: 20,
            skip: (page - 1) * 20
         })
 
         return answerComments.map(PrismaCommentWithAuthorMapper.toDomain)
    }

}