import { Injectable, OnModuleInit } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly TelegramBot = require('node-telegram-bot-api');
  private token = '1224582895:AAFZfhzxQSLlEo_2_PjneMsQhEp-Gb9vSTs';
  private readonly bot = new this.TelegramBot(this.token, { polling: true });

  constructor(private weatherService: WeatherService) {
  }

  onModuleInit() {
    this.botMessage();
  }

  unknownCityError(chatId, city) {
    this.bot.sendMessage(chatId, 'Maybe you meant one of those:'.concat(city.join(', ')) + '.');
  }

  validCity(someCity, chatId) {
    const cities = require('all-the-cities');
    let filterCity = cities.filter(city => city.name.toLowerCase().match(`${someCity}`));
    filterCity = filterCity.map(city => city.name);
    for (let i = 0; i < filterCity.length; ++i) {
      if (filterCity[i].toLowerCase() === someCity) {
        return filterCity[i];
      }
    }
    this.unknownCityError(chatId, filterCity);
  }

  unknownCommandError(chatId) {
    this.bot.sendMessage(chatId, 'Unknown Command. Choose one of existing: Subscribe, Temperature or Delete');
  }

  sendCommands(chatId) {
    this.bot.sendMessage(chatId, 'Выберите команду:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Subscribe', callback_data: 'subscribe' }],
          [{ text: 'Temperature', callback_data: 'temperature' }],
          [{ text: 'Delete', callback_data: 'delete' }],
        ],
      },
    });
  }

  botMessage() {
    process.env.NTBA_FIX_319 = "1";
    const actions = {};
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      if (msg.text.toLowerCase() === '/start') {
        await this.sendCommands(chatId);
        return;
      }

      const action = actions[chatId];
      const city = msg.text.trim();
      if (action) {
        const reply = this.validCity(city.toLowerCase(), chatId);
        if (action === 'temperature' && reply) {
          this.bot.sendMessage(chatId, await this.weatherService.getFormattedWeather(reply));
        }
      } else {
        this.unknownCommandError(chatId);
        this.sendCommands(chatId);
      }
    });

    this.bot.on('callback_query', (callbackQuery) => {
      const action = callbackQuery.data; //команда
      const msg = callbackQuery.message;
      const chatId = msg.chat.id;

      actions[chatId] = action;
      this.bot.sendMessage(chatId, 'Введите город: ');
    });

    // bot.on('message', async (msg) => {
    //   const chatId = msg.chat.id;
    //   const action = msg.text.toString().toLowerCase().split(' ')[0];
    //   const city = msg.text.trim();
    //   console.log(action[0]);
    //
    //   if (action) {
    //     const reply = validCity(city.toLowerCase(), chatId);
    //     const sayHi = 'hi';
    //     if (action.indexOf(sayHi) === 0) {
    //       bot.sendMessage(
    //         chatId, 'Hello ' + msg.from.first_name + '! I am a weather telegram robot. With me you will never forget your umbrella!');
    //     } else if (action.includes('what')) {
    //       bot.sendMessage(
    //         chatId, await sendCommands(chatId));
    //     } else if (action.includes('temperature')) {
    //       bot.sendMessage(
    //         chatId, 'temperature');
    //     } else if (action.includes('subscribe')) {
    //       bot.sendMessage(
    //         chatId, 'subscribed');
    //     } else if (action.includes('delete')) {
    //       bot.sendMessage(
    //         chatId, 'deleted');
    //     } else {
    //       unknownCommandError(chatId);
    //       sendCommands(chatId);
    //     }
    //   }
    //
    // });

  }
}
