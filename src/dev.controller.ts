import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import type { Request } from 'express';
import { RoleEnum } from './schemas/role.schema';
import { Roles } from './decorators/role.decorator';
import { User } from './decorators/user.decorator';

@Controller('/dev')
export class DevController {
  @Get('/gateway-feedback/headers')
  @HttpCode(200)
  getHeaderValues(@Req() req: Request) {
    console.log(req.rawHeaders);

    return {
      message: 'header list has been printed on the console',
    };
  }

  @Get('/gateway-feedback/role')
  @HttpCode(200)
  @Roles([RoleEnum.USER, RoleEnum.ADMIN])
  getRole(@User('role') role: RoleEnum) {
    console.log(role.toString());

    return {
      message: 'role has been printed on the console',
    };
  }

  @Get('/gateway-feedback/uuid')
  @HttpCode(200)
  getUuid(@User('uuid') uuid: string) {
    console.log(uuid);

    return {
      message: 'uuid has been printed on the console',
    };
  }
}
