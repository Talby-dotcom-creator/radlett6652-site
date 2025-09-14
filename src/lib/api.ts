import { supabase } from './supabase';
import { MemberProfile, LodgeDocument, MeetingMinutes } from '../types';

// Helper function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 15000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Add connection health check
const checkConnection = async (): Promise<boolean> => {
  try {
    // Simple ping test with very short timeout
    const { error } = await Promise.race([
      supabase.from('member_profiles').select('count', { count: 'exact', head: true }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 3000))
    ]);
    
    if (error) {
      console.warn('Connection check failed:', error.message);
      return false;
    }
    return true;
  } catch {
    console.warn('Connection check failed with exception');
    return false;
  }
};

export const api = {
  // Member Profiles
  getMemberProfile: async (userId: string): Promise<MemberProfile | null> => {
    try {
      // Quick connection check first
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('Database connection unavailable');
      }
      
      console.log('🔍 API: Fetching member profile for:', userId);
      const startTime = Date.now();
      
      const query = supabase
        .from('member_profiles')
        .select('*')
        .eq('user_id', userId)
        .limit(1);
      
      const { data, error } = await withTimeout(query, 10000); // Much shorter timeout
      
      const queryTime = Date.now() - startTime;
      console.log(`👤 API: Profile query completed in ${queryTime}ms`);
      
      if (error) {
        console.error('Error fetching member profile:', error);
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }
      
      const profile = data && data.length > 0 ? data[0] as MemberProfile : null;
      console.log('👤 API: Profile result:', profile ? { role: profile.role, status: profile.status } : null);
      return profile;
    } catch (error) {
      console.error('API Error - getMemberProfile:', error);
      throw error;
    }
  },

  createMemberProfile: async (userId: string, fullName: string): Promise<MemberProfile> => {
    try {
      const query = supabase
        .from('member_profiles')
        .insert({
          user_id: userId,
          full_name: fullName.trim(),
          role: 'member',
          status: 'pending',
          registration_date: new Date().toISOString(),
          email_verified: false
        })
        .select()
        .single();
      
      const { data, error } = await withTimeout(query, 60000);
      
      if (error) {
        console.error('Error creating member profile:', error);
        throw new Error(`Failed to create profile: ${error.message}`);
      }
      
      return data as MemberProfile;
    } catch (error) {
      console.error('API Error - createMemberProfile:', error);
      throw error;
    }
  },

  adminCreateMemberProfile: async (profile: {
    user_id: string;
    full_name: string;
    position?: string;
    role: 'member' | 'admin';
  }): Promise<MemberProfile> => {
    try {
      const query = supabase
        .from('member_profiles')
        .insert(profile)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query, 60000);
      
      if (error) {
        console.error('Error creating member profile (admin):', error);
        throw new Error(`Failed to create profile: ${error.message}`);
      }
      
      return data as MemberProfile;
    } catch (error) {
      console.error('API Error - adminCreateMemberProfile:', error);
      throw error;
    }
  },

  getAllMembers: async (): Promise<MemberProfile[]> => {
    try {
      const query = supabase
        .from('member_profiles')
        .select('*')
        .order('full_name', { ascending: true });
      
      const { data, error } = await withTimeout(query, 90000);
      
      if (error) {
        console.error('Error fetching all members:', error);
        throw new Error(`Failed to fetch members: ${error.message}`);
      }
      
      return data as MemberProfile[];
    } catch (error) {
      console.error('API Error - getAllMembers:', error);
      throw error;
    }
  },

  updateMemberProfile: async (userId: string, profile: Partial<MemberProfile>): Promise<MemberProfile> => {
    try {
      const query = supabase
        .from('member_profiles')
        .update(profile)
        .eq('user_id', userId)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query, 60000);
      
      if (error) {
        console.error('Error updating member profile:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }
      
      return data as MemberProfile;
    } catch (error) {
      console.error('API Error - updateMemberProfile:', error);
      throw error;
    }
  },

  deleteMemberProfile: async (userId: string): Promise<void> => {
    try {
      const query = supabase
        .from('member_profiles')
        .delete()
        .eq('user_id', userId);
      
      const { data, error } = await withTimeout(query, 60000);
      
      if (error) {
        console.error('Error deleting member profile:', error);
        throw new Error(`Failed to delete profile: ${error.message}`);
      }
    } catch (error) {
      console.error('API Error - deleteMemberProfile:', error);
      throw error;
    }
  },

  // Secure user deletion via Edge Function
  deleteUserAndProfile: async (userId: string): Promise<any> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - deleteUserAndProfile:', error);
      throw error;
    }
  },

  // Lodge Documents
  getLodgeDocuments: async (category?: string): Promise<LodgeDocument[]> => {
    try {
      // Create the query
      let query = supabase
        .from('lodge_documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Add category filter if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // Execute the query with timeout
      const { data, error } = await withTimeout(query, 60000);
      
      if (error) {
        console.error('Error fetching lodge documents:', error);
        throw new Error(`Failed to fetch documents: ${error.message}`);
      }
      
      return data as LodgeDocument[];
    } catch (error) {
      console.error('API Error - getLodgeDocuments:', error);
      throw error;
    }
  },

  createDocument: async (document: Omit<LodgeDocument, 'id' | 'created_at' | 'updated_at'>): Promise<LodgeDocument> => {
    try {
      const query = supabase
        .from('lodge_documents')
        .insert(document)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query, 60000);
      
      if (error) {
        console.error('Error creating document:', error);
        throw new Error(`Failed to create document: ${error.message}`);
      }
      
      return data as LodgeDocument;
    } catch (error) {
      console.error('API Error - createDocument:', error);
      throw error;
    }
  },

  // Meeting Minutes
  getMeetingMinutes: async (): Promise<MeetingMinutes[]> => {
    try {
      const query = supabase
        .from('meeting_minutes')
        .select('*')
        .order('meeting_date', { ascending: false });
      
      const { data, error } = await withTimeout(query, 60000);
      
      if (error) {
        console.error('Error fetching meeting minutes:', error);
        throw new Error(`Failed to fetch meeting minutes: ${error.message}`);
      }
      
      return data as MeetingMinutes[];
    } catch (error) {
      console.error('API Error - getMeetingMinutes:', error);
      throw error;
    }
  },

  createMinutes: async (minutes: Omit<MeetingMinutes, 'id' | 'created_at' | 'updated_at'>): Promise<MeetingMinutes> => {
    try {
      const query = supabase
        .from('meeting_minutes')
        .insert(minutes)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query, 60000);
      
      if (error) {
        console.error('Error creating meeting minutes:', error);
        throw new Error(`Failed to create meeting minutes: ${error.message}`);
      }
      
      return data as MeetingMinutes;
    } catch (error) {
      console.error('API Error - createMinutes:', error);
      throw error;
    }
  }
};