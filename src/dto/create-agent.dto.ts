import { IsString, IsPhoneNumber, IsEnum, MinLength } from 'class-validator';
import { Gender } from './constants/enums';

export class CreateAgentDto {
  @IsString()
  firstName: string;

  @IsString()
  middleName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6)
  password: string;

  gender: string;

  @IsPhoneNumber()
  @MinLength(10)
  phone: string;

  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  userId: string;

  agentType: string;

  @IsString()
  country: string;

  @IsString() 
  state: string;

  @IsString() 
  city: string;

  propertySize?: string;
}
