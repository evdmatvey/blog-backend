import { UserEntity } from '@/domains/entities';
import { UpdateUserCommand } from './update-user.command';

export const UpdateUserUseCaseSymbol = Symbol('UpdateUserUseCaseSymbol');

export interface UpdateUserUseCase {
  updateUser(command: UpdateUserCommand): Promise<UserEntity>;
}
