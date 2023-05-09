import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonService } from 'src/common/common.service';
import { HashService } from 'src/hash/hash.service';
import { MessageService } from 'src/message/message.service';
import { ErrorMessageInterface } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { IUser } from './guard/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
    private readonly hashService: HashService,
    private httpService: HttpService,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  async postHttp(
    url: string,
    body: Record<string, any>,
    msgHandler: Record<string, any>,
  ): Promise<Observable<AxiosResponse<any>>> {
    return this.httpService.post(url, body).pipe(
      map((response) => response.data),
      catchError((err) => {
        const errors: ErrorMessageInterface = {
          field: msgHandler.property,
          message: this.messageService.get(msgHandler.map),
          code: '',
        };
        if (err.response == 'undefined') {
          throw new BadRequestException(
            this.responseService.error(
              HttpStatus.INTERNAL_SERVER_ERROR,
              [errors],
              'Internal Server Error',
            ),
          );
        }
        throw new BadRequestException(
          this.responseService.error(
            err.response.status,
            [errors],
            err.response.data,
          ),
        );
      }),
    );
  }

  async createAccessToken(payload: Record<string, any>): Promise<string> {
    return this.jwtSign(payload, process.env.AUTH_JWTEXPIRATIONTIME);
  }

  async createAccessRefreshToken(
    payload: Record<string, any>,
  ): Promise<string> {
    return this.jwtSign(payload, process.env.AUTH_REFRESHJWTEXPIRATIONTIME);
  }

  async validateAccessToken(token: string): Promise<Record<string, any>> {
    return this.jwtPayload(token);
  }

  async checkExpirationTime(otptime: Date, exptime: number): Promise<boolean> {
    const skg = new Date().getTime();
    const exp = otptime.getTime();

    if (skg - exp > exptime * 1000) {
      return true;
    }
    return false;
  }

  // jwt
  async jwtSign(
    payload: Record<string, any>,
    expiredIn: string,
  ): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: expiredIn,
    });
  }

  async jwtVerify(token: string): Promise<boolean> {
    // Env
    const authJwtTokenSecret = process.env.AUTH_JWTSECRETKEY;

    const payload: Record<string, any> = this.jwtService.verify(token, {
      secret: authJwtTokenSecret,
    });

    return payload ? true : false;
  }

  async jwtPayload(
    token: string,
    ignoreExpiration?: boolean,
  ): Promise<Record<string, any>> {
    // Env
    const authJwtTokenSecret = process.env.AUTH_JWTSECRETKEY;
    return this.jwtService.verify(token, {
      secret: authJwtTokenSecret,
      ignoreExpiration,
    });
  }

  async generateToken(
    user: IUser,
  ): Promise<{ token: string; refreshtoken: string }> {
    const dailytoken: string = await this.createAccessToken(user);
    if (!dailytoken) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          [
            this.messageService.getErrorMessage(
              'token',
              'auth.token.invalid_token',
            ),
          ],
          'UNAUTHORIZED',
        ),
      );
    }
    const refreshtoken: string = await this.createAccessRefreshToken(user);
    if (!refreshtoken) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          [
            this.messageService.getErrorMessage(
              'token',
              'auth.token.invalid_token',
            ),
          ],
          'UNAUTHORIZED',
        ),
      );
    }

    return {
      token: dailytoken,
      refreshtoken: refreshtoken,
    };
  }

  async generateAccessToken(user: IUser) {
    const dailytoken: string = await this.createAccessToken(user);
    if (!dailytoken) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          [
            this.messageService.getErrorMessage(
              'token',
              'auth.token.invalid_token',
            ),
          ],
          'UNAUTHORIZED',
        ),
      );
    }
    return dailytoken;
  }
}
