import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";

const s3Client = new S3Client({
  region: process.env.AWS_REGION, // Specify the AWS region from environment variables
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID, // Access key ID from environment variables
    secretAccessKey: process.env.AWS_SECRETACCESSKEY, // Secret access key from environment variables
  },
});

/**
 * Upload the video file to AWS S3
 * @param {*} fileName
 * @param {*} filePath
 * @param {*} videoPath
 */
const uploadFileToAWS = async (fileName, filePath) => {
  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(filePath),
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    return true;
  } catch (error) {
    throw new Error("Error uploading file to AWS S3 ", error);
  }
};

export { uploadFileToAWS };
