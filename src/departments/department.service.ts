import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class DepartmentService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createDepartment(department_name: string, department_code: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO departments (department_name, department_code) VALUES (?, ?)',
      [department_name, department_code],
    );
    return { department_id: result.insertId, department_name, department_code };
  }

  async findByDepartmentCode(department_code: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT department_id, department_name, department_code FROM departments WHERE department_code = ?',
      [department_code],
    );
    return rows[0];
  }

  async findById(department_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT department_id, department_name, department_code FROM departments WHERE department_id = ?',
      [department_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT department_id, department_name, department_code FROM departments',
    );
    return rows;
  }

  async updateDepartment(department_id: number, partial: { department_name?: string; department_code?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (partial.department_name) {
      fields.push('department_name = ?');
      values.push(partial.department_name);
    }
    if (partial.department_code) {
      fields.push('department_code = ?');
      values.push(partial.department_code);
    }
    
    if (fields.length === 0) return await this.findById(department_id);
    
    values.push(department_id);
    const sql = `UPDATE departments SET ${fields.join(', ')} WHERE department_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(department_id);
  }

  async deleteDepartment(department_id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM departments WHERE department_id = ?', [department_id]);
    return res.affectedRows > 0;
  }
}