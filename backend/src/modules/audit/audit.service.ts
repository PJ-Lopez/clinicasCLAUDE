import { Injectable, Logger } from '@nestjs/common';
import { AuditRepository } from './audit.repository';
import { FindAuditLogsQueryDto } from './dto/find-audit-logs-query.dto';
import { AuditAction, AuditLog } from './entities/audit-log.entity';

export interface AuditRecord {
  userId: number | null;
  action: AuditAction;
  entityName: string;
  entityId?: number | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

/**
 * Servicio compartido de auditoria. Inyectado en cada service de dominio,
 * inserta un registro en audit_logs tras cada escritura exitosa.
 * Nunca actualiza ni borra la bitacora.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly repo: AuditRepository) {}

  /** Consulta de la bitacora (solo lectura). Por defecto los ultimos 100 eventos. */
  async find(query: FindAuditLogsQueryDto): Promise<AuditLog[]> {
    const { limit = 100, ...filters } = query;
    const where = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined));
    const rows = await this.repo.search(where, limit);
    // Nunca exponer el hash de contrasena del usuario relacionado.
    return rows.map((r) => (r.user ? { ...r, user: { id: r.user.id, fullName: r.user.fullName, email: r.user.email } as any } : r));
  }

  async record(entry: AuditRecord): Promise<void> {
    try {
      await this.repo.insert({
        userId: entry.userId,
        action: entry.action,
        entityName: entry.entityName,
        entityId: entry.entityId ?? null,
        oldValues: (entry.oldValues ?? null) as any,
        newValues: (entry.newValues ?? null) as any,
        ipAddress: entry.ipAddress ?? null,
      });
    } catch (err) {
      // La auditoria nunca debe tumbar la operacion de negocio ya cometida.
      this.logger.error(`No se pudo registrar auditoria (${entry.action} ${entry.entityName})`, err as Error);
    }
  }
}
