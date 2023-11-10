import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { PaginateChatDto } from './dto/paginate-chat.dto';
import { ChatsModel } from './entity/chats.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsModel)
    private readonly chatsRepositoy: Repository<ChatsModel>,
    private readonly commonService: CommonService,
  ) {}

  paginateChats(dto: PaginateChatDto) {
    return this.commonService.paginate(
      dto,
      this.chatsRepositoy,
      {
        relations: {
          users: true,
        },
      },
      'chats',
    );
  }

  async createChat(dto: CreateChatDto) {
    const chat = await this.chatsRepositoy.save({
      users: dto.userIds.map((id) => ({ id })),
    });

    return this.chatsRepositoy.findOne({
      where: { id: chat.id },
    });
  }

  async checkIfChatExists(chatId: number) {
    const exists = await this.chatsRepositoy.exist({
      where: {
        id: chatId,
      },
    });

    return exists;
  }
}
