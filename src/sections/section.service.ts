import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SectionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createSection(data: {
    course_id: number;
    instructor_id: number;
    room_id: number;
    section_name: string;
    school_year: string;
    semester: string;
    schedule: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO sections (course_id, instructor_id, room_id, section_name, school_year, semester, schedule) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.course_id,
        data.instructor_id,
        data.room_id,
        data.section_name,
        data.school_year,
        data.semester,
        data.schedule,
      ],
    );
    return { section_id: result.insertId, ...data };
  }

  async findBySectionName(section_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT section_id, course_id, instructor_id, room_id, section_name, school_year, semester, schedule 
       FROM sections WHERE section_name = ?`,
      [section_name],
    );
    return rows[0];
  }

  async findById(section_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT section_id, course_id, instructor_id, room_id, section_name, school_year, semester, schedule 
       FROM sections WHERE section_id = ?`,
      [section_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT section_id, course_id, instructor_id, room_id, section_name, school_year, semester, schedule 
       FROM sections`,
    );
    return rows;
  }

  async updateSection(
    section_id: number,
    partial: {
      course_id?: number;
      instructor_id?: number;
      room_id?: number;
      section_name?: string;
      school_year?: string;
      semester?: string;
      schedule?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'course_id',
      'instructor_id',
      'room_id',
      'section_name',
      'school_year',
      'semester',
      'schedule',
    ];

    for (const field of allowedFields) {
      if (partial[field as keyof typeof partial] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(partial[field as keyof typeof partial]);
      }
    }

    if (fields.length === 0) return await this.findById(section_id);

    values.push(section_id);
    const sql = `UPDATE sections SET ${fields.join(', ')} WHERE section_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(section_id);
  }

  async deleteSection(section_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM sections WHERE section_id = ?',
      [section_id],
    );
    return res.affectedRows > 0;
  }
}