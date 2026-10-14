import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AuditService } from './audit.service';
import { FindAuditLogsQueryDto } from './dto/find-audit-logs-query.dto';

/** Solo lectura y solo admin. Ej: GET /audit-logs?entityName=patients&entityId=1 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  find(@Query() query: FindAuditLogsQueryDto) {
    return this.service.find(query);
  }
}
