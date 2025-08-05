'use client'

import { useState, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserCircleIcon, PencilIcon, XMarkIcon, CameraIcon } from '@heroicons/react/24/outline'
import { useUserStore, UserProfile as UserProfileType, AuthUser } from '@/store/userStore'

export default function UserProfile() {
  const { user, isAuthenticated, profile, signIn, signOut, updateProfile } = useUserStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editData, setEditData] = useState<Partial<UserProfileType>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSignIn = () => {
    // Simulate Google sign-in (in real app, use Google OAuth)
    const mockUser: AuthUser = {
      id: 'user_' + Date.now(),
      email: 'user@example.com',
      name: 'User Name',
      provider: 'google',
      avatar: `https://ui-avatars.com/api/?name=User+Name&background=d4a574&color=fff&size=200&format=png`
    }
    signIn(mockUser)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const avatar = e.target?.result as string
      if (isEditMode) {
        setEditData(prev => ({ ...prev, avatar }))
      } else {
        updateProfile({ avatar })
      }
    }
    reader.readAsDataURL(file)
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleUpdateProfile = () => {
    updateProfile(editData)
    setIsEditMode(false)
    setEditData({})
  }

  const startEdit = () => {
    setEditData(profile || {})
    setIsEditMode(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSignIn}
          className="flex items-center space-x-2 px-4 py-2 bg-heritage-gold text-white rounded-lg hover:bg-heritage-gold/90 transition-colors"
        >
          <UserCircleIcon className="h-5 w-5" />
          <span>Sign In</span>
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center space-x-2 p-2 hover:bg-heritage-gold/10 rounded-lg transition-colors"
        >
          {profile?.avatar || user?.avatar ? (
            <img 
              src={profile?.avatar || user?.avatar} 
              alt={profile?.name || user?.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="h-8 w-8 text-heritage-gold" />
          )}
          <span className="text-sm font-medium text-heritage-dark">{profile?.name || user?.name}</span>
        </button>
      </div>

      <Transition appear show={isProfileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsProfileOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-heritage-dark">
                      {isEditMode ? 'Edit Profile' : 'Your Profile'}
                    </Dialog.Title>
                    <div className="flex items-center space-x-2">
                      {!isEditMode && (
                        <button
                          onClick={startEdit}
                          className="p-2 hover:bg-heritage-gold/10 rounded-lg transition-colors"
                          title="Edit profile"
                        >
                          <PencilIcon className="h-5 w-5 text-heritage-gold" />
                        </button>
                      )}
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {isEditMode ? (
                    <div className="space-y-4">
                      {/* Avatar Upload Section */}
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="relative group">
                          {editData.avatar || profile?.avatar ? (
                            <img 
                              src={editData.avatar || profile?.avatar} 
                              alt="Profile"
                              className="h-20 w-20 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="h-20 w-20 text-heritage-gold" />
                          )}
                          <button
                            type="button"
                            onClick={triggerImageUpload}
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <CameraIcon className="h-6 w-6 text-white" />
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={triggerImageUpload}
                            className="px-4 py-2 text-sm bg-heritage-gold text-white rounded-lg hover:bg-heritage-gold/90 transition-colors"
                          >
                            Upload Photo
                          </button>
                          <p className="text-xs text-heritage-dark/60 mt-1">Max 2MB, JPG/PNG</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-heritage-dark mb-1">Name</label>
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-heritage-dark mb-1">Age</label>
                          <input
                            type="number"
                            value={editData.age || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-heritage-dark mb-1">Location</label>
                          <input
                            type="text"
                            value={editData.location || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
                            placeholder="e.g., San Francisco, CA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-heritage-dark mb-1">Occupation</label>
                          <input
                            type="text"
                            value={editData.occupation || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, occupation: e.target.value }))}
                            className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
                            placeholder="e.g., Software Engineer"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-heritage-dark mb-1">Personal Background</label>
                        <textarea
                          value={editData.personalBackground || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, personalBackground: e.target.value }))}
                          className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
                          rows={3}
                          placeholder="Tell us about yourself, your interests, hobbies, life experiences..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-heritage-dark mb-1">Family Background</label>
                        <textarea
                          value={editData.familyBackground || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, familyBackground: e.target.value }))}
                          className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
                          rows={3}
                          placeholder="Share about your family, siblings, children, family traditions..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-heritage-dark mb-1">Cultural Background</label>
                        <textarea
                          value={editData.culturalBackground || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, culturalBackground: e.target.value }))}
                          className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
                          rows={3}
                          placeholder="Your cultural heritage, traditions you follow, cultural practices..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-heritage-dark mb-1">Languages</label>
                        <input
                          type="text"
                          value={editData.languages?.join(', ') || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, languages: e.target.value.split(',').map(l => l.trim()).filter(l => l) }))}
                          className="w-full p-3 border border-heritage-gold/30 rounded-lg focus:ring-2 focus:ring-heritage-gold focus:border-transparent"
                          placeholder="e.g., English, Mandarin, Cantonese"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={() => {
                            setIsEditMode(false)
                            setEditData({})
                          }}
                          className="px-4 py-2 text-heritage-dark border border-heritage-gold/30 rounded-lg hover:bg-heritage-gold/10 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          className="px-4 py-2 bg-heritage-gold text-white rounded-lg hover:bg-heritage-gold/90 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          {profile?.avatar ? (
                            <img 
                              src={profile.avatar} 
                              alt={profile.name}
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="h-16 w-16 text-heritage-gold" />
                          )}
                          <button
                            onClick={triggerImageUpload}
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <CameraIcon className="h-6 w-6 text-white" />
                          </button>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-heritage-dark">{profile?.name}</h4>
                          <p className="text-heritage-dark/60">{profile?.email}</p>
                          {profile?.age && <p className="text-sm text-heritage-dark/60">Age: {profile.age}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile?.location && (
                          <div>
                            <h5 className="font-medium text-heritage-dark mb-1">Location</h5>
                            <p className="text-heritage-dark/70">{profile.location}</p>
                          </div>
                        )}
                        {profile?.occupation && (
                          <div>
                            <h5 className="font-medium text-heritage-dark mb-1">Occupation</h5>
                            <p className="text-heritage-dark/70">{profile.occupation}</p>
                          </div>
                        )}
                      </div>

                      {profile?.personalBackground && (
                        <div>
                          <h5 className="font-medium text-heritage-dark mb-2">Personal Background</h5>
                          <p className="text-heritage-dark/70 leading-relaxed">{profile.personalBackground}</p>
                        </div>
                      )}

                      {profile?.familyBackground && (
                        <div>
                          <h5 className="font-medium text-heritage-dark mb-2">Family Background</h5>
                          <p className="text-heritage-dark/70 leading-relaxed">{profile.familyBackground}</p>
                        </div>
                      )}

                      {profile?.culturalBackground && (
                        <div>
                          <h5 className="font-medium text-heritage-dark mb-2">Cultural Background</h5>
                          <p className="text-heritage-dark/70 leading-relaxed">{profile.culturalBackground}</p>
                        </div>
                      )}

                      {profile?.languages && profile.languages.length > 0 && (
                        <div>
                          <h5 className="font-medium text-heritage-dark mb-2">Languages</h5>
                          <div className="flex flex-wrap gap-2">
                            {profile.languages.map((lang) => (
                              <span key={lang} className="px-3 py-1 bg-heritage-gold/10 text-heritage-dark rounded-full text-sm">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-heritage-gold/20">
                        <button
                          onClick={signOut}
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}