import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentModule } from './departments/department.module';
import { StudentsModule } from './student/student.module';
import { InstructorsModule } from './instructors/instructor.module';
import { CoursesModule } from './courses/courses.module';
import { RoomsModule } from './room/room.module';
import { SectionsModule } from './sections/section.module';
import { EnrollmentsModule } from './enrollment/enrollment.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, DepartmentModule, StudentsModule, InstructorsModule, CoursesModule, RoomsModule, SectionsModule, EnrollmentsModule],
})
export class AppModule {}