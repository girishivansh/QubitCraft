import os
import sys

with open("app/services/quantum_tutor_service.py", "r") as f:
    code = f.read()

code = code.replace("print(f\"Groq API Error: {e}\")", "print(f\"Groq API Error: {e}\"); open('error.log', 'a').write(f\"{e}\\n\")")

with open("app/services/quantum_tutor_service.py", "w") as f:
    f.write(code)

