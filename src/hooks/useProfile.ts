import { useState, useEffect } from 'react';

export interface ProfileAPI {
  fullName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
  tagline: string;
  aboutDescription: string;
  aboutStats: { label: string; value: string; icon: string }[];
  softSkills: { name: string; level: number }[];
  languages: { name: string; level: string; flag: string }[];
  contact: { phone: string; email: string; location: string; github: string; linkedin: string };
  cvUrl?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileAPI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/profile?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data.data);
        }
      })
      .catch(err => {
        console.error('Fetch profile failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { profile, loading };
};
