# Python Environment Setup

This project uses Python scripts for face recognition powered by **DeepFace**. You need to set up a virtual environment and install the dependencies.

## Setup Instructions

1.  Open a terminal in this directory (`scripts/`).
2.  Create a virtual environment (if you haven't already):
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    - **Windows**: `.\venv\Scripts\activate`
    - **Mac/Linux**: `source venv/bin/activate`
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Important Notes

- **First Run**: The `deepface` library will automatically download the necessary face recognition models (e.g., Facenet) the first time you run the scripts. This may take a few minutes depending on your internet connection.
- **TensorFlow**: The library uses TensorFlow. If you see warnings about CPU instructions (AVX/AVX2), you can ignore them; they are just performance optimizations.
