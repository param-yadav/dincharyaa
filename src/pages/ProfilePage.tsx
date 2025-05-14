
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, User } from "lucide-react";

// Define Profile interface to match with the profiles table
interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      
      // Fetch user profile information
      const fetchProfile = async () => {
        try {
          setLoading(true);
          
          // Fetch user metadata
          const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
          
          if (userError) throw userError;
          
          if (userData?.user_metadata) {
            const metadata = userData.user_metadata;
            setName(metadata.full_name || "");
          }
          
          // Fetch profile data from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }
          
          if (profileData) {
            const profile = profileData as Profile;
            setName(profile.full_name || "");
            setBio(profile.bio || "");
            setPhone(profile.phone || "");
            setLocation(profile.location || "");
            
            if (profile.avatar_url) {
              const { data: { publicUrl } } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(profile.avatar_url);
                
              setAvatarUrl(publicUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Failed to load profile",
            description: "There was an error loading your profile information",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchProfile();
    }
  }, [user, toast]);

  const handleProfileSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          full_name: name,
          updated_at: new Date().toISOString(),
        }
      });
      
      if (updateError) throw updateError;
      
      // Update or insert into profiles table
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name,
          bio,
          phone,
          location,
          updated_at: new Date().toISOString(),
        } as Profile);
        
      if (upsertError) throw upsertError;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Failed to update profile",
        description: "There was an error saving your profile information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) {
      return;
    }
    
    try {
      setUploadLoading(true);
      
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setAvatarUrl(publicUrl);
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: filePath,
          updated_at: new Date().toISOString(),
        } as Profile);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Avatar updated",
        description: "Your profile image has been updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Failed to upload image",
        description: "There was an error uploading your profile image",
        variant: "destructive"
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const getInitials = () => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <Card className="md:col-span-1 bg-white dark:bg-dincharya-text/80 rounded-lg overflow-hidden shadow">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-6">
              <Avatar className="h-40 w-40">
                <AvatarImage src={avatarUrl || ""} />
                <AvatarFallback className="bg-amber-200 text-amber-800 text-3xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {uploadLoading && (
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
            </div>
            
            <Label 
              htmlFor="avatar-upload" 
              className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md flex items-center justify-center w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadLoading ? "Uploading..." : "Upload New Picture"}
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploadLoading}
            />
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </p>
          </CardContent>
        </Card>
        
        {/* Personal Information Section */}
        <Card className="md:col-span-2 bg-white dark:bg-dincharya-text/80 rounded-lg overflow-hidden shadow">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your full name" 
                    className="border-amber-200"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    value={email} 
                    placeholder="Your email"
                    className="border-amber-200"
                    disabled={true} // Email can't be changed through this form
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="font-medium">Bio</Label>
                <textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell us a bit about yourself" 
                  className="w-full p-2 border border-amber-200 rounded-md bg-white min-h-[100px]"
                  disabled={loading}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-medium">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Enter your phone number" 
                    className="border-amber-200"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="font-medium">Location</Label>
                  <Input 
                    id="location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="City, Country" 
                    className="border-amber-200"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleProfileSave}
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
