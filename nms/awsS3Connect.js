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
const uploadFileToAWS = async (fileName, filePath, videoPath) => {
  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(filePath),
    };

    const result = await s3Client.send(new PutObjectCommand(uploadParams));
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file ", err);
        }
      });
    }

    if (fs.existsSync(videoPath)) {
      fs.rm(videoPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error deleting folder ", err);
        }
      });
    }
    console.log("Successfully uploaded file to AWS S3");
  } catch (error) {
    console.error("Error uploading file to AWS S3", error);
  }
};

export { uploadFileToAWS };
