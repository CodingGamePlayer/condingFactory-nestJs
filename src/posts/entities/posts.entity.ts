import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  // 1) UsersModel과 연동한다. ForeignKey로 연동한다.
  // 2) Null 이 될 수 없다
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: 'title은 string 타입을 입력해야 합니다.',
  })
  title: string;

  @Column()
  @IsString({
    message: 'content는 string 타입을 입력해야 합니다.',
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
