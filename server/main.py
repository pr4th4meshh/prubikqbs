import kociemba
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class CubeRequest(BaseModel):
    cube_state: str

@app.post("/solve")
def solve_cube(req: CubeRequest):
    try:
        solution = kociemba.solve(req.cube_state)
        return { "solution": solution.split() }
    except Exception as e:
        return { "error": str(e) }
