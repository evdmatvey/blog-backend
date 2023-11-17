import { Body, Controller, Get, Inject, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserId } from '@/decorators/user-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import {
  UpdateUserCommand,
  UpdateUserUseCase,
  UpdateUserUseCaseSymbol,
  UpdateUserPasswordUseCase,
  UpdateUserPasswordUseCaseSymbol,
  UpdateUserPasswordCommand,
} from '@/domains/ports/in';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserResponse } from './types';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    @Inject(UpdateUserUseCaseSymbol)
    private readonly _updateUserUseCase: UpdateUserUseCase,
    @Inject(UpdateUserPasswordUseCaseSymbol)
    private readonly _updateUserPasswordUseCase: UpdateUserPasswordUseCase,
    private readonly usersRepository: UsersRepository,
  ) {}

  @Get('/me')
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() id: string) {
    return this.usersRepository.findById(id);
  }

  getAll() {
    return this.usersRepository.getAll();
  }

  @Put('/update')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(JwtAuthGuard)
  async update(@UserId() id: string, @Body() dto: UpdateUserDto) {
    const command = new UpdateUserCommand(id, dto.email, dto.desc, dto.avatar);
    return (await this._updateUserUseCase.updateUser(command)).getUserData();
  }

  @Put('/update/password')
  @ApiBody({ type: UpdateUserPasswordDto })
  @ApiOkResponse({ type: UserResponse })
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @UserId() id: string,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    const command = new UpdateUserPasswordCommand(id, dto.password);
    return (
      await this._updateUserPasswordUseCase.updateUserPassword(command)
    ).getUserData();
  }
}
