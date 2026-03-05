# React Web Frontend Workflow Example

A complete walkthrough of building a feature using ProAgents workflow.

---

## Scenario

**Feature:** Add a user profile page with edit functionality
**Project:** Existing React + TypeScript + React Query application

---

## Phase 0: Initialization

### Start Feature

```
User: /feature-start "User Profile Page"
```

### Context Gathered

```markdown
Project: react-app
Type: Web Frontend (React)
Branch: feature/user-profile

Feature: User Profile Page
- Display user information
- Edit profile form
- Avatar upload
```

---

## Phase 1: Codebase Analysis

### Analysis Results

```markdown
## Codebase Analysis Summary

### Tech Stack
- React 18.2
- TypeScript 5.0
- React Query 4.x
- React Router 6.x
- Tailwind CSS

### Directory Structure
src/
├── components/common/    # Button, Input, Card, Modal
├── features/
│   └── auth/             # Existing auth feature
├── hooks/                # useAuth, useApi
├── services/             # apiClient configured
└── types/                # User type exists

### Existing Patterns
- Feature-based organization
- React Query for server state
- React Hook Form for forms
- Tailwind for styling

### Related Code
- User type: src/types/User.ts
- Auth hook: src/hooks/useAuth.ts
- API client: src/services/apiClient.ts
```

---

## Phase 2: Requirements

### Feature Requirements

```markdown
## User Profile Page Requirements

### User Stories
1. As a user, I want to view my profile information
2. As a user, I want to edit my profile details
3. As a user, I want to upload a new avatar

### Functional Requirements
- Display user: name, email, bio, avatar
- Edit form with validation
- Avatar upload (max 5MB, jpg/png)
- Success/error notifications

### Technical Requirements
- Use existing React Query patterns
- Follow feature-based structure
- Add to existing user types

### API Endpoints
- GET /api/users/me - Get current user
- PUT /api/users/me - Update user
- POST /api/users/me/avatar - Upload avatar
```

---

## Phase 3: UI Design

### Design Specification

```markdown
## Profile Page Design

### Layout
┌────────────────────────────────┐
│ Header                         │
├────────────────────────────────┤
│  ┌──────┐                      │
│  │Avatar│  John Doe            │
│  └──────┘  john@example.com    │
│            [Edit Profile]      │
├────────────────────────────────┤
│  Bio                           │
│  ─────────────────────────     │
│  Lorem ipsum dolor sit amet... │
├────────────────────────────────┤
│  Account Details               │
│  ─────────────────────────     │
│  Member since: Jan 2024        │
│  Last login: 2 hours ago       │
└────────────────────────────────┘

### Edit Modal
┌────────────────────────────────┐
│ Edit Profile               [X]│
├────────────────────────────────┤
│  Name: [________________]      │
│  Bio:  [________________]      │
│        [________________]      │
│  Avatar: [Choose File]         │
│                                │
│  [Cancel]        [Save]        │
└────────────────────────────────┘

### Tokens Used
- Colors: bg-white, text-gray-900, text-gray-600
- Spacing: p-6, gap-4
- Border: rounded-lg, border-gray-200
```

---

## Phase 4: Implementation Plan

### File Plan

```markdown
## Files to Create

src/features/profile/
├── index.ts                    # Public exports
├── ProfilePage.tsx             # Main page component
├── components/
│   ├── ProfileHeader.tsx       # Avatar + name section
│   ├── ProfileDetails.tsx      # Bio + details
│   ├── EditProfileModal.tsx    # Edit form modal
│   └── AvatarUpload.tsx        # Avatar upload component
├── hooks/
│   ├── useProfile.ts           # Get profile data
│   └── useUpdateProfile.ts     # Update profile mutation
├── services/
│   └── profileApi.ts           # API functions
└── types.ts                    # Profile-specific types

## Files to Modify
- src/App.tsx                   # Add route
- src/components/common/index.ts # Export if new components
```

### Implementation Order

```markdown
1. Create types.ts
2. Create profileApi.ts
3. Create useProfile.ts and useUpdateProfile.ts
4. Create ProfileHeader.tsx
5. Create ProfileDetails.tsx
6. Create AvatarUpload.tsx
7. Create EditProfileModal.tsx
8. Create ProfilePage.tsx
9. Add route to App.tsx
10. Write tests
```

---

## Phase 5: Implementation

### Step 1: Types

```typescript
// src/features/profile/types.ts
export interface ProfileData {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  bio?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
```

### Step 2: API Service

```typescript
// src/features/profile/services/profileApi.ts
import { apiClient } from '@/services/apiClient';
import type { ProfileData, UpdateProfileDto, UploadAvatarResponse } from '../types';

export const profileApi = {
  getProfile: () =>
    apiClient.get<ProfileData>('/users/me'),

  updateProfile: (data: UpdateProfileDto) =>
    apiClient.put<ProfileData>('/users/me', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post<UploadAvatarResponse>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
```

### Step 3: Hooks

```typescript
// src/features/profile/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../services/profileApi';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });
}

// src/features/profile/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/profileApi';
import type { UpdateProfileDto } from '../types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
```

### Step 4-7: Components

```typescript
// src/features/profile/components/ProfileHeader.tsx
import type { FC } from 'react';
import type { ProfileData } from '../types';

interface ProfileHeaderProps {
  profile: ProfileData;
  onEditClick: () => void;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({
  profile,
  onEditClick,
}) => {
  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
      <img
        src={profile.avatarUrl}
        alt={profile.name}
        className="w-24 h-24 rounded-full object-cover"
      />
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
        <p className="text-gray-600">{profile.email}</p>
        <button
          onClick={onEditClick}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};
```

```typescript
// src/features/profile/components/EditProfileModal.tsx
import { useState } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/common';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import type { ProfileData, UpdateProfileDto } from '../types';

interface EditProfileModalProps {
  profile: ProfileData;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileDto>({
    defaultValues: {
      name: profile.name,
      bio: profile.bio,
    },
  });

  const updateProfile = useUpdateProfile();

  const onSubmit = async (data: UpdateProfileDto) => {
    await updateProfile.mutateAsync(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
```

### Step 8: Main Page

```typescript
// src/features/profile/ProfilePage.tsx
import { useState } from 'react';
import { useProfile } from './hooks/useProfile';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileDetails } from './components/ProfileDetails';
import { EditProfileModal } from './components/EditProfileModal';
import { Spinner } from '@/components/common';

export function ProfilePage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading profile</div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <ProfileHeader
        profile={profile}
        onEditClick={() => setIsEditOpen(true)}
      />

      <ProfileDetails profile={profile} />

      <EditProfileModal
        profile={profile}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
```

### Step 9: Add Route

```typescript
// In src/App.tsx - Add route
import { ProfilePage } from '@/features/profile';

<Route path="/profile" element={<ProfilePage />} />
```

---

## Phase 6: Testing

### Unit Tests

```typescript
// src/features/profile/components/ProfileHeader.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileHeader } from './ProfileHeader';

const mockProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Developer',
  avatarUrl: '/avatar.jpg',
  createdAt: '2024-01-01',
  lastLoginAt: '2024-01-15',
};

describe('ProfileHeader', () => {
  it('renders user information', () => {
    render(<ProfileHeader profile={mockProfile} onEditClick={vi.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEditClick when edit button clicked', async () => {
    const onEditClick = vi.fn();
    render(<ProfileHeader profile={mockProfile} onEditClick={onEditClick} />);

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEditClick).toHaveBeenCalled();
  });
});
```

### Integration Tests

```typescript
// src/features/profile/__tests__/ProfilePage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProfilePage } from '../ProfilePage';

// Mock API
vi.mock('../services/profileApi');

describe('ProfilePage', () => {
  const queryClient = new QueryClient();

  it('displays profile and allows editing', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProfilePage />
      </QueryClientProvider>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Open edit modal
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Verify modal opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

---

## Phase 6.5: Code Review

### Self-Review Checklist

```markdown
✅ Code follows project conventions
✅ TypeScript types properly defined
✅ React Query patterns followed
✅ Error handling implemented
✅ Loading states handled
✅ Accessible (labels, roles)
✅ Tests written
✅ No console.logs
```

---

## Phase 7: Documentation

### Component Documentation

```typescript
/**
 * ProfilePage - User profile view and edit functionality
 *
 * @description Main page component for viewing and editing user profile.
 * Uses React Query for data fetching and caching.
 *
 * @example
 * // Add to router
 * <Route path="/profile" element={<ProfilePage />} />
 */
```

---

## Phase 8: Deployment

### Pre-Deployment Checklist

```markdown
✅ All tests passing
✅ Build succeeds
✅ No linting errors
✅ Staging tested
✅ Code reviewed
```

### Git Commands

```bash
git add .
git commit -m "feat(profile): add user profile page

- Add profile view with header and details
- Add edit profile modal
- Add avatar upload functionality
- Add React Query hooks for data fetching
- Add unit and integration tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

git push origin feature/user-profile
```

---

## Summary

This example demonstrated the complete ProAgents workflow for a React frontend feature:

1. **Initialization** - Created feature branch and gathered context
2. **Analysis** - Understood existing patterns and conventions
3. **Requirements** - Defined user stories and technical requirements
4. **UI Design** - Created wireframes and design specifications
5. **Planning** - Mapped files and implementation order
6. **Implementation** - Built feature following existing patterns
7. **Testing** - Wrote unit and integration tests
8. **Review** - Self-reviewed against checklist
9. **Documentation** - Added code documentation
10. **Deployment** - Prepared for merge and deploy
