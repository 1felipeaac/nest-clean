import { da, faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Student, StudentsProps } from 'src/domain/forum/enterprise/entities/student';
import { PrismaStudentMapper } from 'src/infra/database/prisma/mappers/prisma-student-mapper';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

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

@Injectable()
export class StudentFactory{
  constructor(private prisma: PrismaService){}

  async makePrismaStudent(data: Partial<StudentsProps> ={}):Promise<Student>{
    const student = makeStudent(data)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student)
    })

    return student
  }
}