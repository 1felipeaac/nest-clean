import { User as PrismaUser, Prisma} from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Student } from "src/domain/forum/enterprise/entities/student"
export class PrismaUserMapper {
    static toDomain(raw: PrismaUser):Student{
        return Student.create({
            name: raw.email,
            email: raw.email,
            password: raw.password,
        }, new UniqueEntityID(raw.id))
    } 
    
    static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
        return{
            id: student.id.toString(),
            name: student.name,
            email: student.email,
            password: student.password,
        }
    }
}