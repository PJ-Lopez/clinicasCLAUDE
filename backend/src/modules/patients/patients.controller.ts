import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthUser, CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { CreatePatientDto } from './dto/create-patient.dto';
import { FindPatientsQueryDto } from './dto/find-patients-query.dto';
import { SetPriorityDto } from './dto/set-priority.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly service: PatientsService) {}

  /** GET /patients?isPriority=true  |  GET /patients?isDeceased=true */
  @Get()
  findAll(@Query() query: FindPatientsQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('admin', 'doctor', 'nurse', 'receptionist')
  create(@Body() dto: CreatePatientDto, @CurrentUser() actor: AuthUser) {
    return this.service.create(dto, actor);
  }

  @Patch(':id')
  @Roles('admin', 'doctor', 'nurse', 'receptionist')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePatientDto, @CurrentUser() actor: AuthUser) {
    return this.service.update(id, dto, actor);
  }

  @Patch(':id/deceased')
  @Roles('admin', 'doctor')
  markDeceased(@Param('id', ParseIntPipe) id: number, @CurrentUser() actor: AuthUser) {
    return this.service.markAsDeceased(id, actor);
  }

  @Patch(':id/priority')
  @Roles('admin', 'doctor', 'nurse')
  setPriority(@Param('id', ParseIntPipe) id: number, @Body() dto: SetPriorityDto, @CurrentUser() actor: AuthUser) {
    return this.service.setPriority(id, dto.isPriority, actor);
  }
}
