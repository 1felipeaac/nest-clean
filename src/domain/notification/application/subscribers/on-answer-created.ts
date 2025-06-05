import { DomainEvents } from "src/core/events/domain-events";
import { EventHandler } from "src/core/events/event-handler";
import { QuestionsRepository } from "src/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "src/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationsUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnAnswerCreated implements EventHandler{

    constructor(
        private questionsRepository: QuestionsRepository,
        private sendNotification: SendNotificationsUseCase
        ){
        this.setupSubscriptions()
    }
    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewAnserNotification.bind(this), 
            AnswerCreatedEvent.name
            )
    }

    private async sendNewAnserNotification({answer}: AnswerCreatedEvent){
        const question = await this.questionsRepository.findById(answer.questionId.toString())
        
        if(question){
            await this.sendNotification.execute({
                recipientId: question.authorId.toString(),
                title: `Nova resposta em "${question.title.substring(0,40).concat('...')}"`,
                content: answer.excerpt
            })
        }
    }

}