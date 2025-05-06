import {faker} from '@faker-js/faker'
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Question, QuestionProps } from "src/domain/forum/enterprise/entities/question";
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";

export function makeQuestion(
    override:Partial<QuestionProps> = {},
    id?: UniqueEntityID
    ){
    const question = Question.create({
        authorId: new UniqueEntityID(),
        title: faker.lorem.sentence(),
        slug: Slug.create('nova-pergunta'),
        content: faker.lorem.text(),
        ...override
      }, id)

      return question
}