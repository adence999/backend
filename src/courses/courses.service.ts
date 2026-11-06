import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CoursesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCourse(data: {
    department_id: number;
    course_code: string;
    course_name: string;
    units?: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO courses (department_id, course_code, course_name, units) 
       VALUES (?, ?, ?, ?)`,
      [
        data.department_id,
        data.course_code,
        data.course_name,
        data.units ?? 3,
      ],
    );
    return { course_id: result.insertId, ...data };
  }

  async findByCourseCode(course_code: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT course_id, department_id, course_code, course_name, units 
       FROM courses WHERE course_code = ?`,
      [course_code],
    );
    return rows[0];
  }

  async findById(course_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT course_id, department_id, course_code, course_name, units 
       FROM courses WHERE course_id = ?`,
      [course_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT course_id, department_id, course_code, course_name, units 
       FROM courses`,
    );
    return rows;
  }

  async updateCourse(
    course_id: number,
    partial: {
      department_id?: number;
      course_code?: string;
      course_name?: string;
      units?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'department_id',
      'course_code',
      'course_name',
      'units',
    ];

    for (const field of allowedFields) {
      if (partial[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(partial[field]);
      }
    }

    if (fields.length === 0) return await this.findById(course_id);

    values.push(course_id);
    const sql = `UPDATE courses SET ${fields.join(', ')} WHERE course_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(course_id);
  }

  async deleteCourse(course_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM courses WHERE course_id = ?',
      [course_id],
    );
    return res.affectedRows > 0;
  }
}