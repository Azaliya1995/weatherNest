import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherDocument = Weather & Document;

@Schema()
export class Weather {
  @Prop()
  cityName: string;

  @Prop()
  date: string;

  @Prop()
  temp: string;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
