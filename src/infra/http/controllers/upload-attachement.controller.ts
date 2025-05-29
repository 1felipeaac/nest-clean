import { Controller, Post, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { InvalidAttchmentTypeError } from "src/domain/forum/application/use-cases/errors/invalid-attachment-type";
import { UploadAndCreateAttachmentsUseCase } from "src/domain/forum/application/use-cases/uploadAndCreateAttachments";

@Controller('/attachments')
export class UploadAttachmentControler{

    constructor(private uploadAndCreateAttachment: UploadAndCreateAttachmentsUseCase){}
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async handle(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({maxSize: 1024 * 1024 * 2}), // 2mb
                new FileTypeValidator({fileType: '.(jpg|png|jpeg|pdf)'})
            ]
        })
    ) 
        file: Express.Multer.File
    ){
        const result = await this.uploadAndCreateAttachment.execute({
            fileName: file.originalname,
            fileType: file.mimetype,
            body: file.buffer
        })

        if(result.isLeft()){
            const error = result.value

            switch(error.constructor){
                case InvalidAttchmentTypeError:
                    throw new BadRequestException(error.message)
                default:
                    throw new BadRequestException(error.message)

            }
        }

        const {attachment} = result.value

        return {
            attachmentId: attachment.id.toString()
        }
    }
}