import crypto from 'crypto';

// Derivar la clave usando PBKDF2

export class PasswordHasher {
    static hashPassword(password) {
        const salt = crypto.randomBytes(16);
        const iterations = 10000;
        const keyLength = 20;
        const hashAlgorithm = 'sha256';
        const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, hashAlgorithm);
        const hashBytes = Buffer.concat([salt, hash]);
        return hashBytes.toString('base64');
    }

    static verifyPassword(enteredPassword, storedHash) {
        const hashBytes = Buffer.from(storedHash, 'base64');
        const salt = hashBytes.slice(0, 16);
        const iterations = 10000;
        const keyLength = 20;
        const hashAlgorithm = 'sha256';
        const hash = crypto.pbkdf2Sync(enteredPassword, salt, iterations, keyLength, hashAlgorithm);
        const storedHashPart = hashBytes.slice(16);
        return crypto.timingSafeEqual(storedHashPart, hash);
    }
}
