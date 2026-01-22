import sys
from deepface import DeepFace
import os

# Suppress logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

img_path = r"d:\Projects\face-detection-attedance-system\public\images.webp"

backends = ['opencv', 'ssd'] # mtcnn might need extra install

print(f"Testing image: {img_path}")

for backend in backends:
    print(f"\n--- Testing backend: {backend} ---")
    try:
        embedding = DeepFace.represent(img_path=img_path, model_name="Facenet", detector_backend=backend, enforce_detection=True)
        print("Success! Face detected.")
    except Exception as e:
        print(f"Failed: {str(e)}")
