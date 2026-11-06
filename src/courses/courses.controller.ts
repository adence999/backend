import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  // Get all courses (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.coursesService.getAll();
  }

  // Get single course by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.coursesService.findById(+id);
  }

  // Create course (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      department_id: number;
      course_code: string;
      course_name: string;
      units?: number;
    },
  ) {
    return this.coursesService.createCourse(body);
  }

  // Update course (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.coursesService.updateCourse(+id, body);
  }

  // Delete course (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.coursesService.deleteCourse(+id);
  }
}