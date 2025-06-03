
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Book, Users } from "lucide-react";

const HelpPage = () => {
  const faqs = [
    {
      question: "How do I create a new task?",
      answer: "You can create a new task by clicking the 'Add Task' button on the Tasks page or from the quick actions on the Home page. Fill in the task details and click save."
    },
    {
      question: "How does the Pomodoro timer work?",
      answer: "The Pomodoro timer helps you focus by breaking work into 25-minute focused sessions followed by short breaks. Click 'Focus Time' to start a 25-minute session."
    },
    {
      question: "Can I organize tasks by categories?",
      answer: "Yes! When creating or editing tasks, you can assign them to categories like Work, Personal, Home, or Health. Use the filter options to view tasks by category."
    },
    {
      question: "How do I set task reminders?",
      answer: "When creating or editing a task, you can set a start time and end time. The app will send you notifications to help you stay on track."
    },
    {
      question: "What is the difference between pinning and completing a task?",
      answer: "Pinning a task keeps it visible and easily accessible on your dashboard. Completing a task marks it as done and moves it to your completed tasks list."
    },
    {
      question: "How do I change my profile information?",
      answer: "Go to the Profile page from the sidebar and update your personal information, notification preferences, and appearance settings."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dincharya-background to-dincharya-muted/20 dark:from-dincharya-text dark:to-dincharya-muted/10">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dincharya-text dark:text-white mb-2">Help & Support</h1>
          <p className="text-gray-600 dark:text-gray-400">Find answers to common questions and get support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-dincharya-text dark:text-white">
                <Book className="h-5 w-5 text-dincharya-primary" />
                Documentation
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Learn how to use all features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Comprehensive guides and tutorials to help you get the most out of Dincharya.
              </p>
              <Button variant="outline" className="w-full border-dincharya-border/30">
                View Documentation
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-dincharya-text dark:text-white">
                <MessageCircle className="h-5 w-5 text-dincharya-primary" />
                Live Chat
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Get instant help from our team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Chat with our support team for immediate assistance with any issues.
              </p>
              <Button variant="outline" className="w-full border-dincharya-border/30">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-dincharya-text dark:text-white">
                <Users className="h-5 w-5 text-dincharya-primary" />
                Community
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Connect with other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Join our community to share tips, ask questions, and connect with other users.
              </p>
              <Button variant="outline" className="w-full border-dincharya-border/30">
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-dincharya-text/90 border-dincharya-border/20 mb-8">
          <CardHeader>
            <CardTitle className="text-dincharya-text dark:text-white">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Find quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-dincharya-text dark:text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-dincharya-primary to-dincharya-secondary text-white">
          <CardHeader>
            <CardTitle className="text-white">Still Need Help?</CardTitle>
            <CardDescription className="text-white/80">
              Can't find what you're looking for? Get in touch with our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
