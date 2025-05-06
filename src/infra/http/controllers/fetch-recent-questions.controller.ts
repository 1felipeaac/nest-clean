import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/infra/auth/jwt-auth-guard";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "src/infra/database/prisma/prisma.service";
import { z } from "zod";

const pageQueryParamns = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamns)

type PageQueryParamSchema = z.infer<typeof pageQueryParamns>


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecenmtQuestionsController{

    constructor(
        private prisma: PrismaService
    ){}
    @Get()
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema){

        const perPage = 20

        const questions = await this.prisma.question.findMany({
            take: perPage,
            skip: (page - 1) * perPage,
            orderBy: {
                createAt: 'desc'
            }
        })

        return {questions}
    }
}