import { UseCaseError } from "src/core/errors/use-case-error";

export class InvalidAttchmentTypeError extends Error implements UseCaseError{
    constructor(type: string){
        super(`Student "${type}" is not valid`)
    }
    
}