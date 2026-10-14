import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * Convierte "true"/"false" del query string a boolean real.
 * Se lee obj[key] (valor crudo) porque enableImplicitConversion ya habria
 * convertido "false" en true antes de llegar aqui.
 */
const toBoolean = ({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
  const raw = obj[key];
  if (raw === 'true' || raw === true) return true;
  if (raw === 'false' || raw === false) return false;
  return raw;
};

export class FindPatientsQueryDto {
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isPriority?: boolean;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isDeceased?: boolean;
}
