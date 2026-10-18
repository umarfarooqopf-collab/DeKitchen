import { NextRequest, NextResponse } from 'next/server';
import { createReservation } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, guests, date, time, specialRequest } = body;

    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Name, email, phone, date, and time are required' },
        { status: 400 }
      );
    }

    const reservation = await createReservation({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      guests: Number(guests) || 2,
      date,
      time,
      specialRequest: specialRequest?.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Table reservation confirmed successfully',
      data: reservation,
    });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process table reservation' },
      { status: 500 }
    );
  }
}
