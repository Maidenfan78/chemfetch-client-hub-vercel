# ChemFetch Client Hub - Agent Instructions

## Project Overview
Next.js 15 web dashboard for chemical safety officers and facility managers. 
Provides chemical register management, SDS viewing, compliance reporting, and administrative tools.

## Setup Commands  
- Install dependencies: `npm install`
- Start development: `npm run dev` (runs on http://localhost:3000)
- Build for production: `npm run build`  
- Start production: `npm start`
- Deploy to Vercel: `npm run deploy`
- Type checking: `npm run type-check`

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **React**: React 19 with modern patterns
- **TypeScript**: Strict mode with comprehensive typing
- **Styling**: Tailwind CSS 4 with custom configuration
- **UI Components**: shadcn/ui with Radix UI primitives
- **Database**: Supabase with generated TypeScript types
- **Authentication**: Supabase Auth with SSR support

## Project Structure  
```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Home dashboard page
│   ├── auth/           # Authentication pages  
│   ├── dashboard/      # Main application pages
│   └── api/            # API routes (if any)
├── components/         # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form components
│   ├── tables/         # Data table components
│   └── layout/         # Layout components
├── lib/                # Utility libraries
│   ├── supabase/       # Supabase client configuration
│   ├── utils.ts        # General utilities
│   └── types.ts        # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## Next.js App Router Patterns
- **Server Components**: Use by default for better performance
- **Client Components**: Use `'use client'` only when needed for interactivity
- **Layouts**: Shared layouts with proper loading states
- **Route Groups**: Organize routes logically with (group) syntax
- **Error Boundaries**: Implement error.tsx files for error handling
- **Loading States**: Create loading.tsx files for async operations

## Supabase Integration
- **Client Types**: Use generated database types from `database.types.ts`
- **SSR Auth**: Properly configured Server-Side Rendering with auth
- **Real-time**: Use Supabase subscriptions for live updates
- **RLS Policies**: Respect Row Level Security in all queries
- **Error Handling**: Graceful handling of database errors

## Component Architecture
- **Composition Pattern**: Build complex UIs from simple, reusable components
- **Prop Types**: Use TypeScript interfaces for all component props
- **Server/Client Boundary**: Clear separation of server and client components
- **State Management**: Use React state and Supabase for data management
- **Form Handling**: Controlled components with validation

## UI/UX Standards
- **Design System**: Consistent use of shadcn/ui components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Dark Mode**: Theme support with next-themes
- **Loading States**: Skeleton loaders and proper loading indicators
- **Error States**: User-friendly error messages and recovery options

## Chemical Register Features
- **Product Management**: CRUD operations for chemical inventory
- **SDS Integration**: Display and manage Safety Data Sheets
- **Inline Editing**: Edit quantities and locations directly in tables
- **Search & Filter**: Advanced filtering by hazard class, location, status
- **Compliance Tracking**: Monitor SDS expiration dates and compliance status
- **Bulk Operations**: Handle multiple products simultaneously

## Data Flow Patterns
- **Server Actions**: Use Next.js Server Actions for form submissions
- **Client State**: React hooks for UI state management
- **Database Sync**: Real-time updates with Supabase subscriptions
- **Optimistic Updates**: Update UI immediately, sync with server
- **Error Recovery**: Graceful handling of network and database errors

## Styling Guidelines
- **Tailwind CSS**: Use utility-first CSS with custom configurations
- **Component Variants**: Use class-variance-authority for component variants
- **Consistent Spacing**: Follow design system spacing scale
- **Color Palette**: Use defined color tokens from shadcn/ui theme
- **Typography**: Consistent font sizes and line heights
- **Animations**: Subtle animations for better UX

## Performance Optimization
- **Static Generation**: Use SSG where possible for better performance
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Use Next.js Image component for assets
- **Bundle Analysis**: Monitor bundle size and optimize imports
- **Caching**: Proper caching strategies for API calls and static assets

## Authentication Flow
- **Protected Routes**: Middleware-based route protection
- **Session Management**: SSR-compatible session handling
- **User Context**: Provide user data throughout the application
- **Login/Logout**: Smooth authentication flow with redirects
- **Role-Based Access**: Different permissions for different user types

## Testing Strategy
- **Component Testing**: Test UI components in isolation
- **Integration Testing**: Test data flow and user interactions
- **Accessibility Testing**: Ensure WCAG compliance
- **Performance Testing**: Monitor Core Web Vitals
- **Manual Testing**: Cross-browser and device testing

## Development Workflow
1. **Design System**: Use shadcn/ui components as base
2. **TypeScript**: Write type-safe code with proper interfaces
3. **Database**: Update types after schema changes
4. **Components**: Build reusable, composable components
5. **Pages**: Implement pages using App Router patterns
6. **Testing**: Test components and user flows

## Environment Configuration
- **Development**: `.env.local` for local development
- **Production**: `.env.production` for production builds
- **Supabase**: Database URL, anon key, service role key
- **Next.js**: Custom configuration in `next.config.ts`
- **Vercel**: Deployment configuration via `vercel.json`

## Common Development Tasks
- **Add New Page**: Create in `src/app/` with proper layout
- **Create Component**: Add to `src/components/` with TypeScript props
- **Database Integration**: Use Supabase client with generated types
- **Style Components**: Use Tailwind CSS with shadcn/ui patterns
- **Handle Forms**: Implement with proper validation and error handling
- **Add Route Protection**: Use middleware for authentication checks

## Production Deployment
- **Vercel Integration**: Automatic deployments from Git
- **Environment Variables**: Properly configured for production
- **Performance Monitoring**: Monitor Core Web Vitals and user experience
- **Error Tracking**: Implement error monitoring and reporting
- **SEO Optimization**: Proper meta tags and structured data
