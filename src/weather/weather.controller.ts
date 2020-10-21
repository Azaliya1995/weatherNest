import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/weather.dto';
import { WeatherDocument } from './schemas/weather.schema';

@Controller('/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {
  }

  @Get()
  getWeather(@Query() query) {
    return this.weatherService.getWeatherAPI(query);
  }

  @Post('/save')
  getHello(@Body() createWeatherDto: CreateWeatherDto): Promise<WeatherDocument> {
    return this.weatherService.saveCityWeather(createWeatherDto);
  }
}
