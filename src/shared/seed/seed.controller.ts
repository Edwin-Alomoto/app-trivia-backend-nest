import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('initialize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Initialize database with seed data',
    description:
      'Populates the database with sample data for testing and development purposes. This will clear all existing data first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Database seeded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Database seeded successfully' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during seeding',
  })
  async initializeSeed() {
    return await this.seedService.initializeSeed();
  }
}
