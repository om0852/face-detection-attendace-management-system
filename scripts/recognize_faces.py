import sys
import json
import numpy as np
import os
from deepface import DeepFace

# Expecting input as: image_path [list_of_known_encodings_json] [list_of_student_ids]

def recognize_faces(image_path, known_encodings, student_ids):
    try:
        # Get embedding for the unknown image
        # verify relies on pair comparison, but we have 1:N
        # So we represent the unknown face first
        
        # We use the same model and detector as registration
        target_embedding_objs = DeepFace.represent(img_path=image_path, model_name="Facenet", detector_backend="ssd", enforce_detection=True)
        
        found_students = []

        if not known_encodings:
             return json.dumps({"success": True, "matches": []})

        # Threshold for Facenet (Cosine Distance) is typically 0.40
        # Increased to 0.50 to handle webcam variations better
        # We will use Cosine distance
        threshold = 0.50

        for target_obj in target_embedding_objs:
            target_encoding = target_obj["embedding"]
            target_encoding_np = np.array(target_encoding)

            best_match_id = None
            best_score = float("inf")

            for i, known_enc in enumerate(known_encodings):
                known_enc_np = np.array(known_enc)
                
                # Calculate Cosine Distance
                # Cosine Distance = 1 - Cosine Similarity
                dot_product = np.dot(target_encoding_np, known_enc_np)
                norm_target = np.linalg.norm(target_encoding_np)
                norm_known = np.linalg.norm(known_enc_np)
                
                if norm_target == 0 or norm_known == 0:
                    distance = 1.0 # max distance
                else:
                    cosine_similarity = dot_product / (norm_target * norm_known)
                    distance = 1 - cosine_similarity

                if distance < threshold:
                    if distance < best_score:
                        best_score = distance
                        best_match_id = student_ids[i]
            
            if best_match_id:
                # Confidence is inverse of distance (roughly)
                # Max distance is 2 (vectors opposite), min is 0 (vectors identical)
                # Map 0 -> 100%, 0.4 -> 0% check?
                # Actually just return 1 - distance as a score, or handle logic in frontend
                # Let's return a confidence score relative to threshold?
                # For simplicity: Use (threshold - distance) / threshold if needed, or just 1 - distance
                confidence = 1 - best_score
                found_students.append({
                    "studentId": best_match_id,
                    "confidence": float(confidence)
                })

        return json.dumps({"success": True, "matches": found_students})

    except ValueError:
        # No face detected
        return json.dumps({"success": True, "matches": []})
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

if __name__ == "__main__":
    try: 
        if len(sys.argv) < 4:
            print(json.dumps({"success": False, "error": "Insufficient arguments."}))
        else:
            # Suppress TensorFlow logs
            os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
            
            img_path = sys.argv[1]
            # Known encodings and IDs are passed as JSON strings
            encodings_list = json.loads(sys.argv[2]) 
            ids_list = json.loads(sys.argv[3])
            
            # Convert list back to numpy arrays for consistency (optional as we loop anyway)
            known_encodings_np = [np.array(e) for e in encodings_list]
            
            print(recognize_faces(img_path, known_encodings_np, ids_list))
    except Exception as e:
         print(json.dumps({"success": False, "error": f"Script failed: {str(e)}"}))
