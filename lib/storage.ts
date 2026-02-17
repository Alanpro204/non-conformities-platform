import { createStorage } from "unstorage";
import s3Driver from "unstorage/drivers/s3";
import vercelBlobDriver from "unstorage/drivers/vercel-blob";

// Definimos el driver basado en una variable de entorno
const storageType = process.env.STORAGE_TYPE; // 'aws', 'supabase' o 'vercel'

const getDriver = () => {
    switch (storageType) {
        case "aws":
            return s3Driver({
                endpoint: "",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                bucket: process.env.AWS_BUCKET_NAME!,
                region: process.env.AWS_REGION!,
            });

        case "supabase":
            // Supabase es compatible con S3
            return s3Driver({
                accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY!,
                secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY!,
                bucket: process.env.SUPABASE_BUCKET_NAME!,
                region: process.env.SUPABASE_REGION!,
                endpoint: process.env.SUPABASE_S3_ENDPOINT!, // Ej: https://ref.supabase.co/storage/v1/s3
            });

        case "vercel":
            return vercelBlobDriver({
                access: "public",
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });

        default:
            throw new Error("Storage provider not configured");
    }
};

export const storage = createStorage({
    driver: getDriver(),
});
