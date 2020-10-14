import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/weather.dto';
import { WeatherDocument } from './schemas/weather.schema';

@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {
  }

  @Post('/create')
  getHello(@Body() createWeatherDto: CreateWeatherDto): Promise<WeatherDocument> {
    return this.weatherService.create(createWeatherDto);
  }

  @Get(':city')
  getWeatherByCity(@Param() city: string) {
    return this.weatherService.getWeatherByCityAPI(city);
  }

  @Get('/:lat/:lon')
  getWeatherByLatLon(@Param() geo: string) {
    return this.weatherService.getWeatherByLatLonAPI(geo);
  }
}
