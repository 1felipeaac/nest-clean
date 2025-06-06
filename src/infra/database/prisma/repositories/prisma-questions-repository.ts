import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { QuestionsRepository } from "src/domain/forum/application/repositories/questions-repository";
import { Question } from "src/domain/forum/enterprise/entities/question";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionAttachmentsRepository } from "src/domain/forum/application/repositories/question-attachments-repository";
import { QuestionDetails } from "src/domain/forum/enterprise/entities/value-objects/question-detail";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { DomainEvents } from "src/core/events/domain-events";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository{

    constructor(
        private prisma: PrismaService,
        private questionAttchmentRepository: QuestionAttachmentsRepository
        ){}
    async findById(id: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                id
            }
        })

        if(!question){
            return null
        }

        return PrismaQuestionMapper.toDomain(question)
    }
    async findBySlug(slug: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                slug
            }
        })

        if(!question){
            return null
        }

        return PrismaQuestionMapper.toDomain(question)
    }

    async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                slug
            },
            include: {
                author: true,
                attachments: true
            }
        })

        if(!question){
            return null
        }

        return PrismaQuestionDetailsMapper.toDomain(question)
    }
    async findManyRecent({page}: PaginationParams): Promise<Question[]> {
        const questions = await this.prisma.question.findMany({
           orderBy:{
            createAt: 'desc'
           },
           take: 20,
           skip: (page - 1) * 20
        })

        return questions.map(PrismaQuestionMapper.toDomain)
        
    }
    async create(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)

        await this.prisma.question.create({
            data
        })

        await this.questionAttchmentRepository.createMany(
            question.attachments.getItems()
        )
        DomainEvents.dispatchEventsForAggregate(question.id)
    }
    async delete(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)

        await this.prisma.question.delete({
            where:{
                id: data.id
            }
        })
    }
    async save(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)

        await Promise.all([
             this.prisma.question.update({
                where:{
                    id: data.id
                },
                data
            }),
    
             this.questionAttchmentRepository.createMany(
                question.attachments.getNewItems()
            ),
            
             this.questionAttchmentRepository.deleteMany(
                question.attachments.getRemovedItems()
            )
        ])

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

}