import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/users/entity/users.entity';

export class ResgisterUserDto extends PickType(UsersModel, [
  'email',
  'password',
  'nickname',
]) {}
