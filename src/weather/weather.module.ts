import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { Weather, WeatherSchema } from './schemas/Weather.schema';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }])],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})

export class WeatherModule {}
