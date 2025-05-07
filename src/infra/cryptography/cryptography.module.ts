import { Module } from "@nestjs/common";
import { Encrypter } from "src/domain/forum/application/cryptography/encrypter";
import { JwtEncrypter } from "./jwt-encrypter";
import { HashGenerator } from "src/domain/forum/application/cryptography/hash-generator";
import { BcryptHasher } from "./bcrypt-hasher";
import { HashComparer } from "src/domain/forum/application/cryptography/hash-comparer";

@Module({
    providers: [
        { provide: Encrypter, useClass: JwtEncrypter },
        { provide: HashGenerator, useClass: BcryptHasher },
        { provide: HashComparer, useClass: BcryptHasher },
    ],
    exports: [Encrypter, HashComparer, HashGenerator]
})
export class CryptographyModule {

}