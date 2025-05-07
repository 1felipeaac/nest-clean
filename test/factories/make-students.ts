import { faker } from '@faker-js/faker'
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Student, StudentsProps } from 'src/domain/forum/enterprise/entities/student';
import { Slug } from "src/domain/forum/enterprise/entities/value-objects/slug";

export function makeStudent(
    override:Partial<StudentsProps> = {},
    id?: UniqueEntityID
    ){
    const student = Student.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...override
      }, id)

      return student
}