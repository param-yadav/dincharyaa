
import { useState } from "react";
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

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  tasksAssigned: number;
  tasksCompleted: number;
}

// Sample team members data
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Product Manager",
    tasksAssigned: 8,
    tasksCompleted: 5,
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    tasksAssigned: 12,
    tasksCompleted: 9,
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Designer",
    tasksAssigned: 6,
    tasksCompleted: 6,
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Marketing",
    tasksAssigned: 5,
    tasksCompleted: 3,
    avatar: "https://i.pravatar.cc/150?img=4"
  }
];

const TeamPage = () => {
  const [members] = useState<TeamMember[]>(teamMembers);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const handleInvite = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address to invite a team member",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}`
    });
    
    setEmail('');
    setName('');
    setRole('');
  };

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
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="pending">Pending Invites</TabsTrigger>
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
                    <span className="text-xs text-muted-foreground">Member</span>
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
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Team members who have been invited but haven't joined yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No pending invitations
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamPage;
