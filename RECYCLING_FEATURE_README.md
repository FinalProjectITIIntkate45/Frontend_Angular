# Recycling Feature Implementation

## Overview

This document describes the implementation of the recycling feature in the Angular frontend application. The feature allows clients to view available recycling materials, create recycling requests, and track their recycling history.

## Features Implemented

### 1. Recycling Materials Management

- **View Available Materials**: Display all available recycling materials with their details
- **Material Information**: Shows material name, unit type, points per unit, and images
- **Material Selection**: Users can select materials to create recycling requests

### 2. Recycling Request Creation

- **Request Form**: Comprehensive form for creating recycling requests
- **Image Upload**: Optional image upload for material verification
- **City Information**: Required city field for location-based processing
- **Form Validation**: Client-side validation for required fields

### 3. Request History Management

- **Request Tracking**: View all user's recycling requests
- **Status Display**: Shows request status (Pending, Accepted, Rejected, Completed)
- **Points Tracking**: Display points awarded for completed requests
- **Date Information**: Shows when requests were created

## File Structure

```
src/app/modules/Clients/
├── Models/
│   ├── recycling-material.model.ts          # Material interfaces and enums
│   └── recycling-request.model.ts           # Request interfaces and enums
├── Services/
│   └── recycling.service.ts                 # API communication service
└── components/recycling-section/
    ├── recycling-section.component.ts       # Main component logic
    ├── recycling-section.component.html     # Component template
    └── recycling-section.component.css      # Component styling
```

## Models

### RecyclingMaterial

```typescript
interface RecyclingMaterial {
  id: number;
  name: string;
  unitType: UnitOfMeasurementType;
  pointsPerUnit: number;
  materialImage?: string;
  totalRecyclingRequests?: number;
  totalScrapAuctions?: number;
}
```

### RecyclingRequestCreateViewModel

```typescript
interface RecyclingRequestCreateViewModel {
  materialId: number;
  unitType: UnitOfMeasurementType;
  requestImage?: string;
  city: string;
}
```

### UnitOfMeasurementType Enum

```typescript
enum UnitOfMeasurementType {
  Kilogram = 1,
  Gram = 2,
  Liter = 3,
  Milliliter = 4,
  Piece = 5,
  Meter = 6,
  Centimeter = 7,
}
```

### RecyclingRequestStatus Enum

```typescript
enum RecyclingRequestStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Completed = 4,
}
```

## API Endpoints

The service communicates with the following backend endpoints:

### Materials (Read-Only Operations)

- `GET /api/RecyclingMaterialsApi/getall` - Get all available materials
- `GET /api/RecyclingMaterialsApi/{id}` - Get specific material details

**Note**: Material CRUD operations (Create, Update, Delete) are handled in the MVC controllers, not in the API.

### Requests (Client Operations)

- `POST /api/RecyclingRequest/CreateRequest` - Create new recycling request
- `GET /api/RecyclingRequest/my-requests` - Get user's requests
- `GET /api/RecyclingRequest/{id}` - Get specific request details

## Component Features

### RecyclingSectionComponent

- **State Management**: Manages different view states (materials list, request form, history)
- **Form Handling**: Reactive forms with validation
- **File Upload**: Image upload with preview functionality
- **Error Handling**: Comprehensive error and success message handling
- **Loading States**: Loading spinners for better UX

### UI Features

- **Responsive Design**: Mobile-friendly layout
- **Modern Styling**: Bootstrap-based design with custom CSS
- **Interactive Elements**: Hover effects, animations, and transitions
- **Status Indicators**: Color-coded badges for request status
- **Empty States**: Helpful messages when no data is available

## Usage

### For Users

1. Navigate to the recycling section from the sidebar
2. View available materials and their point values
3. Select a material to create a recycling request
4. Fill in the required information (city, optional image)
5. Submit the request
6. Track request status in the "My Requests" tab

### For Developers

1. The component is already integrated into the client module
2. All necessary imports and dependencies are configured
3. The service is provided at root level for dependency injection
4. Environment configuration is set up for API communication

## Styling

The component uses a modern, eco-friendly design with:

- Green color scheme representing sustainability
- Card-based layout for materials
- Gradient backgrounds and shadows
- Smooth animations and transitions
- Responsive design for all screen sizes

## Future Enhancements

Potential improvements for the recycling feature:

1. **Real-time Updates**: WebSocket integration for live status updates
2. **Bulk Requests**: Allow multiple materials in one request
3. **Material Categories**: Group materials by type
4. **Progress Tracking**: Visual progress indicators for request processing
5. **Notifications**: Push notifications for status changes
6. **Analytics**: User recycling statistics and achievements

## Dependencies

- Angular Reactive Forms
- Bootstrap CSS Framework
- Font Awesome Icons
- Angular HTTP Client
- Environment Configuration

## Testing

To test the feature:

1. Ensure the backend API is running
2. Navigate to the recycling section
3. Test material loading and display
4. Test request creation with and without images
5. Test form validation
6. Test request history display
7. Test responsive design on different screen sizes
