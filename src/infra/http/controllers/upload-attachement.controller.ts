import { Controller, Post, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('/attachments')
export class UploadAttachmentControler{

    // constructor(){}
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
        console.log(file)
    }
}