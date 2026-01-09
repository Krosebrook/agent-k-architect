
import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { blink } from '../lib/blink';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Kyle S. Architect',
  role: 'Level 10 Master Architect',
  preferences: {
    theme: 'dark',
    autoGrounding: true,
    terminalStyle: 'modern'
  }
};

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const result = await blink.db.profiles.list({
          where: { user_id: user.id }
        });

        if (result.length > 0) {
          const data = result[0];
          let preferences = DEFAULT_PROFILE.preferences;
          try {
            if (data.preferences) {
              preferences = JSON.parse(data.preferences);
            }
          } catch (e) {
            console.error('Invalid preferences format in DB, falling back to defaults');
          }

          setProfile({
            name: data.name || DEFAULT_PROFILE.name,
            role: data.role || DEFAULT_PROFILE.role,
            preferences
          });
        } else {
          // Create initial profile
          const initialProfile = {
            id: crypto.randomUUID(),
            user_id: user.id,
            name: user.displayName || DEFAULT_PROFILE.name,
            role: DEFAULT_PROFILE.role,
            preferences: JSON.stringify(DEFAULT_PROFILE.preferences)
          };
          
          await blink.db.profiles.create(initialProfile);
          
          setProfile({
            name: initialProfile.name,
            role: initialProfile.role,
            preferences: DEFAULT_PROFILE.preferences
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Identity sync failure. Using local cache.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const current = { ...profile, ...newProfile };
      setProfile(current);

      await blink.db.profiles.upsert({
        user_id: user.id,
        name: current.name,
        role: current.role,
        preferences: JSON.stringify(current.preferences)
      }, { onConflict: ['user_id'] });
      
      toast.success('Profile updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const updatePreferences = (prefs: Partial<UserProfile['preferences']>) => {
    updateProfile({ preferences: { ...profile.preferences, ...prefs } });
  };

  return { profile, setProfile: updateProfile, updatePreferences, loading };
};
