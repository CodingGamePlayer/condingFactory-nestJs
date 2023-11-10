import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BasePaginationDto } from 'src/common/dto/base-paginatino.dto';
import { MessagesService } from './messages.service';
@Controller('chats/:cid/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  paginateMessage(
    @Param('cid', ParseIntPipe) cid: number,
    @Query() dto: BasePaginationDto,
  ) {
    return this.messagesService.paginateMessages(dto, {
      where: {
        chat: {
          id: cid,
        },
      },
      relations: {
        author: true,
        chat: true,
      },
    });
  }
}
