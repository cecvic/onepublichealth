import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from '@emailjs/browser';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      // EmailJS configuration
      const serviceId = 'service_gjzf9rc';
      const templateId = 'template_n465mbb';
      const publicKey = '6gbiAfzAVpLCElfC4';

      // Initialize EmailJS
      emailjs.init(publicKey);

      // Template parameters - using most basic EmailJS variables
      const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        message: `New community signup from ${formData.name} (${formData.email})`,
      };

      console.log('Sending signup notification to admin:');
      console.log(`Name: ${formData.name}`);
      console.log(`Email: ${formData.email}`);
      console.log(`Admin Email: drsudharsanvasudevan@gmail.com`);
      console.log(`Timestamp: ${new Date().toISOString()}`);

      // Send email using EmailJS
      console.log('Template parameters:', templateParams);
      console.log('Service ID:', serviceId);
      console.log('Template ID:', templateId);
      console.log('Public Key:', publicKey);
      
      const result = await emailjs.send(serviceId, templateId, templateParams);
      console.log('EmailJS result:', result);

      setStatus("success");
      setFormData({ name: "", email: "" });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 2000);
      
    } catch (error) {
      console.error("Error sending signup email:", error);
      setStatus("error");
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          setErrorMessage("Invalid template configuration. Please check your EmailJS setup.");
        } else if (error.message.includes('401')) {
          setErrorMessage("Invalid EmailJS credentials. Please check your public key.");
        } else if (error.message.includes('403')) {
          setErrorMessage("EmailJS service access denied. Please check your service configuration.");
        } else {
          setErrorMessage(`Email sending failed: ${error.message}`);
        }
      } else {
        setErrorMessage("Failed to send signup request. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setStatus("idle");
      setErrorMessage("");
      setFormData({ name: "", email: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Our Community</DialogTitle>
          <DialogDescription>
            Get access to the latest public health resources, job opportunities, and community discussions.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Welcome to the community!
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Thank you for joining us. We'll be in touch soon with updates and opportunities.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            {status === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Community"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
