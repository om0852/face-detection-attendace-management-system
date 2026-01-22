import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export const runPythonScript = (scriptName, args) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(process.cwd(), 'scripts', scriptName);

        // Determine the path to the Python executable in the virtual environment
        const venvPythonPath = process.platform === 'win32'
            ? path.join(process.cwd(), 'scripts', 'venv', 'Scripts', 'python.exe')
            : path.join(process.cwd(), 'scripts', 'venv', 'bin', 'python');

        // Use venv python if it exists, otherwise fallback to system python
        const pythonCmd = fs.existsSync(venvPythonPath)
            ? venvPythonPath
            : (process.platform === 'win32' ? 'py' : 'python3');

        const pythonProcess = spawn(pythonCmd, [scriptPath, ...args]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}: ${errorString}`));
                return;
            }
            try {
                // Attempt to find the JSON part in the output. 
                // DeepFace writes logs to stdout, so we might have text before the JSON.
                const jsonStart = dataString.indexOf('{');
                const jsonEnd = dataString.lastIndexOf('}');

                if (jsonStart !== -1 && jsonEnd !== -1) {
                    const jsonString = dataString.substring(jsonStart, jsonEnd + 1);
                    resolve(JSON.parse(jsonString));
                } else {
                    throw new Error('No JSON object found in output');
                }
            } catch (e) {
                reject(new Error(`Failed to parse Python output: ${dataString}. Error: ${e.message}`));
            }
        });

        pythonProcess.on('error', (err) => {
            reject(err);
        });
    });
};
