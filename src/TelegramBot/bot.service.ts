import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class BotService implements OnModuleInit {
  onModuleInit() {
    this.botMessage();
  }

  botMessage() {
    process.env.NTBA_FIX_319 = '1';
    const TelegramBot = require('node-telegram-bot-api');
    const token = '1224582895:AAFZfhzxQSLlEo_2_PjneMsQhEp-Gb9vSTs';
    const bot = new TelegramBot(token, { polling: true });

    function unknownCommandError(chatId) {
      bot.sendMessage(chatId, 'Unknown Command. Choose one of existing: Subscribe, Temperature or Delete');
    }

    function sendCommands(chatId) {
      bot.sendMessage(chatId, 'Выберите команду:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Subscribe', callback_data: 'subscribe' }],
            [{ text: 'Temperature', callback_data: 'temperature' }],
            [{ text: 'Delete', callback_data: 'delete' }],
          ],
        },
      });
    }

    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const action = msg.text.toString().toLowerCase();

      if (action) {
        const sayHi = 'hi';
        if (action.indexOf(sayHi) === 0) {
          bot.sendMessage(
            chatId, 'Hello ' + msg.from.first_name + '! What would you like to know about me ?');
        } else if (action.includes('who')) {
          bot.sendMessage(
            chatId, 'I am a weather telegram robot. With me you will never forget your umbrella!');
        } else if (action.includes('subscribe')) {
          bot.sendMessage(
            chatId, 'subscribed');
        } else if (action.includes('temperature')) {
          bot.sendMessage(
            chatId, 'temperature');
        } else if (action.includes('delete')) {
          bot.sendMessage(
            chatId, 'deleted');
        } else {
          unknownCommandError(chatId);
          sendCommands(chatId);
        }
      }

    });
  }
}
