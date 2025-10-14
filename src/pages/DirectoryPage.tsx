// src/pages/DirectoryPage.tsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { MemberProfile } from '../types';
import SectionHeading from '../components/SectionHeading';
import { Search, Mail, Phone, Shield, User, Calendar, EyeOff } from 'lucide-react'; // Add EyeOff here

const DirectoryPage: React.FC = () => {
  const { user, needsPasswordReset } = useAuth();
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await api.optimizedApi.getAllMembers();
        // Filter to only show active members
        const activeMembers = data.filter(member => member.status === 'active');
        setMembers(activeMembers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [api]); // Added api to dependency array as it's an external dependency

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to password reset if needed
  if (needsPasswordReset) {
    return <Navigate to="/password-reset" replace />;
  }

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.position && member.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="Member Directory"
          subtitle="Connect with your fellow Lodge members"
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Privacy Notice</p>
                <p>
                  Contact information is only shown for members who have opted to share it. 
                  You can control your own privacy settings in your profile.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-secondary-200 border-t-secondary-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading member directory...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMembers.map(member => (
                <div key={member.id} className="bg-white rounded-lg p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-primary-600 text-lg">
                          {member.full_name}
                        </h3>
                        {member.position && (
                          <p className="text-neutral-600 mt-1 flex items-center">
                            <Shield className="w-4 h-4 mr-1 text-secondary-500" />
                            {member.position}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Role Badge */}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      member.role === 'admin' 
                        ? 'bg-secondary-100 text-secondary-700' 
                        : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {member.role === 'admin' ? 'Administrator' : 'Member'}
                    </span>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-secondary-500" />
                    <span>Member since {new Date(member.join_date).getFullYear()}</span>
                  </div>

                  {/* Contact Information - Only show if member has opted in */}
                  {member.share_contact_info ? (
                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                      <h4 className="text-sm font-medium text-primary-600 mb-2">Contact Information</h4>
                      
                      {member.contact_email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-secondary-500 flex-shrink-0" />
                          <a 
                            href={`mailto:${member.contact_email}`}
                            className="text-secondary-600 hover:text-secondary-700 transition-colors truncate"
                          >
                            {member.contact_email}
                          </a>
                        </div>
                      )}
                      
                      {member.contact_phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-secondary-500 flex-shrink-0" />
                          <a 
                            href={`tel:${member.contact_phone.replace(/\s+/g, '')}`}
                            className="text-secondary-600 hover:text-secondary-700 transition-colors"
                          >
                            {member.contact_phone}
                          </a>
                        </div>
                      )}
                      
                      {!member.contact_email && !member.contact_phone && (
                        <p className="text-xs text-neutral-500 italic">
                          No additional contact information provided
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-neutral-100">
                      <div className="flex items-center text-xs text-neutral-500">
                        <EyeOff className="w-4 h-4 mr-2" /> {/* This is the line causing the error */}
                        <span>Contact information not shared</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {!loading && filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">No Members Found</h3>
              <p className="text-neutral-500">
                {searchTerm 
                  ? `No members match your search "${searchTerm}".`
                  : 'No active members found in the directory.'
                }
              </p>
            </div>
          )}

          {/* Directory Stats */}
          {!loading && filteredMembers.length > 0 && (
            <div className="mt-8 bg-neutral-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">{filteredMembers.length}</div>
                  <div className="text-sm text-neutral-600">Active Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary-600">
                    {filteredMembers.filter(m => m.share_contact_info).length}
                  </div>
                  <div className="text-sm text-neutral-600">Sharing Contact Info</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-600">
                    {filteredMembers.filter(m => m.role === 'admin').length}
                  </div>
                  <div className="text-sm text-neutral-600">Administrators</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectoryPage;
