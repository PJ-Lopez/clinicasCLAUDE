import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

/**
 * Acceso a datos de audit_logs. Solo expone insert y lecturas:
 * la bitacora es inmutable, aqui no existe update ni delete a proposito.
 */
@Injectable()
export class AuditRepository {
  constructor(@InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>) {}

  insert(row: Partial<AuditLog>) {
    return this.repo.insert(row as any);
  }

  search(where: FindOptionsWhere<AuditLog>, limit: number) {
    return this.repo.find({
      where,
      relations: { user: true },
      order: { id: 'DESC' },
      take: limit,
    });
  }
}
