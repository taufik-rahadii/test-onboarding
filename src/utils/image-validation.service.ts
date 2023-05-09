import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { MessageService } from 'src/message/message.service';
import { ErrorMessageInterface } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class ImageValidationService {
  constructor(
    private readonly hashService: HashService,
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
  ) {}

  async validateAll(req: any, filter: Array<string>) {
    if (req.fileValidationError) {
      const error: ErrorMessageInterface = {
        field: req.file.fieldname,
        message: this.messageService.get(req.fileValidationError),
        code: '',
      };
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          [error],
          'Bad Request',
        ),
      );
    }
    if (filter.includes('required')) {
      await this.required(req.file);
    }
  }

  async required(file: Express.Multer.File, fieldname?: string) {
    if (!file) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          [
            this.messageService.getErrorMessage(
              fieldname ?? 'file',
              'file.error.is_required',
            ),
          ],
          'Bad Request',
        ),
      );
    }
  }
}
