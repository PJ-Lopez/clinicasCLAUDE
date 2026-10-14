import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AUDIT_ACTIONS, AuditAction } from '../entities/audit-log.entity';

/** Filtros para consultar la bitacora: quien hizo que, sobre que registro. */
export class FindAuditLogsQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() userId?: number;
  @IsOptional() @IsString() entityName?: string;
  @IsOptional() @Type(() => Number) @IsInt() entityId?: number;
  @IsOptional() @IsIn(AUDIT_ACTIONS) action?: AuditAction;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(500) limit?: number;
}
