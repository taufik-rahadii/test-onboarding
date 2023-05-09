import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class CommonService {
  constructor(
    private httpService: HttpService,
    private responseService: ResponseService,
  ) {}

  async getHttp(url: string, headers?: Record<string, any>): Promise<any> {
    const post_response = this.httpService.get(url, { headers: headers }).pipe(
      map((axiosResponse: AxiosResponse) => {
        return axiosResponse.data;
      }),
      catchError((err) => {
        throw err;
      }),
    );
    try {
      return await lastValueFrom(post_response);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      Logger.error(
        error.request.host,
        error.response.data,
        this.constructor.name,
      );
      this.responseService.throwError(error.response?.data ?? error);
    }
  }

  async postHttp(
    url: string,
    body?: Record<string, any>,
    headers?: Record<string, any>,
  ): Promise<any> {
    const post_response = this.httpService
      .post(url, body, { headers: headers })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
        catchError((err) => {
          throw err;
        }),
      );
    try {
      return await lastValueFrom(post_response);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      Logger.error(
        error.request.host,
        error.response.data,
        this.constructor.name,
      );
      this.responseService.throwError(error);
    }
  }
}
