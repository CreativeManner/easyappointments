#!/bin/bash

# Easy!Appointments Modernization Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Easy!Appointments Modernization Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $NODE_VERSION detected${NC}"

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo -e "${RED}❌ Please run this script from the root directory of Easy!Appointments${NC}"
    exit 1
fi

echo -e "${BLUE}📂 Setting up frontend...${NC}"

# Create frontend directory if it doesn't exist
mkdir -p frontend

# Navigate to frontend directory
cd frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  package.json not found. Please ensure the frontend files are in place.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install dependencies
npm install

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Set up environment variables
echo -e "${BLUE}⚙️  Setting up environment variables...${NC}"

if [ ! -f ".env.local" ]; then
    cat > .env.local << EOL
# Easy!Appointments Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8080
OPENAI_API_KEY=your_openai_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
DATABASE_URL=mysql://user:password@localhost:3306/easyappointments
EOL
    echo -e "${GREEN}✅ Environment variables file created${NC}"
    echo -e "${YELLOW}⚠️  Please update .env.local with your actual API keys${NC}"
else
    echo -e "${GREEN}✅ Environment variables file already exists${NC}"
fi

# Initialize shadcn/ui
echo -e "${BLUE}🎨 Initializing shadcn/ui...${NC}"

# Check if components.json exists
if [ ! -f "components.json" ]; then
    echo -e "${YELLOW}⚠️  Initializing shadcn/ui configuration...${NC}"
    npx shadcn-ui@latest init --defaults
fi

# Install core shadcn/ui components
echo -e "${BLUE}📦 Installing shadcn/ui components...${NC}"

components=(
    "button"
    "card"
    "input"
    "select"
    "calendar"
    "date-picker"
    "sheet"
    "dialog"
    "popover"
    "progress"
    "badge"
    "avatar"
    "tabs"
    "accordion"
    "table"
    "form"
    "toast"
    "alert"
    "separator"
    "label"
    "textarea"
    "checkbox"
    "radio-group"
    "switch"
    "slider"
    "tooltip"
    "dropdown-menu"
    "command"
    "scroll-area"
    "skeleton"
)

for component in "${components[@]}"; do
    echo -e "${BLUE}Installing $component...${NC}"
    npx shadcn-ui@latest add "$component" --yes
done

echo -e "${GREEN}✅ shadcn/ui components installed${NC}"

# Go back to root directory
cd ..

# Setup backend extensions
echo -e "${BLUE}🔧 Setting up backend extensions...${NC}"

# Check if composer is installed
if command -v composer &> /dev/null; then
    echo -e "${GREEN}✅ Composer detected${NC}"
    
    # Install PHP dependencies for AI features
    echo -e "${BLUE}📦 Installing PHP dependencies...${NC}"
    composer require openai-php/client --no-interaction
    composer require pusher/pusher-php-server --no-interaction
    composer require league/oauth2-google --no-interaction
    
    echo -e "${GREEN}✅ PHP dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Composer not found. Please install composer to add PHP dependencies.${NC}"
fi

# Create AI services directory
echo -e "${BLUE}🤖 Setting up AI services...${NC}"

mkdir -p ai-services

cat > ai-services/requirements.txt << EOL
openai==1.12.0
fastapi==0.109.0
uvicorn==0.27.0
sqlalchemy==2.0.25
pandas==2.2.0
scikit-learn==1.4.0
numpy==1.26.3
python-dotenv==1.0.0
pydantic==2.5.3
asyncpg==0.29.0
redis==5.0.1
websockets==12.0
EOL

cat > ai-services/main.py << EOL
"""
AI Services for Easy!Appointments
FastAPI server providing AI-powered features
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Easy!Appointments AI Services",
    description="AI-powered features for appointment scheduling",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Easy!Appointments AI Services"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-services"}

# AI endpoints will be added here
@app.post("/ai/chat")
async def chat_with_ai(message: str):
    # TODO: Implement AI chat functionality
    return {"response": "AI chat functionality coming soon!"}

@app.post("/ai/predict-no-show")
async def predict_no_show(appointment_data: dict):
    # TODO: Implement no-show prediction
    return {"probability": 0.15, "confidence": 0.85}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOL

echo -e "${GREEN}✅ AI services structure created${NC}"

# Create Docker setup
echo -e "${BLUE}🐳 Creating Docker configuration...${NC}"

cat > docker-compose.dev.yml << EOL
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - backend
      - ai-services

  backend:
    build:
      context: .
      dockerfile: Dockerfile.php
    ports:
      - "8080:80"
    volumes:
      - .:/var/www/html
    depends_on:
      - mysql
      - redis

  ai-services:
    build:
      context: ./ai-services
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./ai-services:/app
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - redis

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: easyappointments
      MYSQL_USER: easyappointments
      MYSQL_PASSWORD: easyappointments
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
EOL

echo -e "${GREEN}✅ Docker configuration created${NC}"

# Create development scripts
echo -e "${BLUE}📜 Creating development scripts...${NC}"

cat > run-dev.sh << EOL
#!/bin/bash
# Development runner script

echo "🚀 Starting Easy!Appointments Development Environment"

# Start backend services
echo "Starting backend services..."
docker-compose -f docker-compose.dev.yml up -d mysql redis

# Start AI services
echo "Starting AI services..."
cd ai-services
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py &
AI_PID=\$!
cd ..

# Start frontend
echo "Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=\$!
cd ..

# Start PHP backend
echo "Starting PHP backend..."
php -S localhost:8080 &
BACKEND_PID=\$!

echo "✅ Development environment started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8080"
echo "AI Services: http://localhost:8000"

# Wait for interrupt
wait \$FRONTEND_PID \$BACKEND_PID \$AI_PID
EOL

chmod +x run-dev.sh

echo -e "${GREEN}✅ Development scripts created${NC}"

# Create README for the new structure
cat > DEVELOPMENT.md << EOL
# Easy!Appointments Development Guide

## Quick Start

1. **Setup**: Run the setup script
   \`\`\`bash
   ./setup.sh
   \`\`\`

2. **Development**: Start development servers
   \`\`\`bash
   ./run-dev.sh
   \`\`\`

3. **Access Points**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - AI Services: http://localhost:8000

## Project Structure

\`\`\`
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   ├── lib/             # Utility functions
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
├── ai-services/             # AI/ML services
│   ├── main.py             # FastAPI server
│   └── requirements.txt
├── application/             # Existing PHP backend
├── assets/                  # Legacy assets
└── docker-compose.dev.yml   # Development environment
\`\`\`

## Available Scripts

- \`./setup.sh\` - Initial setup
- \`./run-dev.sh\` - Start development environment
- \`cd frontend && npm run dev\` - Frontend only
- \`cd ai-services && python main.py\` - AI services only

## Environment Variables

Copy \`.env.local\` and update with your API keys:

- \`OPENAI_API_KEY\` - OpenAI API key for AI features
- \`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY\` - Google Maps API key
- \`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\` - Stripe API key

## Development Workflow

1. **Frontend Development**: Work in \`frontend/src/\`
2. **Backend Extensions**: Extend existing PHP controllers
3. **AI Features**: Develop in \`ai-services/\`
4. **Testing**: Use the development environment

## Deployment

See \`MODERNIZATION_PLAN.md\` for deployment instructions.
EOL

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Update .env.local with your API keys"
echo "2. Run './run-dev.sh' to start development"
echo "3. Visit http://localhost:3000 to see the new frontend"
echo "4. Read DEVELOPMENT.md for detailed development guide"
echo "5. Check MODERNIZATION_PLAN.md for the complete roadmap"
echo ""
echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo "- Add your OpenAI API key to .env.local"
echo "- Configure your database connection"
echo "- Update any other API keys as needed"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"