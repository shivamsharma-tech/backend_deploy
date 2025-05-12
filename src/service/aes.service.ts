// import { CipherGCMTypes, createCipheriv, createDecipheriv, randomBytes } from "crypto";
// import ServerConfig from "../../../network/security/serverConfig.security";

// export default class AESService {

//     private static ALGORITHM: CipherGCMTypes = "aes-256-gcm";

//     private static AES_KEY: string = ServerConfig.getAesKey();

//     public static async encrypt(text: string): Promise<string> {

//         // Generate an initialization vector
//         const iv: Buffer = randomBytes(16);
   
//         const cipher = createCipheriv(this.ALGORITHM, Buffer.from(this.AES_KEY, "hex"), iv);
//         let encrypted = cipher.update(text, "utf8", "hex");
//         encrypted += cipher.final("hex");

//         const authTag = cipher.getAuthTag().toString("hex")
//         return  iv.toString("hex") + encrypted + authTag;
//     }

//     public static async decrypt(encryptedText: string): Promise<string> {
//       const iv = encryptedText.slice(0, 32);
//       const encrypted = encryptedText.slice(32, encryptedText.length - 32);
//       const authTag = encryptedText.slice(encryptedText.length - 32);
      
//       try {
//         const decipher = createDecipheriv(
//           'aes-256-gcm',
//           Buffer.from(this.AES_KEY, 'hex'),
//           Buffer.from(iv, 'hex')
//         );
    
//         decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
//         let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//         decrypted += decipher.final('utf8');
    
//         return decrypted;
//       } catch (error) {
//         throw(error);
//       }
//     }
// }

import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export default class AESService {

    private static ALGORITHM: string = "aes-256-cbc";

    private static AES_KEY: string = "e84e5c7ca0fc10762f3da4c4eebf0700878bf05538966ec39e6303047385cf37";

    public static async encrypt(text: string): Promise<string> {

        // Generate an initialization vector
        const iv: Buffer = randomBytes(16);

        // Create cipher instance with CBC mode
        const cipher = createCipheriv(this.ALGORITHM, Buffer.from(this.AES_KEY, "hex"), iv);
        
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");

        // Return IV and encrypted text combined, since CBC needs the IV to decrypt
        return iv.toString("hex") + encrypted;
    }

    public static async decrypt(encryptedText: string): Promise<string> {
        // Extract the IV (first 32 hex characters)
        const iv = encryptedText.slice(0, 32);
        
        // Extract the actual encrypted data (after the IV)
        const encrypted = encryptedText.slice(32);

        try {
            // Create decipher instance with CBC mode
            const decipher = createDecipheriv(
                this.ALGORITHM,
                Buffer.from(this.AES_KEY, 'hex'),
                Buffer.from(iv, 'hex')
            );

            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error) {
            throw error;
        }
    }
}
