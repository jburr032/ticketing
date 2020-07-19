import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// Scrypt is not promise based, so not async compatible
// Will use promisfy to return a promise rather than a callback
const asyncScrypt = promisify(scrypt);

export class PasswordHasher {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await asyncScrypt(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async comparePasswords(
    storedPassword: string,
    supplyPassword: string
  ) {
    const [hash, salt] = storedPassword.split(".");
    const buf = (await asyncScrypt(supplyPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hash;
  }
}
