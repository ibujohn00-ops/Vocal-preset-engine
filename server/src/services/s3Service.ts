/**
 * AWS S3 Service
 * Handles file storage in cloud
 */

import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

/**
 * Upload file to S3
 */
export const uploadToS3 = async (
  filePath: string,
  bucketName: string,
  key: string
): Promise<string> => {
  try {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: getContentType(filePath),
      ACL: 'private',
    };

    const result = await s3.upload(params).promise();
    console.log(`[INFO] File uploaded to S3: ${result.Location}`);

    return result.Location;
  } catch (error) {
    console.error('[ERROR] S3 upload failed:', error);
    throw error;
  }
};

/**
 * Download file from S3
 */
export const downloadFromS3 = async (
  bucketName: string,
  key: string,
  outputPath: string
): Promise<void> => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const data = await s3.getObject(params).promise();
    fs.writeFileSync(outputPath, data.Body);
    console.log(`[INFO] File downloaded from S3: ${outputPath}`);
  } catch (error) {
    console.error('[ERROR] S3 download failed:', error);
    throw error;
  }
};

/**
 * Delete file from S3
 */
export const deleteFromS3 = async (
  bucketName: string,
  key: string
): Promise<void> => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    console.log(`[INFO] File deleted from S3: ${key}`);
  } catch (error) {
    console.error('[ERROR] S3 delete failed:', error);
    throw error;
  }
};

/**
 * Get file content type
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.flac': 'audio/flac',
    '.ogg': 'audio/ogg',
    '.json': 'application/json',
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Generate signed URL for file access
 */
export const generateSignedUrl = (
  bucketName: string,
  key: string,
  expiresIn: number = 3600
): string => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiresIn,
  };

  return s3.getSignedUrl('getObject', params);
};

export default s3;
