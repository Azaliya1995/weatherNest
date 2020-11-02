import { Injectable, OnModuleInit } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { COMMANDS, ERRORS } from './bot.constants';

require('dotenv').config();
process.env.NTBA_FIX_319 = '1';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly TelegramBot = require('node-telegram-bot-api');
  private token = process.env.TOKEN;
  private readonly bot = new this.TelegramBot(this.token, { polling: true });

  constructor(private weatherService: WeatherService) {
  }

  onModuleInit() {
    this.botMessage();
  }

  unknownCityError(chatId, city) {
    this.bot.sendMessage(chatId, ERRORS.UNKNOWN_CITY_ERROR.concat(city.join(', ')) + '.');
  }

  validCity(someCity, chatId) {
    const cities = require('all-the-cities');
    const filterCities = cities.filter(city => city.name.toLowerCase().match(`${someCity}`))
      .map(city => city.name);
    const filterCity = filterCities.find(city => city.toLowerCase() === someCity);
    if (filterCity) {
      return filterCity;
    }
    this.unknownCityError(chatId, filterCities);
  }

  unknownCommandError(chatId) {
    this.bot.sendMessage(chatId, ERRORS.UNKNOWN_COMMAND_ERROR);
  }

  sendCommands(chatId) {
    this.bot.sendMessage(chatId, COMMANDS.SEND_COMMANDS_MESSAGE, {
      reply_markup: {
        inline_keyboard: [
          [{ text: COMMANDS.SUBSCRIBE_COMMAND, callback_data: 'subscribe' }],
          [{ text: COMMANDS.TEMPERATURE_COMMAND, callback_data: 'temperature' }],
          [{ text: COMMANDS.DELETE_COMMAND, callback_data: 'delete' }],
        ],
      },
    });
  }

  botMessage() {
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
        const reply = this.validCity(city, chatId);
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
      this.bot.sendMessage(chatId, COMMANDS.ENTER_CITY_COMMAND);
    });
  }
}
