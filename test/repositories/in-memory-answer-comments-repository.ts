import { PaginationParams } from "src/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "src/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "src/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository{
    public items: AnswerComment[] = []
    async create(answer: AnswerComment){
        this.items.push(answer)
    }

    async findById(id: string) {
        const questionComment = this.items.find((item) => item.id.toString() === id);
    
        if (!questionComment) {
          return null;
        }
    
        return questionComment;
      }
    async delete(question: AnswerComment){
        const itemIndex = this.items.findIndex((item) => item.id === question.id);

        this.items.splice(itemIndex, 1);
    }

    async findManyByAnswerId(answerCommentId: string, params: PaginationParams): Promise<AnswerComment[]> {
        const questionComment = this.items.filter(item => item.answerId.toString() === answerCommentId)
      .slice((params.page - 1) * 20, params.page * 20)

    return questionComment
    }
}