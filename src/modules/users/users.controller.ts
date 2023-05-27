import { Body, Controller, Get, Inject, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { UserId } from '@/decorators/user-id.decorator';
import {
  UpdateUserCommand,
  UpdateUserUseCase,
  UpdateUserUseCaseSymbol,
} from '@/domains/ports/in';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    @Inject(UpdateUserUseCaseSymbol)
    private readonly _updateUserUseCase: UpdateUserUseCase,
    private readonly usersRepository: UsersRepository,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() id: string) {
    return this.usersRepository.findById(id);
  }

  @Put('/update')
  @UseGuards(JwtAuthGuard)
  update(@UserId() id: string, @Body() dto: UpdateUserDto) {
    const command = new UpdateUserCommand(id, dto.email, dto.desc, dto.avatar);
    return this._updateUserUseCase.updateUser(command);
  }
}
