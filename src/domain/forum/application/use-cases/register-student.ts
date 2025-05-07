import { Either, left, right } from 'src/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentsUseCaseRequest {
  name: string,
  email: string,
  password: string
}

type RegisterStudentUseCaseResponse = Either< StudentAlreadyExistsError, {
    student: Student
}>

@Injectable()
export class RegisterStudentsUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashGenerator: HashGenerator
    ) {}
  async execute({
    name,
    email,
    password
  }: RegisterStudentsUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(email)

    if(studentWithSameEmail){
        return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student  = Student.create({
        email,
        name,
        password: hashedPassword
    })

    await this.studentRepository.create(student)

    return right({student})
  }
}
