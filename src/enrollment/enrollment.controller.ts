import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  // Get all enrollments (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.enrollmentsService.getAll();
  }

  // Get single enrollment by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.enrollmentsService.findById(+id);
  }

  // Create enrollment (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      student_id: number;
      section_id: number;
      enrollment_date: string;
      status?: string;
    },
  ) {
    return this.enrollmentsService.createEnrollment(body);
  }

  // Update enrollment (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.enrollmentsService.updateEnrollment(+id, body);
  }

  // Delete enrollment (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.enrollmentsService.deleteEnrollment(+id);
  }
}