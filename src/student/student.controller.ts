import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StudentsService } from './student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  // Get all students (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.studentsService.getAll();
  }

  // Get single student by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.studentsService.findById(+id);
  }

  // Create student (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      student_number: string;
      first_name: string;
      last_name: string;
      email?: string;
      birth_date?: string;
      gender?: string;
      address?: string;
    },
  ) {
    return this.studentsService.createStudent(body);
  }

  // Update student (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.studentsService.updateStudent(+id, body);
  }

  // Delete student (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentsService.deleteStudent(+id);
  }
}