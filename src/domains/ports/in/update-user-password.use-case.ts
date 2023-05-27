import { UserEntity } from '@/domains/entities';
import { UpdateUserPasswordCommand } from './update-user-password.command';

export const UpdateUserPasswordUseCaseSymbol = Symbol(
  'UpdateUserPasswordUseCaseSymbol',
);

export interface UpdateUserPasswordUseCase {
  updateUserPassword(command: UpdateUserPasswordCommand): Promise<UserEntity>;
}
