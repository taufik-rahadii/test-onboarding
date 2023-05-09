import { Inject } from '@nestjs/common';

export function Hash(): (
  target: Record<string, any>,
  key: string | symbol,
  index?: number,
) => void {
  return Inject(`HashService`);
}
