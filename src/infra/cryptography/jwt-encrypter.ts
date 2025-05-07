import { JwtService } from "@nestjs/jwt";
import { Encrypter } from "src/domain/forum/application/cryptography/encrypter";

export class JwtEncrypter implements Encrypter {
    constructor(private jwtService: JwtService){}

    encrypt(payload: Record<string, unknown>): Promise<string> {
        return this.jwtService.signAsync(payload)
    }
}