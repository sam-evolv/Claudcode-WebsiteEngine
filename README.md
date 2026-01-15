# EvolvAI Website Factory

A powerful web dashboard for converting existing website codebases into reusable templates and generating fully-branded websites in minutes.

## Overview

The EvolvAI Website Factory streamlines the process of creating custom-branded websites by:

1. **Converting existing codebases into standardized templates** with consistent schemas
2. **Generating new websites** from templates with client-specific branding and content
3. **Outputting production-ready code** that can be deployed immediately

Turn an 8-hour website customization job into a 1-hour task.

## Features

### Template Management
- Upload website codebases (ZIP files)
- Automatic framework detection (Next.js + Tailwind supported in MVP)
- Template validation and compatibility checking
- Template spec generation with token mapping
- Reusable template library with tags and search

### Website Generation
- Multi-step wizard interface
- Template selection
- Client details input
- Brand customization (colors, fonts, logos)
- Section configuration
- Real-time generation with progress logs
- ZIP download of generated sites

### Generated Sites Management
- List all generated websites
- Download sites as ZIP archives
- Delete sites
- Track usage and creation dates

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Express.js + Node.js
- **Database**: SQLite (via Drizzle ORM)
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Query
- **File Processing**: Unzipper, Archiver

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or similar package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Claudcode-WebsiteEngine
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── lib/          # API hooks and utilities
│   │   └── pages/        # Application pages
│
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database layer
│   ├── filesystem.ts     # File operations
│   ├── template-analyzer.ts    # Template validation
│   └── generation-engine.ts    # Site generation
│
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema (Drizzle)
│
└── data/                 # Runtime data (created automatically)
    ├── database.db       # SQLite database
    ├── templates/        # Template storage
    │   ├── raw/         # Original uploaded templates
    │   └── standard/    # Standardized templates
    ├── generated/        # Generated websites
    └── uploads/          # Temporary file uploads
```

## Usage Guide

### 1. Upload a Template

1. Navigate to the **Templates** page
2. Click **Upload Template**
3. Fill in template details:
   - **Name**: Descriptive name (e.g., "Premium Trade Dark")
   - **Description**: What the template is best used for
   - **Tags**: Comma-separated tags for filtering
   - **File**: ZIP file of your website codebase
4. Click **Upload Template**

The system will:
- Extract and analyze the codebase
- Detect the framework type
- Validate compatibility
- Create a standardized template with a Template Spec

### 2. Template Compatibility Requirements

For a template to be compatible (MVP):

**Required:**
- `package.json` file
- Tailwind CSS configuration (`tailwind.config.js/ts`)
- Next.js or Vite + React framework

**Recommended:**
- TypeScript configuration
- Consistent theme variables
- CSS custom properties for colors

**Supported Frameworks:**
- Next.js (App Router or Pages Router)
- Vite + React

### 3. Generate a Website

1. Navigate to the **Generator** page
2. Follow the multi-step wizard:

   **Step 1: Template**
   - Select a template from your library

   **Step 2: Client Details**
   - Company name (required)
   - Domain, tagline
   - Contact information (phone, email, address)
   - Primary CTA (label and link)

   **Step 3: Brand Inputs**
   - Color palette (primary, secondary, accent)
   - Typography (heading and body fonts)
   - Upload logo and hero image (optional)

   **Step 4: Sections**
   - Enable/disable page sections
   - Reorder sections

   **Step 5: Generate**
   - Review summary
   - Click **Generate Website**
   - Wait for generation to complete
   - Download ZIP or view in Generated Sites

### 4. Access Generated Sites

1. Navigate to the **Generated Sites** page
2. View all generated websites
3. Actions available:
   - **Download ZIP**: Download the complete project
   - **Delete**: Remove the generated site

## How It Works

### Template Spec

Each template is converted into a standardized format with a **Template Spec**:

```json
{
  "templateId": "premium-trade-dark",
  "name": "Premium Trade Dark",
  "frameworkType": "nextjs-app",
  "tokens": {
    "colors": {
      "primary": "#3b82f6",
      "secondary": "#8b5cf6",
      "accent": "#f59e0b",
      ...
    },
    "typography": {
      "fontFamilyHeading": "Inter",
      "fontFamilyBody": "Inter",
      ...
    }
  },
  "sections": [
    {
      "id": "hero",
      "label": "Hero Section",
      "enabled": true,
      "order": 1,
      "contentFields": ["title", "subtitle", "cta"],
      "mediaFields": ["background"]
    },
    ...
  ],
  "fileMap": {
    "logo": "public/logo.svg",
    "heroMedia": "public/hero.jpg",
    "contentJson": "content/site.json",
    "themeConfig": "tailwind.config.ts",
    "cssVariables": "src/app/globals.css"
  },
  "replacementStrategy": {
    "colors": "both",
    "typography": "both",
    "content": "json-file"
  }
}
```

### Generation Process

1. **Copy template** to new directory
2. **Apply brand tokens**:
   - Update Tailwind configuration
   - Modify CSS variables
   - Configure fonts
3. **Inject client content**:
   - Create `content/site.json` with client details
   - Update package.json metadata
4. **Configure sections**:
   - Enable/disable sections as specified
   - Create `content/sections.json`
5. **Place assets** (if provided):
   - Copy logo and hero image to correct locations

## API Reference

### Templates

- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get single template
- `POST /api/templates/upload` - Upload and process template
- `DELETE /api/templates/:id` - Delete template

### Generation

- `POST /api/generate` - Generate new website

### Generated Sites

- `GET /api/generated-sites` - List all generated sites
- `GET /api/generated-sites/:id` - Get single site
- `GET /api/generated-sites/:id/download` - Download site as ZIP
- `DELETE /api/generated-sites/:id` - Delete site

## Database Schema

### Templates Table
- `id` - Template identifier (slug)
- `name` - Display name
- `description` - Template description
- `tags` - Array of tags
- `frameworkType` - Framework (nextjs-app, vite-react, etc.)
- `status` - ready | processing | error
- `statusMessage` - Error/status details
- `templateSpec` - Full template specification (JSON)
- `usageCount` - Number of times used
- `createdAt` / `updatedAt` - Timestamps

### Generated Sites Table
- `id` - Unique identifier (UUID)
- `slug` - URL-safe identifier
- `templateId` - Reference to template
- `templateName` - Template display name
- `clientDetails` - Client information (JSON)
- `brandInputs` - Brand customization (JSON)
- `sections` - Section configuration (JSON)
- `outputPath` - Filesystem path to generated site
- `createdAt` - Creation timestamp

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=5000
DATABASE_URL=./data/database.db
NODE_ENV=development
```

### Customization

To support additional frameworks:

1. Update `template-analyzer.ts` to detect the framework
2. Add framework-specific validation rules
3. Extend `generation-engine.ts` with framework-specific transformations

## Troubleshooting

### Template Upload Fails

**Issue**: Template marked as "error" after upload

**Solutions**:
- Check that the ZIP contains a valid `package.json`
- Ensure Tailwind CSS is configured
- Verify framework is Next.js or Vite + React
- Check console logs for specific errors

### Generation Fails

**Issue**: Website generation completes but site doesn't build

**Solutions**:
- Run `npm install` in the generated directory
- Check for missing dependencies
- Verify the template was properly standardized
- Review generation logs in the UI

### Database Issues

**Issue**: Database locked or connection errors

**Solutions**:
```bash
# Reset database
rm data/database.db
npm run db:push
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Run Production Server

```bash
npm start
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure persistent storage for `/data` directory
- [ ] Set up backups for SQLite database
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Enable HTTPS
- [ ] Set appropriate file upload limits

## Future Enhancements

### Short-term Improvements
- Real-time template preview
- Bulk template upload
- Template versioning
- Generated site deployment integrations
- AI-assisted content generation
- More granular section content editing

### Long-term Roadmap
- Support for additional frameworks (Vue, Svelte, Astro)
- Visual template editor
- Template marketplace
- Multi-user support with authentication
- Automated testing of generated sites
- Git integration for version control
- Deployment to hosting providers (Vercel, Netlify, etc.)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing documentation
- Review error logs in the console

---

**Built with care by the EvolvAI team**

Transform your website creation workflow from hours to minutes.
