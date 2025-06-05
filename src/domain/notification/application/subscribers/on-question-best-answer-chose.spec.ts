import { makeAnswer } from "test/factories/make-answer";
import { SendNotificationsUseCase } from "../use-cases/send-notification";
import { makeQuestion } from "test/factories/make-question";

import {MockInstance} from 'vitest'
import { waitFor } from "test/utils/wait-for";
import { OnQuestionBestAnswerChose } from "./on-question-best-answer-chose";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { DomainEvents } from "src/core/events/domain-events";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationsUseCase: SendNotificationsUseCase
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sendNotificationExecuteSpy: MockInstance

describe('On Question Best Answer Chosen', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepository, 
            inMemoryAttachmentRepository, 
            inMemoryStudentsRepository)
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sendNotificationsUseCase = new SendNotificationsUseCase(inMemoryNotificationsRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationsUseCase, 'execute')

        new OnQuestionBestAnswerChose(inMemoryAnswerRepository, sendNotificationsUseCase)
    })

    it('should send a notification when question has new best answer chosen', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({questionId: question.id})
        
        inMemoryQuestionsRepository.create(question)
        inMemoryAnswerRepository.create(answer)

        question.bestAnswerId = answer.id

        inMemoryQuestionsRepository.save(question)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })

      
    })
})