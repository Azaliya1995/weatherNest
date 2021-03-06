import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { BotService } from './TelegramBot/bot.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private botService:BotService) {}

  @Get()
  getBotDialog(@Res() res) {
    this.botService.botMessage();
    res.status(HttpStatus.OK).send("Bot service started");
  }
}
