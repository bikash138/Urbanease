import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";
import { env } from "../../config";

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = env.S3_BUCKET_NAME;

export const generateUploadUrl = async (
  folder: string,
  originalFilename: string,
  contentType: string,
) => {
  const uniqueSuffix = crypto.randomBytes(16).toString("hex");
  const extension = path.extname(originalFilename);
  const key = `${folder}/${uniqueSuffix}${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });

  const permanentUrl = `https://${BUCKET_NAME}.fly.storage.tigris.dev/${key}`;

  return {
    uploadUrl: presignedUrl,
    key,
    publicUrl: permanentUrl,
  };
};

export const deleteImageFromS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};
