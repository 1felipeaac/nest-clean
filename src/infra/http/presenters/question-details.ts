import { QuestionDetails } from "src/domain/forum/enterprise/entities/value-objects/question-detail";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
    static toHTTP(questionDetails: QuestionDetails){
        return {
            questionId: questionDetails.questionId.toString(),
            authorId: questionDetails.authorId.toString(),
            author: questionDetails.author,
            title: questionDetails.title,
            slug: questionDetails.slug.value,
            content: questionDetails.content,
            bestAnswerId: questionDetails.bestAnswerId?.toString(),
            attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
            createdAt: questionDetails.createdAt,
            updatedAt: questionDetails.updatedAt
        }
    }
}