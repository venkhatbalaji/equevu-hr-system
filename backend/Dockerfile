# Use official Python image
FROM python:3.11

# Set working directory
WORKDIR /app

# Copy dependencies first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose backend port
EXPOSE 8000

# Run the FastAPI application
CMD ["python", "main.py"]
