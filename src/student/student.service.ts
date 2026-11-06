import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class StudentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createStudent(data: {
    student_number: string;
    first_name: string;
    last_name: string;
    email?: string;
    birth_date?: string;
    gender?: string;
    address?: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO students (student_number, first_name, last_name, email, birth_date, gender, address) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.student_number,
        data.first_name,
        data.last_name,
        data.email || null,
        data.birth_date || null,
        data.gender || null,
        data.address || null,
      ],
    );
    return { student_id: result.insertId, ...data };
  }

  async findByStudentNumber(student_number: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT student_id, student_number, first_name, last_name, email, birth_date, gender, address 
       FROM students WHERE student_number = ?`,
      [student_number],
    );
    return rows[0];
  }

  async findById(student_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT student_id, student_number, first_name, last_name, email, birth_date, gender, address 
       FROM students WHERE student_id = ?`,
      [student_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT student_id, student_number, first_name, last_name, email, birth_date, gender, address 
       FROM students`,
    );
    return rows;
  }

  async updateStudent(
    student_id: number,
    partial: {
      student_number?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      birth_date?: string;
      gender?: string;
      address?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'student_number',
      'first_name',
      'last_name',
      'email',
      'birth_date',
      'gender',
      'address',
    ];

    for (const field of allowedFields) {
      if (partial[field as keyof typeof partial] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(partial[field as keyof typeof partial]);
      }
    }

    if (fields.length === 0) return await this.findById(student_id);

    values.push(student_id);
    const sql = `UPDATE students SET ${fields.join(', ')} WHERE student_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(student_id);
  }

  async deleteStudent(student_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM students WHERE student_id = ?',
      [student_id],
    );
    return res.affectedRows > 0;
  }
}