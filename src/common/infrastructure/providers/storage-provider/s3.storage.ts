import {
  UploaderProps,
  UploaderProvider,
} from '@/common/domain/providers/uploader-provider'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env } from '../../env'

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
    await this.client.send(
      new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: filename,
        ContentType: filetype,
        Body: body,
      }),
    )

    return filename
  }
}
