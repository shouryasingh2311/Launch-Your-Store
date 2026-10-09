# ==========================================
# Stage 1: Frontend Build
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Install npm dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source files & build production bundle
COPY index.html vite.config.js tailwind.config.js postcss.config.js ./
COPY src/ ./src/
RUN npm run build

# ==========================================
# Stage 2: Production Python Backend & SPA
# ==========================================
FROM python:3.10-slim AS runner
WORKDIR /app

# Set production environment flags
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY app/ ./app/
COPY api/ ./api/
COPY scripts/ ./scripts/

# Copy built frontend assets from stage 1 into dist/
COPY --from=frontend-builder /app/dist ./dist

# Expose server port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Launch fullstack FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
