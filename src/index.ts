import * as fs from 'fs';
import S3 from 'aws-sdk/clients/s3';
import StorageBase from "ghost-storage-base";
import { Handler } from 'express';

export default class Storage extends StorageBase {
  private s3: S3;
  private bucket: string;
  private assetHost: string;

  constructor(option: S3.ClientConfiguration & { bucket: string, assetHost?: string }) {
    super();
    this.s3 = new S3(option);
    this.bucket = option.bucket;
    this.assetHost = option.assetHost || option.endpoint as string;
  }

  public async save(image: StorageBase.Image) {
    const now = new Date();
    const fileKey = `${ now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}/${image.name}`;

    return fs.promises.readFile(image.path)
      .then(async (buffer: Buffer) => {
        const params = {
          ACL: 'public-read',
          Bucket: this.bucket,
          Key: fileKey,
          Body: buffer,
          ContentType: image.type,
          CacheControl: `max-age=${1000 * 365 * 24 * 60 * 60}` // 365 days
        };

        await this.s3.putObject(params).promise();

        return `${this.assetHost}/${fileKey}`;
      })
  }

  public serve(): Handler {
    return (req, res, next) => {
      const params = {
          Bucket: this.bucket,
          Key: req.path.replace(/^\//, '')
      };

      return this.s3.getObject(params)
        .createReadStream()
        .on('error', next)
        .pipe(res);
    }
  }

  public async exists(fileName: string) {
    return this.s3.headObject({
      Bucket: this.bucket,
      Key: fileName
    }).promise()
      .then(() => true)
      .catch(() => false);
  }

  public async delete(fileName: string) {
    return this.s3.deleteObject({
      Bucket: this.bucket,
      Key: fileName
    }).promise()
      .then(() => true)
      .catch(() => false);
  }

  public async read(options?: StorageBase.ReadOptions): Promise<Buffer> {
    return this.s3.getObject({
      Bucket: this.bucket,
      Key: options.path
    }).promise()
      .then((data) => data.Body as Buffer)
  }
}

module.exports = Storage;
