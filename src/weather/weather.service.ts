import { Model } from 'mongoose';
import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
              private httpService: HttpService) {
  }

  async getWeatherByCityAPI(city) {
    const response = await this.httpService.get(`https://api.weatherbit.io/v2.0/current?city=${city}&key=147f9303247940138c03f9a9ed25d12b`).toPromise();
    return response.data.data[0];
  }

  async getWeatherByLatLonAPI(geo) {
    const response = await this.httpService.get(`https://api.weatherbit.io/v2.0/current?&lat=${geo.lat}&lon=${geo.lon}&key=147f9303247940138c03f9a9ed25d12b`).toPromise();
    return response.data.data[0];
  }

  async saveCityWeather(createWeatherDto: CreateWeatherDto) {
    const citiesInstance = new this.weatherModel({ cityName: createWeatherDto.cityName, date: createWeatherDto.date, temp: createWeatherDto.temp });
    console.log('saveCity:' + citiesInstance);
    return await citiesInstance.save(function(err) {
      if (err) console.log(err);
    });
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  async getWeatherFromDB(city, date) {
    const res = await this.weatherModel.findOne({ cityName: city, date: date }).exec();
    console.log('getWeatherFromDB: ' + res, city, date);
    return res;
  }

  async getWeatherAPI(queryParams) {
    let weather = await this.getWeatherFromDB(queryParams.city.toLowerCase(),
      this.formatDate(new Date));
    if (!weather) {
      let actualWeather = await this.getWeatherByCityAPI(queryParams.city);
      if (!actualWeather){
        actualWeather = await this.getWeatherByLatLonAPI(queryParams);
      }
      if(!actualWeather){
        throw new BadRequestException();
      }
      const weather: CreateWeatherDto = {cityName: actualWeather.city_name.toLowerCase(),
        date: actualWeather.datetime.split(':')[0], temp: actualWeather.temp};
      await this.saveCityWeather(weather);
    }
    weather = await this.getWeatherFromDB(queryParams.city, this.formatDate(new Date));
    return weather;
  }
}
