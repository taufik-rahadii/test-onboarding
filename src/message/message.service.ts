import { Injectable } from '@nestjs/common';
import { ErrorMessageInterface } from 'src/response/response.interface';
import languages from './message.constant';

export interface CodeMessageInterface {
  readonly message: string;
  readonly code?: string;
}
@Injectable()
export class MessageService {
  private readonly languages: Record<string, any> = languages;

  get(key: string): string {
    // Env Variable
    const defaultMessage = process.env.APP_LANGUAGE;
    const keys: string[] = key.split('.');
    let selectedMessage: Record<string, any> | string =
      this.languages[defaultMessage];

    for (const i of keys) {
      selectedMessage = selectedMessage[i];

      if (!selectedMessage) {
        selectedMessage = { messge: key };
        break;
      }
    }

    if (selectedMessage['message']) {
      return selectedMessage['message'];
    }

    return selectedMessage as string;
  }

  getErrorMessage(field: string, key: string): ErrorMessageInterface {
    // Env Variable
    const defaultMessage = process.env.APP_LANGUAGE;
    const keys: string[] = key.split('.');
    let selectedMessage: Record<string, any> | string =
      this.languages[defaultMessage];

    for (const i of keys) {
      selectedMessage = selectedMessage[i];

      if (!selectedMessage) {
        selectedMessage = { messge: key };
        break;
      }
    }

    if (!selectedMessage['message']) {
      return {
        field,
        message: selectedMessage as string,
        code: '',
      };
    }
    return {
      field,
      message: selectedMessage['message'],
      code: selectedMessage['code'],
    };
  }

  getRequestErrorsMessage(requestErrors: Record<string, any>[]): string {
    const messageErrors: string[] = requestErrors.map((value) => {
      return value.property[0];
    });
    return messageErrors[0];
  }
}
