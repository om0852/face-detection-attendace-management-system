import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        // Select password explicitly because it's set to select: false in schema
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Return user without password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
