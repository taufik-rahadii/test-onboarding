import { SetMetadata } from '@nestjs/common';

export const SetResponseMessage = (msg: string) =>
  SetMetadata('RESPONSE_MESSAGE', msg);
