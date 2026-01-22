import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Attendance from '@/models/Attendance';
import { runPythonScript } from '@/lib/python';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');
        // Session Info (e.g., "Math-101-Morning") from client
        const session = formData.get('session');

        if (!file || !session) {
            return NextResponse.json({ error: 'Image and Session are required' }, { status: 400 });
        }

        await dbConnect();

        // Fetch all students with registered faces
        // Optimization: In real app, filter by Class/Department to reduce search space
        const students = await User.find({ isFaceRegistered: true, role: 'student' }).lean();

        if (students.length === 0) {
            return NextResponse.json({ success: false, message: 'No registered students found' });
        }

        const encodings = students.map(s => s.faceEncoding);
        const studentIds = students.map(s => s.studentId);

        const buffer = Buffer.from(await file.arrayBuffer());
        const tempFilePath = path.join(os.tmpdir(), `attendance-${Date.now()}.jpg`);
        await writeFile(tempFilePath, buffer);

        try {
            // Call Python script with known encodings
            const result = await runPythonScript('recognize_faces.py', [
                tempFilePath,
                JSON.stringify(encodings),
                JSON.stringify(studentIds)
            ]);

            if (result.success && result.matches.length > 0) {
                const markedStudents = [];

                for (const match of result.matches) {
                    const student = students.find(s => s.studentId === match.studentId);
                    if (student) {
                        // Check if already marked for this session to avoid duplicates
                        const existingRecord = await Attendance.findOne({
                            student: student._id,
                            session: session,
                            date: {
                                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                                $lt: new Date(new Date().setHours(23, 59, 59, 999))
                            }
                        });

                        if (!existingRecord) {
                            await Attendance.create({
                                student: student._id,
                                session: session,
                                status: 'present',
                                confidence: match.confidence,
                                date: new Date()
                            });
                            markedStudents.push({ name: student.name, studentId: student.studentId });
                        }
                    }
                }

                return NextResponse.json({
                    success: true,
                    matches: result.matches.length,
                    marked: markedStudents
                });

            } else {
                return NextResponse.json({ success: true, matches: 0, message: 'No matching faces found' });
            }

        } finally {
            await unlink(tempFilePath).catch(console.error);
        }

    } catch (error) {
        console.error('Attendance Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
