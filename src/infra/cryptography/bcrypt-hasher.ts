import {hash, compare} from 'bcryptjs'
import { HashComparer } from "src/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "src/domain/forum/application/cryptography/hash-generator";

export class BcryptHasher implements HashComparer, HashGenerator {

    private HASH_SALT_LENGTH = 8
    async compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain, hash)
    }
    async hash(plain: string): Promise<string> {
       return hash(plain,this.HASH_SALT_LENGTH)
    }

}