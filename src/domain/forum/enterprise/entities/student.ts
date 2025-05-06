import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

interface StudentsProps {
  name: string
}

export class Student extends Entity<StudentsProps> {
  static create(props: StudentsProps, id?: UniqueEntityID) {
    const student = new Student(props, id)
    return student
  }
}
