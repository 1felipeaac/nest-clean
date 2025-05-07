import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export interface StudentsProps {
  name: string,
  email: string,
  password: string
}

export class Student extends Entity<StudentsProps> {

  get name(){
    return this.props.name
  }
  get email(){
    return this.props.email
  }
  get password(){
    return this.props.password
  }
  static create(props: StudentsProps, id?: UniqueEntityID) {
    const student = new Student(props, id)
    return student
  }
}
