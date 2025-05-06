import { AnswerAttachmentsRepository } from "src/domain/forum/application/repositories/answer-attachments-repository"
import { AnswerAttachment } from "src/domain/forum/enterprise/entities/answer-attachment"

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository{
    public items: AnswerAttachment[] = []
    async deleteManyByAnswerId(answerId: string){
        const answerAttachment = this.items.filter((item) => item.answerId.toString() !== answerId)

        this.items = answerAttachment
    }
    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        const answerAttachment = this.items.filter((item) => item.answerId.toString() === answerId)

        return answerAttachment
    }
  
}