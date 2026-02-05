import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { name, email, password, role, studentId, department, year, faceEncoding } = body;

        // Students require face encoding
        if (role === 'student' && !faceEncoding) {
            return NextResponse.json({
                error: 'Face registration is required for student accounts. Please register your face first.'
            }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
            studentId,
            department,
            year,
            faceEncoding: faceEncoding || null,
            isFaceRegistered: !!faceEncoding,
        });

        return NextResponse.json({ success: true, data: newUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
