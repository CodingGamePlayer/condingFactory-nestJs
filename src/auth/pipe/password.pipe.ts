import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { In } from 'typeorm';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > 8) {
      throw new BadRequestException('비밀번호는 8자리 이하로 입력해주세요.');
    }

    return value.toString();
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(
    private readonly maxLength: number,
    private readonly subject: string,
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.maxLength) {
      throw new BadRequestException(
        `${this.subject}의 최대 길이는 ${this.maxLength} 입니다.`,
      );
    }

    return value.toString();
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly minLength: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < this.minLength) {
      throw new BadRequestException(`최소 길이는 ${this.minLength} 입니다.`);
    }

    return value.toString();
  }
}
