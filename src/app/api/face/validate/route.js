import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import { runPythonScript } from '@/lib/python';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Unique filename for temp storage
        const tempFilePath = path.join(os.tmpdir(), `validate-${Date.now()}.jpg`);
        await writeFile(tempFilePath, buffer);

        try {
            // Call Python script to extract face encoding
            const result = await runPythonScript('register_face.py', [tempFilePath]);

            if (result.success) {
                // Return the face encoding without saving to database
                return NextResponse.json({
                    success: true,
                    encoding: result.encoding,
                    message: 'Face validated successfully'
                });
            } else {
                return NextResponse.json({
                    success: false,
                    error: result.error
                }, { status: 400 });
            }

        } finally {
            // Clean up temp file
            await unlink(tempFilePath).catch(console.error);
        }

    } catch (error) {
        console.error('Face Validation Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
