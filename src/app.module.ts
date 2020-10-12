import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest'), WeatherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
