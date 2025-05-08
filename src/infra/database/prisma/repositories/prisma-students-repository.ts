import { StudentsRepository } from "src/domain/forum/application/repositories/students-repository"
import { Student } from "src/domain/forum/enterprise/entities/student"
import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { PrismaUserMapper } from "../mappers/prisma-user-mapper"

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository{

    constructor(private prisma: PrismaService){}
    async findByEmail(email: string): Promise<Student | null> {
        const student = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!student){
            return null
        }

        return PrismaUserMapper.toDomain(student)
    }

  
    async create(student: Student): Promise<void> {
        const data = PrismaUserMapper.toPrisma(student)

        await this.prisma.user.create({
            data
        })
    }

}