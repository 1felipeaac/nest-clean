import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { QuestionsRepository } from "src/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "src/domain/forum/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";
import { AnswerAttachmentsRepository } from "src/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerCommentsRepository } from "src/domain/forum/application/repositories/answer-comments-repository";
import { AnswersRepository } from "src/domain/forum/application/repositories/answers-repository";
import { QuestionAttachmentsRepository } from "src/domain/forum/application/repositories/question-attachments-repository";
import { QuestionCommentsRepository } from "src/domain/forum/application/repositories/question-comments-repository";
import { AttachmentsRepository } from "src/domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { NotificationsRepository } from "src/domain/notification/application/repositories/notifications-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";

@Module({
    providers: [
        PrismaService, 
        {
            provide: AnswerAttachmentsRepository,
            useClass: PrismaAnswerAttachmentsRepository
        },
        {
            provide: AnswerCommentsRepository,
            useClass: PrismaAnswerCommentsRepository
        },
        {
            provide: AnswersRepository,
            useClass: PrismaAnswersRepository
        },
        {
            provide: QuestionAttachmentsRepository,
            useClass: PrismaQuestionAttachmentsRepository
        },
        {
            provide: QuestionCommentsRepository,
            useClass: PrismaQuestionCommentsRepository
        },
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository
        },
        {
            provide: StudentsRepository,
            useClass: PrismaStudentsRepository
        },
        {
            provide: AttachmentsRepository,
            useClass: PrismaAttachmentsRepository
        },
        {
            provide: NotificationsRepository,
            useClass: PrismaNotificationsRepository
        },
  
    ],
    exports: [
        PrismaService, 
        AnswerAttachmentsRepository, 
        AnswerCommentsRepository, 
        AnswersRepository,
        QuestionAttachmentsRepository,
        QuestionCommentsRepository,
        QuestionsRepository,
        StudentsRepository,
        QuestionsRepository,
        StudentsRepository,
        AttachmentsRepository,
        NotificationsRepository
    ]
})
export class DatabaseModule{}