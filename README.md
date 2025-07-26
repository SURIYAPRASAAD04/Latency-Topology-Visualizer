# Latency Topology Visualizer

A comprehensive network monitoring and visualization dashboard that provides real-time latency analysis, 3D globe visualization, and network topology mapping for cloud providers and exchange servers.

## 🌟 Features

- **3D Globe Monitoring**: Interactive 3D visualization of global network connections and latency
- **Network Topology Visualization**: Dynamic network graph showing connections between servers
- **Historical Latency Analytics**: Comprehensive analytics with heatmaps and time-series charts
- **Performance Metrics Dashboard**: Real-time monitoring with alerts and regional breakdowns
- **Exchange & Provider Management**: Manage cloud providers and exchange servers
- **Real-time Data**: Live latency monitoring and updates

## 🏗️ Architecture

### Frontend
- **Next.js** for effective and innovative user interface
- **React 18** with Vite for fast development
- **Tailwind CSS** for responsive styling
- **Three.js** for 3D visualizations
- **Component-based architecture** with reusable UI components

### Backend
- **Node.js** API server
- **MongoDB** for data persistence
- **Real-time data processing** and latency monitoring
- **RESTful API** endpoints

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22.17.1 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** (comes with Node.js)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SURIYAPRASAAD04/Latency-Topology-Visualizer.git
cd network-monitoring
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add your configuration:

```env
# Add your environment variables here
# MongoDB connection string, API keys, etc.
```

> **Note**: Contact the project maintainer for the complete environment configuration file.

### 4. Start MongoDB

Ensure MongoDB is running on your system:

**Linux/macOS:**
```bash
sudo systemctl start mongod
```

**Windows:**
Start MongoDB service from the Services panel or use:
```bash
net start MongoDB
```

### 5. Run the Application

#### Development Mode (Recommended)
```bash
npm run dev:full
```
This starts both frontend and backend servers:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

#### Alternative Commands

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

**Production build:**
```bash
npm run build
npm start
```

## 🌐 Accessing the Dashboard

Open your web browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
├── public/                 # Static assets
│   ├── assets/images/     # Image resources
│   └── manifest.json      # PWA manifest
├── src/
│   ├── api/               # Backend API
│   │   └── config/        # Database and server configuration
│   │       ├── controllers/ # API controllers
│   │       ├── models/    # Database models
│   │       ├── routes/    # API routes
│   │       └── services/  # Business logic services
│   ├── components/        # Reusable React components
│   │   └── ui/           # UI components
│   ├── pages/            # Application pages
│   │   ├── main-dashboard-3d-globe-monitoring/
│   │   ├── network-topology-visualization/
│   │   ├── historical-latency-analytics/
│   │   ├── performance-metrics-dashboard/
│   │   └── exchange-and-provider-management/
│   ├── styles/           # CSS and styling
│   └── utils/            # Utility functions
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:full` | Start both frontend and backend in development mode |
| `npm run dev` | Start frontend development server only |
| `npm run server` | Start backend server only |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server |

## 📊 Dashboard Pages

### 1. Main Dashboard - 3D Globe Monitoring
- Interactive 3D globe visualization
- Real-time latency monitoring
- Global network connection mapping
- Filter and layer controls

### 2. Network Topology Visualization
- Dynamic network graph
- Node and connection management
- Topology analysis tools
- Interactive network exploration

### 3. Historical Latency Analytics
- Time-series latency charts
- Heatmap visualizations
- Export functionality
- Advanced filtering options

### 4. Performance Metrics Dashboard
- Real-time metrics monitoring
- Alert management system
- Regional performance breakdown
- Provider comparison tools

### 5. Exchange & Provider Management
- Manage cloud providers
- Configure exchange servers
- System configuration panel
- Statistics and monitoring

## 🛠️ Tech Stack

**Frontend:**
- React 
- Vite
- Tailwind CSS
- Three.js
- D3.js
- Recharts

**Backend:**
- Node.js
- MongoDB
- Mongoose

**Development Tools:**
- PostCSS
- ESLint
- Vite


**Note**: This application requires proper environment configuration. Contact the project maintainer for access credentials and detailed setup instructions.
