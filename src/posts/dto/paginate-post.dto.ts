import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-paginatino.dto';

export class PaginatePostDto extends BasePaginationDto {
  @IsNumber()
  @IsOptional()
  where__likeCount__more_than?: number;

  @IsString()
  @IsOptional()
  where__title__i_like?: string;
}
