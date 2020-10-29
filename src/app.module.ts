import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherModule } from './weather/weather.module';
import { BotModule } from './TelegramBot/bot.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/weather_db'), WeatherModule, BotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
