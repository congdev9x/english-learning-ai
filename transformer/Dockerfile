FROM python:3.10-slim

# ✅ Cài git để pip install từ GitHub
RUN apt-get update && apt-get install -y git ffmpeg && rm -rf /var/lib/apt/lists/*


WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
