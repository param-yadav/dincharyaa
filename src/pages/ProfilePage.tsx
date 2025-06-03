
import React from "react";
import ProfileEditor from "@/components/profile/ProfileEditor";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information</p>
        </div>
        
        <ProfileEditor />
      </div>
    </div>
  );
};

export default ProfilePage;
