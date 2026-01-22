import sys
import json
import os
from deepface import DeepFace

def register_face(image_path):
    try:
        # Generate embedding for the face in the image
        # enforce_detection=True ensures we error out if no face is found
        # model_name="Facenet" is a good balance of speed and accuracy
        # detector_backend="opencv" is fast and doesn't require extra heavy installs like retinaface (though retinaface is better)
        # Use 'ssd' as it is more accurate than 'opencv' (Haar) and weights remain downloaded
        embedding_objs = DeepFace.represent(img_path=image_path, model_name="Facenet", detector_backend="ssd", enforce_detection=True)

        if len(embedding_objs) > 0:
            # Return the first face found
            encoding = embedding_objs[0]["embedding"]
            return json.dumps({"success": True, "encoding": encoding})
        else:
            return json.dumps({"success": False, "error": "No face found in the image."})
            
    except ValueError as e:
        # DeepFace raises ValueError when Face could not be detected with enforce_detection=True
        return json.dumps({"success": False, "error": "No face found in the image."})
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No image path provided."}))
    else:
        # Suppress TensorFlow logs
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
        print(register_face(sys.argv[1]))
