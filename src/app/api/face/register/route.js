import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { runPythonScript } from '@/lib/python';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');
        const studentId = formData.get('studentId');

        if (!file || !studentId) {
            return NextResponse.json({ error: 'Image and Student ID are required' }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ studentId });
        if (!user) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Unique filename for temp storage
        const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}.jpg`);
        await writeFile(tempFilePath, buffer);

        try {
            // Call Python script
            const result = await runPythonScript('register_face.py', [tempFilePath]);

            if (result.success) {
                // Save encoding to DB
                user.faceEncoding = result.encoding;
                user.isFaceRegistered = true;
                await user.save();

                return NextResponse.json({ success: true, message: 'Face registered successfully' });
            } else {
                return NextResponse.json({ success: false, error: result.error }, { status: 400 });
            }

        } finally {
            // Clean up temp file
            await unlink(tempFilePath).catch(console.error);
        }

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
