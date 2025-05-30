import { QuestionAttachmentsRepository } from "src/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "src/domain/forum/enterprise/entities/question-attachment";
export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository{
    async createMany(attachments: QuestionAttachment[]): Promise<void> {
        this.items.push(...attachments)
    }
    async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
        const questionAttachment = this.items.filter(
            (item) => {
                return !attachments.some((attachment) => attachment.equals(item))
            }
        )

        this.items = questionAttachment
    }
    public items: QuestionAttachment[] = []
    async deleteManyByQuestionId(questionId: string){
        const questionAttachment = this.items.filter((item) => item.questionId.toString() !== questionId)

        this.items = questionAttachment
    }
    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        const questionAttachment = this.items.filter((item) => item.questionId.toString() === questionId)

        return questionAttachment
    }
  
}