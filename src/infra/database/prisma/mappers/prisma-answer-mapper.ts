import { Answer as PrismaAnswer, Prisma} from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Answer} from "src/domain/forum/enterprise/entities/answer"
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";
export class PrismaAnswerMapper {
    static toDomain(raw: PrismaAnswer):Answer{
        return Answer.create({
            authorId: new UniqueEntityID(raw.authorId),
            content: raw.content,
            questionId: new UniqueEntityID(raw.questionId),  
        }, new UniqueEntityID(raw.id))
    } 
    
    static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
        return{
            id: answer.id.toString(),
            authorId: answer.authorId.toString(),
            content: answer.content,
            questionId: answer.questionId.toString(),
        }
    }
}