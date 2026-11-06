import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class EnrollmentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createEnrollment(data: {
    student_id: number;
    section_id: number;
    enrollment_date: string;
    status?: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO enrollments (student_id, section_id, enrollment_date, status) 
       VALUES (?, ?, ?, ?)`,
      [
        data.student_id,
        data.section_id,
        data.enrollment_date,
        data.status ?? 'Enrolled',
      ],
    );
    return { enrollment_id: result.insertId, ...data };
  }

  async findById(enrollment_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT enrollment_id, student_id, section_id, enrollment_date, status 
       FROM enrollments WHERE enrollment_id = ?`,
      [enrollment_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT enrollment_id, student_id, section_id, enrollment_date, status 
       FROM enrollments`,
    );
    return rows;
  }

  async updateEnrollment(
    enrollment_id: number,
    partial: {
      student_id?: number;
      section_id?: number;
      enrollment_date?: string;
      status?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'student_id',
      'section_id',
      'enrollment_date',
      'status',
    ];

    for (const field of allowedFields) {
      if (partial[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(partial[field]);
      }
    }

    if (fields.length === 0) return await this.findById(enrollment_id);

    values.push(enrollment_id);
    const sql = `UPDATE enrollments SET ${fields.join(', ')} WHERE enrollment_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(enrollment_id);
  }

  async deleteEnrollment(enrollment_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM enrollments WHERE enrollment_id = ?',
      [enrollment_id],
    );
    return res.affectedRows > 0;
  }
}