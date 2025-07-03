from fastapi import FastAPI
from pydantic import BaseModel
import kociemba

app = FastAPI()

class CubeRequest(BaseModel):
    cube_state: str

@app.post("/solve")
def solve_cube(req: CubeRequest):
    try:
        solution = kociemba.solve(req.cube_state)
        return { "solution": solution.split() }
    except Exception as e:
        return { "error": str(e) }
