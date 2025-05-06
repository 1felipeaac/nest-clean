import { DomainEvent } from "src/core/events/domain-event";
import { Question } from "../entities/question";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class QuestionBestAnswerChoseEvent implements DomainEvent{
    public ocurredAt: Date;
    public question: Question
    public bestAnswerId: UniqueEntityID

    constructor(question: Question, bestAnswerId: UniqueEntityID){
        this.question = question
        this.ocurredAt = new Date()
        this.bestAnswerId = bestAnswerId
    }
    getAggregateId(): UniqueEntityID {
       return this.question.id
    }
}