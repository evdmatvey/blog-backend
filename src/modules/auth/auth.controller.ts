import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { LoginUserDto } from '@/modules/users/dto/login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginAndRegisterUserResponse } from './types';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ type: LoginAndRegisterUserResponse })
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    return this._authService.login(req.user);
  }

  @Post('/register')
  @ApiOkResponse({ type: LoginAndRegisterUserResponse })
  register(@Body() dto: CreateUserDto) {
    return this._authService.register(dto);
  }
}
