import { Model } from 'mongoose';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
              private httpService: HttpService) {
  }

  async create(createWeatherDto: CreateWeatherDto): Promise<WeatherDocument> {
    const weather = new this.weatherModel(createWeatherDto);
    return weather.save();
  }

  async getWeatherByCityAPI(city) {
    const response = await this.httpService.get(`https://api.weatherbit.io/v2.0/current?city=${city.city}&key=147f9303247940138c03f9a9ed25d12b`).toPromise();
    return response.data.data[0];
  }

  async getWeatherByLatLonAPI(geo) {
    const response = await this.httpService.get(`https://api.weatherbit.io/v2.0/current?&${geo.lat}&${geo.lon}&key=147f9303247940138c03f9a9ed25d12b`).toPromise();
    return response.data.data[0];
  }
}
