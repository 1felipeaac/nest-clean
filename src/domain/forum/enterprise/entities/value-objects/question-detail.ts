import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ValueObjects } from "src/core/entities/value-objects";
import { Slug } from "./slug";
import { Attachment } from "../attachment";

export interface QuestionDetailsProps{
    questionId: UniqueEntityID
    authorId: UniqueEntityID
    author: string
    title: string
    content: string
    slug: Slug
    attachments: Attachment[]
    bestAnswerId?: UniqueEntityID | null
    createdAt: Date
    updatedAt?: Date | null
}
export class QuestionDetails extends ValueObjects<QuestionDetailsProps>{

    get questionId(){
        return this.props.questionId
    }
    get authorId(){
        return this.props.authorId
    }
    get author(){
        return this.props.author
    }
    get title(){
        return this.props.title
    }
    get slug(){
        return this.props.slug
    }
    get content(){
        return this.props.content
    }
    get attachments(){
        return this.props.attachments
    }
    get bestAnswerId(){
        return this.props.bestAnswerId
    }
    get createdAt(){
        return this.props.createdAt
    }
    get updatedAt(){
        return this.props.updatedAt
    }

    static create(props: QuestionDetailsProps){
        return new QuestionDetails(props)
    }

}