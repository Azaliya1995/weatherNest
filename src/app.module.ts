import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherModule } from './weather/weather.module';
import { BotModule } from './TelegramBot/bot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI),
    WeatherModule, BotModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}
