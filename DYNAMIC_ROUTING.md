# Dynamic Routing Implementation

This document describes the dynamic routing system implemented for the HRM-CMS project.

## Overview

The dynamic routing system allows navigation between pages based on slugs stored in Payload CMS. It enables:

- Navigation from home page (/) to any other page (e.g., /book-a-demo)
- Client-side routing with Next.js Link components
- SEO-friendly metadata generation
- Error handling for non-existent pages

## Implementation Details

### 1. Dynamic Route Handler

**File**: `src/app/(frontend)/[...slug]/page.tsx`

- Handles all page routes except the home page
- Fetches page data from Payload CMS based on slug
- Renders pages using the existing PageRenderer component
- Supports draft mode for preview functionality

### 2. Home Page Route

**File**: `src/app/(frontend)/page.tsx`

- Handles the root route (/)
- Fetches the page with slug "home" from Payload CMS
- Uses the same PageRenderer component for consistency

### 3. Navbar Integration

**File**: `src/app/(frontend)/Components/blocks/NavbarBlock.tsx`

- Already uses Next.js Link components
- CTA button properly navigates to /book-a-demo
- Both desktop and mobile navigation work with dynamic routing

### 4. Button Component

**File**: `src/app/(frontend)/Components/Button.tsx`

- Supports href prop for navigation
- Automatically uses Next.js Link when href is provided
- Maintains existing styling and interactions

## Routing Structure

```
/                           -> Home page (slug: "home")
/book-a-demo               -> Form page (slug: "book-a-demo")
/any-other-page            -> Dynamic page (slug: "any-other-page")
/non-existent-page         -> 404 Not Found
```

## Features Implemented

✅ Dynamic route handler (`[...slug].tsx`) in `app/(frontend)` directory
✅ API integration to fetch page data from Payload CMS based on slug
✅ Page rendering logic using existing block components
✅ Next.js Link components in navbar for client-side navigation
✅ Root route handling for home page
✅ Error handling for non-existent pages (404)
✅ SEO metadata generation
✅ TypeScript support for Next.js 15
✅ Unit tests for routing logic

## Technical Requirements Met

- ✅ Uses Next.js 13+ App Router structure
- ✅ Integrates with existing Payload CMS API endpoints
- ✅ Maintains existing component structure in `/blocks`
- ✅ Handles different block types dynamically
- ✅ Implements proper TypeScript types for page data

## Testing

Unit tests are included in `src/app/(frontend)/[...slug]/page.test.ts` that verify:

- Slug array handling and joining logic
- Static params generation format
- Metadata generation with fallbacks

## Build Status

The project builds successfully with the dynamic routing system:

```
Route (app)                                 Size  First Load JS
├ ƒ /                                      470 B         354 kB
├ ● /[...slug]                             470 B         354 kB
```

Both routes have the same bundle size, ensuring consistent performance.