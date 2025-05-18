
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, CheckSquare, Clock, ListTodo, Users, Mail, FileText } from "lucide-react";

const HelpPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-dincharya-text dark:text-white mb-6">Help Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions about using Dincharya</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create a new task?</AccordionTrigger>
                <AccordionContent>
                  You can create a new task by clicking the "Add Task" button on the Tasks page or by using the quick add button in the header. Fill in the task details like title, description, due date, and priority, then click "Save" to create your task.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I assign a task to someone else?</AccordionTrigger>
                <AccordionContent>
                  When creating or editing a task, scroll down to the "Assign Task" section. Enter the email address of the person you want to assign the task to, add an optional message, and save the task. The assignee will receive a notification and can accept or reject the assignment.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How do task reminders work?</AccordionTrigger>
                <AccordionContent>
                  Tasks with due dates will automatically generate reminders. By default, you'll receive a reminder 15 minutes before the task is due. You'll see these reminders as notifications within the app when you're logged in.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I view my tasks in a calendar?</AccordionTrigger>
                <AccordionContent>
                  Go to the Tasks page and click on the "Calendar" tab at the top. This will show your tasks in a calendar view. You can click on any day to see tasks scheduled for that day or add new tasks directly to that day.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I invite team members?</AccordionTrigger>
                <AccordionContent>
                  Go to the Team page and use the "Invite Team Member" form. Enter the email address of the person you want to invite and select their role. They'll receive an invitation email and can join your team by accepting the invitation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90">
          <CardHeader>
            <CardTitle className="text-xl">Feature Guides</CardTitle>
            <CardDescription>Learn how to use all the features of Dincharya</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-dincharya-background/30 dark:bg-dincharya-muted/10 rounded-lg">
              <div className="flex items-center mb-2">
                <ListTodo className="h-5 w-5 mr-2 text-dincharya-primary" />
                <h3 className="font-medium">Task Management</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create, organize, and track your tasks with priorities, categories, and deadlines.
              </p>
            </div>
            
            <div className="p-4 bg-dincharya-background/30 dark:bg-dincharya-muted/10 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 mr-2 text-dincharya-primary" />
                <h3 className="font-medium">Calendar View</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                View your tasks and schedule in a calendar format to manage your time effectively.
              </p>
            </div>
            
            <div className="p-4 bg-dincharya-background/30 dark:bg-dincharya-muted/10 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-dincharya-primary" />
                <h3 className="font-medium">Team Collaboration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Invite team members, assign tasks, and collaborate on projects together.
              </p>
            </div>
            
            <div className="p-4 bg-dincharya-background/30 dark:bg-dincharya-muted/10 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-dincharya-primary" />
                <h3 className="font-medium">Timer & Tracking</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use timers to track how long you spend on different activities and tasks.
              </p>
            </div>
            
            <div className="p-4 bg-dincharya-background/30 dark:bg-dincharya-muted/10 rounded-lg">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 mr-2 text-dincharya-primary" />
                <h3 className="font-medium">Notes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create and organize notes to keep track of important information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-0 shadow-md bg-white dark:bg-dincharya-text/90 mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Need More Help?</CardTitle>
          <CardDescription>Contact us if you need additional assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-dincharya-primary" />
            <span>support@dincharya.com</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
