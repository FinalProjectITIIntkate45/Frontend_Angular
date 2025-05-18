# PointPay

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



my-angular-app/
├── src/
│*├── app/
│*│*├── core/***# Singleton services, app-wide utilities
│*│*│*├── guards/**# Route guards (e.g., AuthGuard)
│*│*│*├── interceptors/**# HTTP interceptors (e.g., JwtInterceptor)
│*│*│*├── services/* # Core services (e.g., AuthService, ApiService)
│*│*│*├── models/**# Core interfaces and types (e.g., User, ApiResponse)
│*│*│*├── state/** # Centralized state management (NgRx store)
│*│*│*└── core.module.ts  # Core module for app-wide features
│*│*├── shared/*** # Reusable components, pipes, directives
│*│*│*├── components/**  # Shared components (e.g., ButtonComponent, LoaderComponent)
│*│*│*├── directives/**  # Shared directives (e.g., HighlightDirective)
│*│*│*├── pipes/**# Shared pipes (e.g., FormatDatePipe)
│*│*│*├── utils/**# Utility functions (e.g., string manipulation)
│*│*│*├── models/*  # Shared interfaces (e.g., Pagination)
│*│*│*└── shared.module.ts*  # Shared module for reusable features
│*│*├── modules/***# Feature modules (grouped by domain)
│*│*│*├── dashboard/*# Dashboard feature module
│*│*│*│*├── components/*# Dashboard-specific components
│*│*│*│*├── pages/**  # Page components (e.g., DashboardPageComponent)
│*│*│*│*├── services/*  # Dashboard-specific services
│*│*│*│*├── models/** # Dashboard-specific interfaces
│*│*│*│*├── dashboard.module.ts
│*│*│*│*└── dashboard-routing.module.ts
│*│*│*├── user-/*# User management feature module
│*│*│*│*├── components/*# User management-specific components
│*│*│*│*├── pages/**  # Page components
│*│*│*│*├── services/*  # User management-specific services
│*│*│*│*├── models/** # User management-specific interfaces
│*│*│*│*├── user-.module.ts
│*│*│*│*└── user-management-routing.module.ts
│*│*│*├── reports/*  # Reports feature module
│*│*│*│*├── components/*# Reports-specific components
│*│*│*│*├── pages/**  # Page components
│*│*│*│*├── services/*  # Reports-specific services
│*│*│*│*├── models/** # Reports-specific interfaces
│*│*│*│*├── reports.module.ts
│*│*│*│*└── reports-routing.module.ts
│*│*│*├── vendor/**# Vendor feature module
│*│*│*│*├── components/*# Vendor-specific components
│*│*│*│*├── pages/**  # Page components (e.g., VendorListPageComponent)
│*│*│*│*├── services/*  # Vendor-specific services (e.g., VendorService)
│*│*│*│*├── models/** # Vendor-specific interfaces (e.g., Vendor)
│*│*│*│*├── vendor.module.ts
│*│*│*│*└── vendor-routing.module.ts
│*│*├── layouts/***# Layout components (e.g., MainLayoutComponent)
│*│*│*├── main-layout/**# Main layout with header, sidebar
│*│*│*└── auth-layout/**# Auth layout for login/register
│*│*├── app.component.ts* # Root component
│*│*├── app.config.ts** # Application configuration (standalone setup)
│*│*├── app.routes.ts** # Root-level routing
│*│*└── app.module.ts** # Root module (optional for standalone)
│*├── assets/**  # Static assets (images, fonts, etc.)
│*├── environments/**  # Environment-specific configuration
│*│*├── environment.ts*  # Default environment
│*│*└── environment.prod.ts# Production environment
│*├── styles/**  # Global styles (SCSS)
│*│*├── variables.css*  # SCSS variables (e.g., colors, fonts)
│*│*├── reset.css*# SCSS reset
│*│*└── global.css**  # Global styles
│*├── index.html**  # Main HTML file
│*├── main.ts***  # Main entry point
│*├── polyfills.ts**# Polyfills for browser compatibility
│*└── styles.css** # Global SCSS entry point
├── angular.json*** # Angular CLI configuration
├── package.json*** # Project dependencies
├── tsconfig.json***# TypeScript configuration
└── README.md** # Project documentation
