import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { RegisterStudentsUseCase } from "src/domain/forum/application/use-cases/register-student";
import { StudentAlreadyExistsError } from "src/domain/forum/application/use-cases/errors/student-already-exists-error";
import { Public } from "src/infra/auth/public";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

export type CreateAccoutBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController{

    constructor(private registerStudent: RegisterStudentsUseCase){}
    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateAccoutBodySchema){

        const {name, email, password} = body

        const result = await this.registerStudent.execute({
                name,
                email,
                password
        })

        if(result.isLeft()){
            const error = result.value

            switch(error.constructor){
                case StudentAlreadyExistsError:
                    throw new ConflictException(error.message)
                default:
                    throw new BadRequestException(error.message)

            }
        }
    }
}