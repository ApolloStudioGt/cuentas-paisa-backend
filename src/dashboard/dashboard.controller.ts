import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { GetSummaryDashboard } from './interfaces/get-summary-dashboard';

@Controller('dashboard')
@ApiTags('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async summary(): Promise<GetSummaryDashboard> {
    return this.dashboardService.summary();
  }
}
