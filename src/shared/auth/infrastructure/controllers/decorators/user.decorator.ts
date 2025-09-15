import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { CurrentUser } from '../interface/current-user.interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUser => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user)
      throw new InternalServerErrorException('User not found in request');

    return request.user;
  },
);
