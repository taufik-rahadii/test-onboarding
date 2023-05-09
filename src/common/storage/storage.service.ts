import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StorageService as NestStorageService } from '@codebrew/nestjs-storage';
import { AmazonWebServicesS3Storage } from '@slynova/flydrive-s3';
import * as fs from 'fs';
import { createUrl } from '../../utils/general-utils';

@Injectable()
export class CommonStorageService {
  constructor(private readonly storage: NestStorageService) {}

  async store(fileName: string): Promise<string> {
    if (process.env.STORAGE_DRIVER === 'local') {
      return createUrl(fileName);
    }

    const file = fileName.replace(/^\//, '');

    if (process.env.STORAGE_DRIVER === 's3') {
      try {
        this.storage.registerDriver('s3', AmazonWebServicesS3Storage);
        await this.storage
          .getDisk('s3')
          .put(file, fs.readFileSync(`./${file}`));

        return this.storage.getDisk('s3').getUrl(file);
      } catch (e) {
        console.error(e);
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async getBuff(url: string) {
    if (process.env.STORAGE_DRIVER === 's3') {
      try {
        this.storage.registerDriver('s3', AmazonWebServicesS3Storage);
        url = url.split(process.env.STORAGE_S3_BUCKET)[1].substring(1);

        return (await this.storage.getDisk('s3').getBuffer(url)).content;
      } catch (e) {
        console.error(e);
        throw new InternalServerErrorException(e.message);
      }
    }
  }
}
