
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Mail, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  tasksAssigned: number;
  tasksCompleted: number;
}

interface PendingInvite {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at: string;
}

const TeamPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch team members
  useEffect(() => {
    if (!user) return;
    
    // For now, use localStorage to store team members and invites
    // In a real app, you would fetch from Supabase
    const savedMembers = localStorage.getItem(`team_members_${user.id}`);
    const savedInvites = localStorage.getItem(`team_invites_${user.id}`);
    
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    } else {
      // Default demo team member (just the current user)
      const currentUser: TeamMember = {
        id: user.id,
        name: user.email?.split('@')[0] || 'Current User',
        email: user.email || '',
        role: 'Owner',
        tasksAssigned: 0,
        tasksCompleted: 0
      };
      
      setMembers([currentUser]);
      localStorage.setItem(`team_members_${user.id}`, JSON.stringify([currentUser]));
    }
    
    if (savedInvites) {
      setPendingInvites(JSON.parse(savedInvites));
    }
    
    setLoading(false);
  }, [user]);

  // Save changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`team_members_${user.id}`, JSON.stringify(members));
      localStorage.setItem(`team_invites_${user.id}`, JSON.stringify(pendingInvites));
    }
  }, [members, pendingInvites, user]);

  const handleInvite = async () => {
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
        description: "Please enter an email address to invite a team member",
        variant: "destructive"
      });
      return;
    }
    
    // Check if email is already a team member
    if (members.some(member => member.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Already a member",
        description: "This person is already part of your team",
        variant: "destructive"
      });
      return;
    }
    
    // Check if already invited
    if (pendingInvites.some(invite => invite.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Already invited",
        description: "This person has already been invited",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user exists (in a real app, this would query the database)
    // For demo purposes, we'll simulate with a check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      try {
        // First, find the user ID by email
        const { data: recipientId, error: lookupError } = await supabase
          .rpc("find_user_id_by_email", { email });

        if (lookupError) {
          console.error("Error finding user:", lookupError);
          toast({
            title: "User not found",
            description: "Could not find a user with that email address",
            variant: "destructive"
          });
          return;
        }

        // Now create the team invitation with the found recipient_id
        const { data, error } = await supabase
          .from("team_invitations")
          .insert({
            sender_id: user.id,
            recipient_id: recipientId,
            role: role || "member",
            status: "pending"
          });

        if (error) throw error;

        toast({ title: "Invitation sent", description: `An invite has been sent to ${email}` });
        setEmail("");
        setName("");
        setRole("");
        
        // Add to pending invites in the UI
        const newInvite: PendingInvite = {
          id: Date.now().toString(),
          email: email,
          role: role,
          created_at: new Date().toISOString()
        };
        
        setPendingInvites([...pendingInvites, newInvite]);
      } catch (error) {
        console.error("Error inviting:", error);
        toast({ 
          title: "Failed to send", 
          description: "Try again later.", 
          variant: "destructive" 
        });
      }
      
      // Create notification
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      let notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      
      notifications.unshift({
        id: Date.now().toString(),
        title: "Team Invitation Sent",
        message: `You've invited ${email} to join your team`,
        created_at: new Date().toISOString(),
        read: false,
        type: "team"
      });
      
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`
      });
      
      setEmail('');
      setName('');
      setRole('');
    } catch (error) {
      console.error('Error inviting team member:', error);
      toast({
        title: "Failed to send invitation",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const cancelInvitation = (inviteId: string) => {
    setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId));
    toast({
      title: "Invitation cancelled",
      description: "The invitation has been cancelled"
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-6">Please sign in to manage your team</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">Team Management</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Manage your team members and their access
        </p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Invite a new member to join your team
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@example.com"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Developer"
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" onClick={handleInvite} className="gap-2">
                <Mail className="h-4 w-4" /> Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Invites ({pendingInvites.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card key={member.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription className="text-xs">{member.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">{member.role}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {member.id === user.id ? "You" : "Member"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-4">
                    <div>
                      <div className="font-medium">{member.tasksAssigned}</div>
                      <div className="text-muted-foreground text-xs">Assigned</div>
                    </div>
                    <div>
                      <div className="font-medium">{member.tasksCompleted}</div>
                      <div className="text-muted-foreground text-xs">Completed</div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {member.tasksAssigned ? Math.round((member.tasksCompleted / member.tasksAssigned) * 100) : 0}%
                      </div>
                      <div className="text-muted-foreground text-xs">Completion</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <Button variant="outline" className="w-full">View Tasks</Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="flex flex-col items-center justify-center h-full bg-muted/20">
              <CardContent className="py-8 flex flex-col items-center text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Add Team Member</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Invite colleagues to collaborate
                </p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Invite Member</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Invite a new member to join your team
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="popup-email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="popup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="member@example.com"
                          className="col-span-3"
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="popup-name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="popup-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="col-span-3"
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="popup-role" className="text-right">
                          Role
                        </Label>
                        <Input
                          id="popup-role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Developer"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" onClick={handleInvite}>
                        Send Invitation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {pendingInvites.length > 0 ? (
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <Card key={invite.id} className="bg-amber-50 dark:bg-amber-900/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="rounded-full p-2 bg-amber-100">
                          <Mail className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-base font-medium">{invite.email}</h4>
                          {invite.name && <p className="text-sm text-muted-foreground">{invite.name}</p>}
                          {invite.role && (
                            <Badge variant="outline" className="mt-1">
                              {invite.role}
                            </Badge>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Invited {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300 hover:bg-amber-100 text-amber-700"
                        onClick={() => cancelInvitation(invite.id)}
                      >
                        Cancel Invitation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-muted-foreground">
                  <div className="rounded-full bg-amber-100 p-6 mb-4 mx-auto w-fit">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No pending invitations</h3>
                  <p className="text-muted-foreground mb-4">
                    Invite team members to get started
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Invite Someone</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                          Invite a new member to join your team
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="pending-email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="pending-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="member@example.com"
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="pending-name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="pending-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="pending-role" className="text-right">
                            Role
                          </Label>
                          <Input
                            id="pending-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Developer"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button type="button" onClick={handleInvite}>
                          Send Invitation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamPage;
