
import React from "react";
import ProfileEditor from "@/components/profile/ProfileEditor";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        
        <ProfileEditor />
      </div>
    </div>
  );
};

export default ProfilePage;
