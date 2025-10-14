import React from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { MemberProfile } from '../types';
import { User, Award, Save, Mail, Phone, Shield, Crown, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileFormProps {
  profile: MemberProfile;
  onSubmit: (data: Partial<MemberProfile>) => Promise<void>;
  isUpdating?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, isUpdating = false }) => {
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      full_name: profile.full_name,
      position: profile.position || '',
      contact_email: profile.contact_email || '',
      contact_phone: profile.contact_phone || '',
      share_contact_info: profile.share_contact_info || false,
    }
  });

  const handleFormSubmit = async (data: any) => {
    // Only submit if there are changes
    if (!isDirty) return;
    
    await onSubmit({
      full_name: data.full_name.trim(),
      position: data.position.trim() || undefined,
      contact_email: data.contact_email.trim() || undefined,
      contact_phone: data.contact_phone.trim() || undefined,
      share_contact_info: data.share_contact_info,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Personal Information Section */}
      <div>
        <h4 className="text-lg font-heading font-semibold text-primary-600 mb-4 flex items-center">
          <User size={20} className="mr-2" />
          Personal Information
        </h4>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-primary-600 mb-2">
              Full Name *
            </label>
            <input
              id="full_name"
              {...register('full_name', { 
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Full name must be at least 2 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Full name must be less than 100 characters'
                }
              })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
              placeholder="Enter your full name"
              disabled={isUpdating}
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              This is how your name will appear to other Lodge members
            </p>
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-primary-600 mb-2">
              Current Lodge Position
            </label>
            <input
              id="position"
              {...register('position', {
                maxLength: {
                  value: 50,
                  message: 'Position must be less than 50 characters'
                }
              })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
              placeholder="e.g., Worshipful Master, Senior Warden, Secretary"
              disabled={isUpdating}
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              Your current Masonic rank or office within the Lodge (optional)
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div>
        <h4 className="text-lg font-heading font-semibold text-primary-600 mb-4 flex items-center">
          <Mail size={20} className="mr-2" />
          Contact Information
        </h4>
        
        <div className="space-y-6">
          {/* Primary Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              Primary Email (Login)
            </label>
            <div className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-md text-neutral-700">
              {user?.email || 'Not available'}
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              This is your login email and cannot be changed here
            </p>
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-primary-600 mb-2">
              Contact Email
            </label>
            <input
              id="contact_email"
              type="email"
              {...register('contact_email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
              placeholder="alternative@email.com"
              disabled={isUpdating}
            />
            {errors.contact_email && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              Alternative email for Lodge communications (optional)
            </p>
          </div>

          {/* Contact Phone */}
          <div>
            <label htmlFor="contact_phone" className="flex items-center text-sm font-medium text-primary-600 mb-2">
              <Phone size={16} className="mr-2" />
              Contact Phone
            </label>
            <input
              id="contact_phone"
              type="tel"
              {...register('contact_phone', {
                pattern: {
                  value: /^[\+]?[0-9\s\-\(\)]{10,}$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-colors"
              placeholder="+44 123 456 7890"
              disabled={isUpdating}
            />
            {errors.contact_phone && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_phone.message}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              Phone number for Lodge communications (optional)
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Settings Section */}
      <div>
        <h4 className="text-lg font-heading font-semibold text-primary-600 mb-4 flex items-center">
          <Shield size={20} className="mr-2" />
          Privacy Settings
        </h4>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center mb-3">
                <input
                  id="share_contact_info"
                  type="checkbox"
                  {...register('share_contact_info')}
                  className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded mr-3"
                  disabled={isUpdating}
                />
                <label htmlFor="share_contact_info" className="text-sm font-medium text-blue-800">
                  Share my contact information in the Member Directory
                </label>
              </div>
              <div className="text-sm text-blue-700 space-y-2">
                <p>
                  <strong>When checked:</strong> Your contact email and phone number will be visible to other Lodge members in the Member Directory.
                </p>
                <p>
                  <strong>When unchecked:</strong> Only your name and Lodge position will be shown in the directory for your privacy and safety.
                </p>
                <p className="text-xs text-blue-600 mt-3">
                  <strong>Note:</strong> Your login email and this privacy setting are always kept secure and never shared publicly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <div className="text-sm text-neutral-500">
          {isDirty ? 'You have unsaved changes' : 'No changes to save'}
        </div>
        
        <Button 
          type="submit" 
          disabled={isUpdating || !isDirty}
          className="flex items-center min-w-[140px] justify-center"
        >
          {isUpdating ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

    </form>
  );
};

export default ProfileForm;
