import { Controller, Post, Body } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/weather.dto';
import { WeatherDocument } from './schemas/weather.schema';
@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('/huy')
  getHello(@Body() createWeatherDto: CreateWeatherDto): Promise<WeatherDocument> {
    return this.weatherService.create(createWeatherDto);
  }
}
