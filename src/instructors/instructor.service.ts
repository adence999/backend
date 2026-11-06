import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class InstructorsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createInstructor(data: {
    department_id: number;
    instructor_name: string;
    email?: string;
    date_hired: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO instructors (department_id, instructor_name, email, date_hired) 
        VALUES (?, ?, ?, ?)`,
      [
        data.department_id,
        data.instructor_name,
        data.email || null,
        data.date_hired,
      ],
    );
    return { instructor_id: result.insertId, ...data };
  }

  async findByEmail(email: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT instructor_id, department_id, instructor_name, email, date_hired 
       FROM instructors WHERE email = ?`,
      [email],
    );
    return rows[0];
  }

  async findById(instructor_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT instructor_id, department_id, instructor_name, email, date_hired 
       FROM instructors WHERE instructor_id = ?`,
      [instructor_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT instructor_id, department_id, instructor_name, email, date_hired 
       FROM instructors`,
    );
    return rows;
  }

  async updateInstructor(
    instructor_id: number,
    partial: {
      department_id?: number;
      instructor_name?: string;
      email?: string;
      date_hired?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'department_id',
      'instructor_name',
      'email',
      'date_hired',
    ];

    for (const field of allowedFields) {
      if (partial[field as keyof typeof partial] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(partial[field as keyof typeof partial]);
      }
    }

    if (fields.length === 0) return await this.findById(instructor_id);

    values.push(instructor_id);
    const sql = `UPDATE instructors SET ${fields.join(', ')} WHERE instructor_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(instructor_id);
  }

  async deleteInstructor(instructor_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM instructors WHERE instructor_id = ?',
      [instructor_id],
    );
    return res.affectedRows > 0;
  }
}