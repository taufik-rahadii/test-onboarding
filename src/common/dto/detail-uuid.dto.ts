import { IsNotEmpty, IsUUID } from 'class-validator';
import { IsExists } from '../validator/is-exists.validator';
import { BaseEntity } from 'typeorm';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export interface IDetailUuid {
  id: string;
}

export const DetailUuid = (entity?: BaseEntity): Type<IDetailUuid> => {
  class Schema implements IDetailUuid {
    @IsUUID()
    @IsNotEmpty()
    // @IsExists('id', entity)
    id: string;
  }

  return Schema;
};
