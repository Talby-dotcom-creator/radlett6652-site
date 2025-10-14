import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Event } from '../../types';
import Button from '../Button';
import MediaManager from './MediaManager';
import { Image, X } from 'lucide-react';

interface EventFormProps {
  onSubmit: (data: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Event>;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(initialData?.image_url || '');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      image_url: initialData?.image_url || '',
      event_date: initialData?.event_date ? new Date(initialData.event_date).toISOString().slice(0, 16) : '',
      location: initialData?.location || '',
      is_members_only: initialData?.is_members_only || false,
      is_past_event: initialData?.is_past_event || false
    }
  });

  const handleMediaSelect = (url: string) => {
    setSelectedImageUrl(url);
    setValue('image_url', url, { shouldDirty: true });
    setShowMediaManager(false);
  };

  const handleClearImage = () => {
    setSelectedImageUrl('');
    setValue('image_url', '', { shouldDirty: true });
  };

  const onFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      image_url: selectedImageUrl || data.image_url,
      event_date: new Date(data.event_date).toISOString()
    });
  };

  return (
    <>
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-primary-600">
          Event Title
        </label>
        <input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-secondary-500 focus:ring-secondary-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-primary-600">
          Description
        </label>
        <textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-secondary-500 focus:ring-secondary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
        )}
      </div>

      <div>
        <label htmlFor="event_date" className="block text-sm font-medium text-primary-600">
          Event Date & Time
        </label>
        <input
          id="event_date"
          type="datetime-local"
          {...register('event_date', { required: 'Event date is required' })}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-secondary-500 focus:ring-secondary-500"
        />
        {errors.event_date && (
          <p className="mt-1 text-sm text-red-600">{errors.event_date.message as string}</p>
        )}
      </div>

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-primary-600">
          Event Image
        </label>
        <div className="mt-1 space-y-3">
          {/* Image URL Input with Media Manager Button */}
          <div className="flex space-x-2">
            <input
              id="image_url"
              type="url"
              {...register('image_url')}
              value={selectedImageUrl}
              onChange={(e) => {
                setSelectedImageUrl(e.target.value);
                setValue('image_url', e.target.value, { shouldDirty: true });
              }}
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 focus:border-secondary-500 focus:ring-secondary-500"
              placeholder="https://example.com/event-image.jpg or use Media Manager"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMediaManager(true)}
              className="flex items-center px-3"
            >
              <Image size={16} className="mr-1" />
              Browse
            </Button>
            {selectedImageUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearImage}
                className="flex items-center px-3 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <X size={16} />
              </Button>
            )}
          </div>

          {/* Image Preview */}
          {selectedImageUrl && (
            <div className="mt-3">
              <p className="text-sm font-medium text-neutral-700 mb-2">Preview:</p>
              <div className="relative inline-block">
                <img
                  src={selectedImageUrl}
                  alt="Event preview"
                  className="w-48 h-32 object-cover rounded-lg border border-neutral-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-neutral-500">
            You can paste an image URL directly or use the Media Manager to upload/select images.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-primary-600">
          Location
        </label>
        <input
          id="location"
          {...register('location', { required: 'Location is required' })}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-secondary-500 focus:ring-secondary-500"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message as string}</p>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <input
            id="is_members_only"
            type="checkbox"
            {...register('is_members_only')}
            className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
          />
          <label htmlFor="is_members_only" className="ml-2 block text-sm text-neutral-700">
            Members Only Event
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="is_past_event"
            type="checkbox"
            {...register('is_past_event')}
            className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
          />
          <label htmlFor="is_past_event" className="ml-2 block text-sm text-neutral-700">
            Past Event
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </Button>
      </div>
    </form>

      {/* Media Manager Modal */}
      <MediaManager
        isOpen={showMediaManager}
        onClose={() => setShowMediaManager(false)}
        onSelectMedia={handleMediaSelect}
      />
    </>
  );
};

export default EventForm;
