import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SectionsService } from './section.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sections')
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  // Get all sections (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.sectionsService.getAll();
  }

  // Get single section by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.sectionsService.findById(+id);
  }

  // Create section (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      course_id: number;
      instructor_id: number;
      room_id: number;
      section_name: string;
      school_year: string;
      semester: string;
      schedule: string;
    },
  ) {
    return this.sectionsService.createSection(body);
  }

  // Update section (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.sectionsService.updateSection(+id, body);
  }

  // Delete section (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sectionsService.deleteSection(+id);
  }
}