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


# 📁 Project Structure: `my-angular-app`

```text
my-angular-app/
├── src/
│   ├── app/                           # Main application source code
│   │   ├── core/                      # Singleton services and global utilities
│   │   │   ├── guards/               # Route guards (e.g., AuthGuard)
│   │   │   ├── interceptors/         # HTTP interceptors (e.g., JwtInterceptor)
│   │   │   ├── services/             # Core services used across app (e.g., AuthService)
│   │   │   ├── models/               # Core data models and interfaces (e.g., User)
│   │   │   ├── state/                # Centralized state management (e.g., NgRx)
│   │   │   └── core.module.ts        # Core module declaration
│   │   ├── shared/                   # Shared and reusable components, pipes, directives
│   │   │   ├── components/           # Reusable UI components (e.g., buttons, loaders)
│   │   │   ├── directives/           # Shared custom directives
│   │   │   ├── pipes/                # Shared custom pipes
│   │   │   ├── utils/                # Utility functions (e.g., string formatters)
│   │   │   ├── models/               # Shared interfaces (e.g., Pagination)
│   │   │   └── shared.module.ts      # Shared module declaration
│   │   ├── modules/                  # Feature modules grouped by domain
│   │   │   ├── dashboard/            # Dashboard module
│   │   │   │   ├── components/       # Dashboard-specific components
│   │   │   │   ├── pages/            # Dashboard pages (e.g., DashboardPageComponent)
│   │   │   │   ├── services/         # Dashboard services
│   │   │   │   ├── models/           # Dashboard models/interfaces
│   │   │   │   ├── dashboard.module.ts
│   │   │   │   └── dashboard-routing.module.ts
│   │   │   ├── user-management/      # User Management module
│   │   │   │   ├── components/       # Components specific to user management
│   │   │   │   ├── pages/            # User management pages
│   │   │   │   ├── services/         # Services related to user accounts
│   │   │   │   ├── models/           # Interfaces for user data
│   │   │   │   ├── user-management.module.ts
│   │   │   │   └── user-management-routing.module.ts
│   │   │   ├── reports/              # Reports module
│   │   │   │   ├── components/       # Report-specific components
│   │   │   │   ├── pages/            # Report-related pages
│   │   │   │   ├── services/         # Report data services
│   │   │   │   ├── models/           # Report interfaces
│   │   │   │   ├── reports.module.ts
│   │   │   │   └── reports-routing.module.ts
│   │   │   ├── vendor/               # Vendor module
│   │   │   │   ├── components/       # Vendor-specific components
│   │   │   │   ├── pages/            # Vendor pages (e.g., VendorListPageComponent)
│   │   │   │   ├── services/         # Vendor services (e.g., VendorService)
│   │   │   │   ├── models/           # Vendor interfaces (e.g., Vendor)
│   │   │   │   ├── vendor.module.ts
│   │   │   │   └── vendor-routing.module.ts
│   │   ├── layouts/                  # Application layout components
│   │   │   ├── main-layout/          # Layout for main app (header, sidebar, etc.)
│   │   │   └── auth-layout/          # Layout used for login/register pages
│   │   ├── app.component.ts          # Root component
│   │   ├── app.config.ts             # App-wide config (for standalone setups)
│   │   ├── app.routes.ts             # Root routing definition
│   │   └── app.module.ts             # Main module declaration
│   ├── assets/                       # Static assets (images, fonts, icons)
│   ├── environments/                 # Environment-specific configuration files
│   │   ├── environment.ts            # Default development environment
│   │   └── environment.prod.ts       # Production environment
│   ├── styles/                       # Global styles and variables
│   │   ├── variables.css             # CSS variables (colors, fonts, spacing)
│   │   ├── reset.css                 # Reset/normalize styles
│   │   └── global.css                # Global styling for app
│   ├── index.html                    # Entry HTML file
│   ├── main.ts                       # Main TypeScript entry point
│   ├── polyfills.ts                  # Polyfills for browser compatibility
│   └── styles.css                    # Global stylesheet entry point
├── angular.json                     # Angular CLI configuration
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Project documentation
 ```
