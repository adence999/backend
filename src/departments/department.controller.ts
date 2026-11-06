import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('departments')
export class DepartmentController {
  constructor(private departmentsService: DepartmentService) {}

  // Get all departments (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.departmentsService.getAll();
  }

  // Get single department by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.departmentsService.findById(+id);
  }

  // Create department (open - for demo)
  @Post()
  async create(@Body() body: { department_name: string; department_code: string }) {
    return this.departmentsService.createDepartment(body.department_name, body.department_code);
  }

  // Update department (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.departmentsService.updateDepartment(+id, body);
  }

  // Delete department (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.departmentsService.deleteDepartment(+id);
  }
}