import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>) {}

  async create(createWeatherDto: CreateWeatherDto): Promise<WeatherDocument> {
    const weather = new this.weatherModel(createWeatherDto);
    return weather.save();
  }
}

