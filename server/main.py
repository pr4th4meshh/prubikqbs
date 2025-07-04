from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import cv2
import numpy as np
import kociemba
from collections import Counter

class CubeState(BaseModel):
    cube_state: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility function to calculate Euclidean distance in RGB space
def euclidean_dist(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

# Extract average color from a region
def get_avg_color(img_crop):
    return img_crop.mean(axis=0).mean(axis=0)[::-1]  # BGR → RGB

# Extract grid of 9 avg colors from a face
def extract_face_colors(img):
    h, w = img.shape[:2]
    step_x, step_y = w // 3, h // 3
    colors = []
    for y in range(3):
        for x in range(3):
            crop = img[y*step_y:(y+1)*step_y, x*step_x:(x+1)*step_x]
            colors.append(get_avg_color(crop))
    return colors


def centers_are_unique(centers):
    for i in range(len(centers)):
        for j in range(i + 1, len(centers)):
            if euclidean_dist(centers[i], centers[j]) < 30:  # threshold may be tuned
                return False
    return True



@app.post("/analyze-cube")
async def analyze_cube(files: List[UploadFile] = File(...)):
    if len(files) != 6:
        return {"error": "Please upload exactly 6 images"}

    face_colors = []
    center_colors = []

    for file in files:
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            return {"error": f"Failed to decode image {file.filename}"}
        
        colors = extract_face_colors(img)
        face_colors.append(colors)
        center_colors.append(colors[4])  # middle square

    # Check that center colors are different enough
    if not centers_are_unique(center_colors):
        return {"error": "Detected face center colors are too similar. Try again in better lighting."}

    # Assign U, R, F, D, L, B labels based on order of upload
    labels = ['U', 'R', 'F', 'D', 'L', 'B']
    color_map = dict(zip(labels, center_colors))

    # Assign each sticker to closest label
    cube_string = ""
    for face in face_colors:
        for sticker_color in face:
            closest_label = min(color_map.items(), key=lambda kv: euclidean_dist(kv[1], sticker_color))[0]
            cube_string += closest_label

    if len(cube_string) != 54:
        return {"error": "Final cube string length mismatch"}

    print(Counter(cube_string))    
    return {"cubeString": cube_string}


@app.post("/solve")
async def solve(cube_state: CubeState):
    state = cube_state.cube_state.upper()

    # Rule 1: Length check
    if len(state) != 54:
        raise HTTPException(status_code=422, detail="Cube string must be exactly 54 characters.")

    # Rule 2: Face label count check
    counts = Counter(state)
    if len(counts) != 6:
        raise HTTPException(status_code=422, detail=f"Cube must contain exactly 6 unique face labels, got {list(counts.keys())}")

    if any(count != 9 for count in counts.values()):
        raise HTTPException(status_code=422, detail=f"Each face label must appear 9 times. Got: {dict(counts)}")

    # Optional: return counts for debugging (can remove later)
    print("Cube string label counts:", counts)

    # Rule 3: Try solving with kociemba
    try:
        solution = kociemba.solve(state)
        return {"solution": solution.split()}
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Solver error: {str(e)}")