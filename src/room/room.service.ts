import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class RoomsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createRoom(data: {
    room_number: string;
    building: string;
    capacity?: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      `INSERT INTO rooms (room_number, building, capacity) 
        VALUES (?, ?, ?)`,
      [
        data.room_number,
        data.building,
        data.capacity ?? 30,
      ],
    );
    return { room_id: result.insertId, ...data };
  }

  async findByRoomNumber(room_number: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT room_id, room_number, building, capacity 
       FROM rooms WHERE room_number = ?`,
      [room_number],
    );
    return rows[0];
  }

  async findById(room_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT room_id, room_number, building, capacity 
       FROM rooms WHERE room_id = ?`,
      [room_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT room_id, room_number, building, capacity 
       FROM rooms`,
    );
    return rows;
  }

  async updateRoom(
    room_id: number,
    partial: {
      room_number?: string;
      building?: string;
      capacity?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      'room_number',
      'building',
      'capacity',
    ];

    for (const field of allowedFields) {
      if (partial[field as keyof typeof partial] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(partial[field as keyof typeof partial]);
      }
    }

    if (fields.length === 0) return await this.findById(room_id);

    values.push(room_id);
    const sql = `UPDATE rooms SET ${fields.join(', ')} WHERE room_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(room_id);
  }

  async deleteRoom(room_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM rooms WHERE room_id = ?',
      [room_id],
    );
    return res.affectedRows > 0;
  }
}