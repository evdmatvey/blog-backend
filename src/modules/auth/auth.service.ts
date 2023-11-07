import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@/modules/users/users.repository';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';

interface UserLoginData {
  _doc: {
    _id: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersRepository: UsersRepository,
    private _jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this._usersRepository.findByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register(dto: CreateUserDto) {
    try {
      const userData = await this._usersRepository.create(dto);

      return {
        token: this._jwtService.sign({ id: userData.id }),
      };
    } catch (err) {
      throw new ForbiddenException('Ошибка при регистрации');
    }
  }

  async login(user: UserLoginData) {
    return {
      token: this._jwtService.sign({ id: user._doc._id }),
    };
  }
}
