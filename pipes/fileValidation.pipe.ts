import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileValidationPipe implements PipeTransform<any> {
  transform(files: {
    id?: Express.Multer.File;
    tradePermission?: Express.Multer.File;
  }): {
    id?: Express.Multer.File;
    tradePermission?: Express.Multer.File;
  } {

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    for (const file in files) {
            if (
        !allowedTypes.includes(files[file][0]['mimetype']) ||
        files[file]['size'] > 2097152
      ) {
        throw new BadRequestException('invalid file types');
      }
    }

    return files;
  }
}
