
import { Button } from "@/components/ui/button";

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-dincharya-text">Terms and Conditions</h1>
      
      <div className="bg-white dark:bg-dincharya-text/90 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">1. Introduction</h2>
        <p className="mb-4 text-dincharya-text/90 dark:text-white/90">
          Welcome to Dincharya ("we," "our," or "us"). By accessing or using our website, mobile applications, or any other services we offer (collectively, the "Services"), you agree to be bound by these Terms and Conditions. Please read them carefully.
        </p>
        
        <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">2. Accounts and Registration</h2>
        <p className="mb-4 text-dincharya-text/90 dark:text-white/90">
          When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.
        </p>
        
        <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">3. User Content</h2>
        <p className="mb-4 text-dincharya-text/90 dark:text-white/90">
          Our Services allow you to create, upload, store, and share content. You retain ownership of any intellectual property rights you hold in that content, but you grant us a worldwide, royalty-free license to use, copy, modify, and distribute your content.
        </p>
        
        <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">4. Privacy Policy</h2>
        <p className="mb-4 text-dincharya-text/90 dark:text-white/90">
          Our Privacy Policy describes how we collect, use, and share your personal data. By using our Services, you agree to our collection and use of information as described in our Privacy Policy.
        </p>
        
        <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">5. Termination</h2>
        <p className="mb-4 text-dincharya-text/90 dark:text-white/90">
          We may terminate or suspend your account and access to our Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Services, us, or third parties, or for any other reason.
        </p>
        
        <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">6. Changes to Terms</h2>
        <p className="mb-4 text-dincharya-text/90 dark:text-white/90">
          We may update these Terms from time to time. If we make significant changes, we will notify you through the Services or by other means. Your continued use of the Services after such modifications constitutes your acceptance of the revised Terms.
        </p>
        
        <h2 className="text-xl font-semibold mb-4 text-dincharya-primary">7. Contact Information</h2>
        <p className="mb-4 text-dincharya-text/90 dark:text-white/90">
          If you have any questions about these Terms, please contact us at terms@dincharya.com.
        </p>
      </div>
      
      <div className="text-center mb-10">
        <Button className="btn-primary">Back to Home</Button>
      </div>
    </div>
  );
};

export default TermsPage;
