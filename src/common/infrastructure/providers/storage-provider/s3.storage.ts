import {
  UploaderProps,
  UploaderProvider,
} from '@/common/domain/providers/uploader-provider'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { env } from '../../env'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class S3Uploader implements UploaderProvider {
  private readonly client: S3Client

  constructor() {
    this.client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }

  async upload({ filename, filetype, body }: UploaderProps): Promise<string> {
    return filename
  }

  async generatePresignedURL(filename: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: filename,
    })
    return getSignedUrl(this.client, command, { expiresIn: 1000 })
  }
}
