
import { OnAnswerCreated } from "./on-answer-created";
import { makeAnswer } from "test/factories/make-answer";
import { SendNotificationsUseCase } from "../use-cases/send-notification";
import { makeQuestion } from "test/factories/make-question";

import {MockInstance} from 'vitest'
import { waitFor } from "test/utils/wait-for";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
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

describe('On Answer Created', () => {
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

        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationsUseCase)
    })

    it('should send a notification when an answer is created', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({questionId: question.id})
        
        inMemoryQuestionsRepository.create(question)
        inMemoryAnswerRepository.create(answer)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })

      
    })
})