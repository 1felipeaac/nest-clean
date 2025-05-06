import { PaginationParams } from "src/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "src/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "src/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository{
    async findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
        const questionComment = this.items.filter(item => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)

    return questionComment
    }
    public items: QuestionComment[] = []
    async findById(id: string) {
        const questionComment = this.items.find((item) => item.id.toString() === id);
    
        if (!questionComment) {
          return null;
        }
    
        return questionComment;
      }
    async delete(question: QuestionComment){
        const itemIndex = this.items.findIndex((item) => item.id === question.id);

        this.items.splice(itemIndex, 1);
    }
    async create(question: QuestionComment){
        this.items.push(question)
    }
}