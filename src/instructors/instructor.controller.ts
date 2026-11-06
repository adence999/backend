import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InstructorsService } from './instructor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('instructors')
export class InstructorsController {
  constructor(private instructorsService: InstructorsService) {}

  // Get all instructors (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.instructorsService.getAll();
  }

  // Get single instructor by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.instructorsService.findById(+id);
  }

  // Create instructor (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      department_id: number;
      instructor_name: string;
      email?: string;
      date_hired: string;
    },
  ) {
    return this.instructorsService.createInstructor(body);
  }

  // Update instructor (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.instructorsService.updateInstructor(+id, body);
  }

  // Delete instructor (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.instructorsService.deleteInstructor(+id);
  }
}