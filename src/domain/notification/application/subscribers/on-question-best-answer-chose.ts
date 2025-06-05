import { DomainEvents } from "src/core/events/domain-events";
import { EventHandler } from "src/core/events/event-handler";
import { SendNotificationsUseCase } from "../use-cases/send-notification";
import { AnswersRepository } from "src/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChoseEvent } from "src/domain/forum/enterprise/events/question-best-answer-chose-event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnQuestionBestAnswerChose implements EventHandler{

    constructor(
        private answersRepository: AnswersRepository,
        private sendNotification: SendNotificationsUseCase
        ){
        this.setupSubscriptions()
    }
    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendQuestionBestAnswerNotification.bind(this), 
            QuestionBestAnswerChoseEvent.name
            )
    }

    private async sendQuestionBestAnswerNotification({question, bestAnswerId}: QuestionBestAnswerChoseEvent){
        const answer = await this.answersRepository.findById(bestAnswerId.toString())
        
        if(answer){
            await this.sendNotification.execute({
                recipientId: answer.authorId.toString(),
                title: `Sua Resposta foi escolhida`,
                content: `A resposta que você enviou em "${question.title.substring(0,20).concat('...')}" foi escolhida pelo autor`
            })
        }
    }

}