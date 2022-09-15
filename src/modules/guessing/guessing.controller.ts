import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Request,
    HttpException,
    HttpStatus,
    Put
  } from '@nestjs/common';

  import { GuessingService } from './guessing.service';
  import { Guessing } from './interfaces/guessing.interface';

  @Controller('guessing')
  export class GuessingController {
    constructor(private readonly guessingService: GuessingService) {}
    
    @Post('')
    async create(@Request() req): Promise<any> {
      return await this.guessingService.create(req.body.userId);
    }

    @Put('')
    async update(@Request() req): Promise<any> {
      return await this.guessingService.update(req.body.userId, req.body.score, req.body.guessedValue);
    }

    @Delete('')
    async delete(@Request() req): Promise<any> {
      return await this.guessingService.delete(req.body.userId);
    }
  }