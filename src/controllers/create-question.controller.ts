import { Body, ConflictException, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { UserPayload } from "src/auth/jwt.strategy";

import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
const createquestionBodySchema = z.object({
    title: z.string(),
    content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(createquestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createquestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController{

    constructor(
        private prisma: PrismaService
    ){}
    @Post()
    async handle(
        @CurrentUser() user: UserPayload, 
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema
    ){
        const { title, content } = body

        const userId = user.sub

        const slug = this.convertToSlug(title)

        const questionWithSameSlug = await this.prisma.question.findUnique({
            where: {
                slug
            }
        })

        if(questionWithSameSlug){
            throw new ConflictException('Question with same slug already exists')
        }

        await this.prisma.question.create({
            data: {
                authorId: userId,
                title,
                content,
                slug
            }
        })
    }

    private convertToSlug(tittle: string): string {
        return tittle
            .normalize('NFKD')
            .toLocaleLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/_/g, '-')
            .replace(/--+/g, '-')
            .replace(/-$/g, '')
    }
}