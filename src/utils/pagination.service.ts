import { Injectable } from '@nestjs/common';
import { MainPagingDTO } from 'src/common/dto/main-paging.dto';
import { ILike } from 'typeorm';

@Injectable()
export class PaginationService<T> {
  public buildPaginateQuery(
    { page, size, search, sort, order }: MainPagingDTO,
    allowedToSearch?: (keyof T)[],
  ) {
    const skip = page > 1 ? page * size - size : 0;
    const take = size;
    const searchStr = `%${search}%`;

    const object =
      search.length > 0
        ? allowedToSearch.map((column) => {
            const obj: any = {
              [column]: ILike(searchStr),
            };

            return obj;
          })
        : [];

    return {
      skip,
      take,
      where: object,
      sort: {
        [sort]: order,
      },
    };
  }
}
