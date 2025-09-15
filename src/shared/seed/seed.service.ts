import { Injectable } from '@nestjs/common';
import { PrismaService } from '@MR_CHANGO/shared/database/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async initializeSeed() {}
}
