# Overview

Betterperplexity is a React-based search application that provides a chat-like interface for internet searches using the Tavily API. The application performs parallel searches across general and news sources, generates AI-powered answers with source citations, and allows users to export research as PNG cards or ZIP bundles. Built as a full-stack application with Express backend and React frontend using modern web technologies.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses React 18 with TypeScript in a single-page application structure. The UI is built with shadcn/ui components and styled using Tailwind CSS with a custom design system. The frontend follows a component-based architecture with separate components for search interface, results display, loading states, and export functionality. State management is handled through React Query for server state and local React state for UI interactions.

## Backend Architecture  
The server is built with Express.js and serves as a REST API proxy to the Tavily search service. The backend handles search requests by making parallel calls to Tavily's general and news endpoints, then combines and processes the results before returning them to the frontend. The server also handles content extraction requests and includes basic error handling and request logging middleware.

## Database Layer
The application uses Drizzle ORM configured for PostgreSQL with migrations support, though the current implementation primarily uses in-memory storage for user data. The database schema is defined in the shared directory and includes basic user models. The Neon Database serverless driver is configured as the database connection adapter.

## Routing and Navigation
Client-side routing is implemented using Wouter, a lightweight React router. The application has a simple route structure with a home page for search functionality and a 404 not-found page. The backend uses Express routing with API endpoints for search and content extraction.

## Build System and Development
The project uses Vite as the build tool and development server with React plugin support. TypeScript configuration covers the entire codebase including client, server, and shared directories. The build process creates both client-side assets and a bundled Node.js server executable using esbuild.

## Styling and UI Components
The frontend uses a comprehensive design system based on shadcn/ui components with Tailwind CSS for styling. The design follows a modern, clean aesthetic with custom color variables and consistent spacing. Components are highly reusable and include accessibility features through Radix UI primitives.

# External Dependencies

## Core Search Service
- **Tavily API**: Primary search engine integration for both general and news searches, requiring API key authentication
- **Parallel Search Strategy**: Simultaneous queries to general/basic and news/advanced endpoints for comprehensive results

## UI and Styling
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography

## Data Management
- **TanStack React Query**: Server state management and caching
- **Neon Database**: Serverless PostgreSQL database service
- **Drizzle ORM**: Type-safe database toolkit with migration support

## Export and File Handling
- **html-to-image**: Converts DOM elements to PNG images for research card export
- **JSZip**: Creates ZIP archives for research bundle downloads
- **FileSaver.js**: Handles client-side file downloads
- **DOMPurify**: Sanitizes HTML content for security

## Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production server builds
- **Replit Integration**: Development environment plugins and error handling