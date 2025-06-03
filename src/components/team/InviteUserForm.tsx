
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

interface InviteUserFormProps {
  onInviteSent: () => void;
}

export function InviteUserForm({ onInviteSent }: InviteUserFormProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("member");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to invite team members",
        variant: "destructive"
      });
      return;
    }
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // First try to find user by email using our RPC function
      const { data: invitedUserId, error: lookupError } = await supabase
        .rpc('find_user_id_by_email', { email: email.toLowerCase().trim() });
        
      if (lookupError) {
        console.error("Error checking user:", lookupError);
        toast({
          title: "Error checking user",
          description: "Unable to verify if user exists",
          variant: "destructive"
        });
        return;
      }
      
      if (!invitedUserId) {
        toast({
          title: "User not found",
          description: `No account exists with email: ${email}. Please ask them to sign up first.`,
          variant: "destructive"
        });
        return;
      }
      
      // Check if invitation already exists
      const { data: existingInvitation, error: checkError } = await supabase
        .from('team_invitations')
        .select('id')
        .eq('sender_id', user.id)
        .eq('recipient_id', invitedUserId)
        .eq('status', 'pending')
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing invitation:", checkError);
      }
      
      if (existingInvitation) {
        toast({
          title: "Invitation already sent",
          description: "You have already sent a pending invitation to this user",
          variant: "destructive"
        });
        return;
      }
      
      // Create a team invitation
      const { error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          sender_id: user.id,
          recipient_id: invitedUserId,
          role: role,
          status: 'pending'
        });
        
      if (inviteError) {
        console.error("Error creating invitation:", inviteError);
        toast({
          title: "Failed to send invitation",
          description: "Please try again later",
          variant: "destructive"
        });
        return;
      }
      
      // Create a notification for the invited user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: invitedUserId,
          title: 'Team Invitation',
          message: `${user.email || 'Someone'} has invited you to join their team`,
          type: 'team_invitation',
          read: false,
          related_id: user.id
        });
        
      if (notificationError) {
        console.error("Error creating notification:", notificationError);
      }
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`
      });
      
      setEmail("");
      onInviteSent();
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast({
        title: "Error sending invitation",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dincharya-text/90 rounded-lg border border-dincharya-border/20 p-6">
      <h3 className="text-lg font-semibold text-dincharya-text dark:text-white mb-4">
        Invite Team Member
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-dincharya-text dark:text-gray-200">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white dark:bg-dincharya-muted border-dincharya-border/30 text-dincharya-text dark:text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role" className="text-dincharya-text dark:text-gray-200">
            Role
          </Label>
          <select
            id="role"
            className="w-full rounded-md border border-dincharya-border/30 bg-white dark:bg-dincharya-muted px-3 py-2 text-dincharya-text dark:text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">Team Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-dincharya-primary hover:bg-dincharya-primary/90 text-white" 
          disabled={loading || !email}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending invitation...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Send invitation
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
