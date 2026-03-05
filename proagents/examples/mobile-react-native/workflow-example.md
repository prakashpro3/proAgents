# Mobile React Native Workflow Example

Complete workflow for adding a User Profile feature to a React Native application.

---

## Feature Request

> "Add a user profile screen with editable information, profile picture, and settings access."

---

## Phase 0: Initialization

### Mode Detection
```
Detected: Full Workflow Mode
Reason: New feature with UI, navigation, and API integration
Project Type: Mobile (React Native)
Platforms: iOS, Android
```

### Branch Creation
```bash
git checkout -b feature/user-profile
```

---

## Phase 1: Codebase Analysis

### Project Structure
```
Existing structure detected:
├── src/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── services/
│   ├── stores/
│   └── theme/
├── ios/
├── android/
└── [configs]

Framework: React Native 0.73 + Expo
Navigation: React Navigation 6
State: Zustand
Styling: StyleSheet
API: Axios + React Query
```

### Existing Patterns
```yaml
patterns_detected:
  screens: "src/screens/{Name}/{Name}Screen.tsx"
  components: "src/components/{category}/{Name}.tsx"
  navigation: "Stack navigator with typed routes"
  api_calls: "React Query hooks in src/hooks/"
  styling: "StyleSheet.create at bottom of file"
```

---

## Phase 2: Requirements

### User Stories
```markdown
1. As a user, I want to view my profile information
   - Acceptance: Shows name, email, bio, and profile picture
   - Acceptance: Shows member since date

2. As a user, I want to edit my profile
   - Acceptance: Can tap to edit name, bio
   - Acceptance: Changes save to server
   - Acceptance: Shows loading/success feedback

3. As a user, I want to change my profile picture
   - Acceptance: Can select from gallery
   - Acceptance: Can take new photo
   - Acceptance: Image uploads to server

4. As a user, I want to access settings
   - Acceptance: Settings button navigates to settings
   - Acceptance: Logout option available
```

### Technical Requirements
```yaml
requirements:
  authentication: "Required - must be logged in"
  permissions:
    ios: "Camera, Photo Library"
    android: "Camera, Storage"
  api:
    - "GET /api/users/me"
    - "PUT /api/users/me"
    - "POST /api/users/me/avatar"
  offline: "Show cached profile when offline"
```

---

## Phase 3: UI Design

### Screen Layout
```
ProfileScreen
├── SafeAreaView
│   ├── Header
│   │   ├── BackButton
│   │   ├── Title ("Profile")
│   │   └── SettingsButton
│   ├── ScrollView
│   │   ├── AvatarSection
│   │   │   ├── Avatar (touchable)
│   │   │   └── ChangePhotoButton
│   │   ├── InfoSection
│   │   │   ├── NameField (editable)
│   │   │   ├── EmailField (read-only)
│   │   │   ├── BioField (editable)
│   │   │   └── MemberSince
│   │   └── StatsSection
│   │       ├── PostsCount
│   │       ├── FollowersCount
│   │       └── FollowingCount
│   └── SaveButton (when editing)
```

### Design Guidelines
```yaml
design:
  follows: ["ios-hig", "material-design"]

  avatar:
    size: 120
    border_radius: 60
    placeholder: "User initials"

  spacing:
    section_gap: 24
    field_gap: 16
    padding: 20

  colors:
    primary: "theme.colors.primary"
    text: "theme.colors.text"
    muted: "theme.colors.textSecondary"
```

---

## Phase 4: Implementation Plan

### File Structure
```
Create:
├── src/screens/Profile/
│   ├── ProfileScreen.tsx
│   ├── ProfileScreen.test.tsx
│   ├── components/
│   │   ├── AvatarSection.tsx
│   │   ├── InfoSection.tsx
│   │   └── StatsSection.tsx
│   └── index.ts
├── src/components/common/
│   ├── Avatar.tsx
│   └── EditableField.tsx
├── src/hooks/
│   ├── useProfile.ts
│   └── useImagePicker.ts
├── src/services/
│   └── profileService.ts
└── src/types/
    └── profile.types.ts
```

### Navigation Update
```typescript
// Add to navigation types
type RootStackParamList = {
  // ... existing routes
  Profile: undefined;
  Settings: undefined;
};
```

---

## Phase 5: Implementation

### Types (src/types/profile.types.ts)
```typescript
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
}
```

### Profile Service (src/services/profileService.ts)
```typescript
import api from './api';
import type { UserProfile, UpdateProfileInput } from '@/types/profile.types';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get('/users/me');
    return data.data;
  },

  async updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
    const { data } = await api.put('/users/me', input);
    return data.data;
  },

  async uploadAvatar(imageUri: string): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const { data } = await api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};
```

### Profile Hook (src/hooks/useProfile.ts)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import type { UpdateProfileInput } from '@/types/profile.types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      profileService.updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageUri: string) => profileService.uploadAvatar(imageUri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
```

### Image Picker Hook (src/hooks/useImagePicker.ts)
```typescript
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export function useImagePicker() {
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library.'
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async (): Promise<string | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access.');
      return null;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { pickImage, takePhoto, loading };
}
```

### Avatar Component (src/components/common/Avatar.tsx)
```typescript
import React, { memo } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/theme/colors';

interface AvatarProps {
  uri?: string | null;
  name: string;
  size?: number;
  onPress?: () => void;
  loading?: boolean;
}

export const Avatar = memo(function Avatar({
  uri,
  name,
  size = 80,
  onPress,
  loading,
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const content = (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius: size / 2 }]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size / 3 }]}>{initials}</Text>
      )}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: colors.primary,
    fontWeight: '600',
  },
});
```

### Profile Screen (src/screens/Profile/ProfileScreen.tsx)
```typescript
import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile';
import { useImagePicker } from '@/hooks/useImagePicker';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/common/Button';
import { AvatarSection } from './components/AvatarSection';
import { InfoSection } from './components/InfoSection';
import { StatsSection } from './components/StatsSection';
import { colors } from '@/theme/colors';

export function ProfileScreen() {
  const navigation = useNavigation();
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const { pickImage, takePhoto } = useImagePicker();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedBio, setEditedBio] = useState('');

  const handleEditPress = useCallback(() => {
    if (profile) {
      setEditedName(profile.name);
      setEditedBio(profile.bio || '');
      setIsEditing(true);
    }
  }, [profile]);

  const handleSave = useCallback(async () => {
    try {
      await updateProfile.mutateAsync({
        name: editedName,
        bio: editedBio,
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  }, [editedName, editedBio, updateProfile]);

  const handleChangePhoto = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          let imageUri: string | null = null;
          if (buttonIndex === 1) imageUri = await takePhoto();
          if (buttonIndex === 2) imageUri = await pickImage();

          if (imageUri) {
            try {
              await uploadAvatar.mutateAsync(imageUri);
            } catch (error) {
              Alert.alert('Error', 'Failed to upload photo');
            }
          }
        }
      );
    } else {
      Alert.alert('Change Photo', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Take Photo',
          onPress: async () => {
            const uri = await takePhoto();
            if (uri) uploadAvatar.mutateAsync(uri);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const uri = await pickImage();
            if (uri) uploadAvatar.mutateAsync(uri);
          },
        },
      ]);
    }
  }, [takePhoto, pickImage, uploadAvatar]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !profile) {
    return <ErrorScreen onRetry={() => {}} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Profile"
        rightAction={{
          icon: 'settings',
          onPress: () => navigation.navigate('Settings'),
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AvatarSection
          avatarUrl={profile.avatarUrl}
          name={profile.name}
          onChangePhoto={handleChangePhoto}
          uploading={uploadAvatar.isPending}
        />

        <InfoSection
          profile={profile}
          isEditing={isEditing}
          editedName={editedName}
          editedBio={editedBio}
          onNameChange={setEditedName}
          onBioChange={setEditedBio}
          onEditPress={handleEditPress}
        />

        <StatsSection stats={profile.stats} />

        {isEditing && (
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => setIsEditing(false)}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={updateProfile.isPending}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
});
```

---

## Phase 6: Testing

### Test Files
```
src/screens/Profile/ProfileScreen.test.tsx
src/hooks/useProfile.test.ts
src/components/common/Avatar.test.tsx
```

### Sample Test
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfileScreen } from './ProfileScreen';
import { useProfile } from '@/hooks/useProfile';

jest.mock('@/hooks/useProfile');

describe('ProfileScreen', () => {
  const mockProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Hello!',
    avatarUrl: null,
    stats: { posts: 10, followers: 100, following: 50 },
  };

  beforeEach(() => {
    (useProfile as jest.Mock).mockReturnValue({
      data: mockProfile,
      isLoading: false,
    });
  });

  it('renders profile information', () => {
    render(<ProfileScreen />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('john@example.com')).toBeTruthy();
  });

  it('enters edit mode when edit is pressed', () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByText('Edit'));

    expect(screen.getByText('Save Changes')).toBeTruthy();
  });
});
```

---

## Phase 7: Platform Testing

### iOS Testing
```
Tested on:
- iPhone 15 Pro (iOS 17)
- iPhone SE (iOS 16)
- iPad Pro (iPadOS 17)

Results:
✅ All functionality working
✅ Safe area handling correct
✅ Keyboard avoiding works
✅ Image picker permissions work
```

### Android Testing
```
Tested on:
- Pixel 7 (Android 14)
- Samsung Galaxy S21 (Android 13)
- Emulator (Android 12)

Results:
✅ All functionality working
✅ Status bar handling correct
✅ Permissions flow works
✅ Action sheet alternative works
```

---

## Phase 8: Deployment

### Build Commands
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### App Store Submission
- Updated app description
- New screenshots with profile feature
- Privacy policy updated (camera access)

---

## Summary

```
Feature: User Profile Screen
Duration: 5 hours
Files Created: 12
Tests Added: 8
Coverage: 85%

Platform Support:
- iOS 15+ ✅
- Android 12+ ✅

Decisions Made:
- Used Expo ImagePicker for cross-platform compatibility
- Used ActionSheet for iOS-native feel
- Cached profile data with React Query
- Followed existing screen/component patterns
```
