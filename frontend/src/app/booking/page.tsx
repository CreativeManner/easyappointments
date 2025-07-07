"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingState } from "@/types";

// Import step components
import ServiceSelection from "@/components/booking/service-selection";
import ProviderSelection from "@/components/booking/provider-selection";
import DateTimeSelection from "@/components/booking/datetime-selection";
import CustomerInfo from "@/components/booking/customer-info";
import BookingConfirmation from "@/components/booking/booking-confirmation";
import AIAssistantChat from "@/components/ai/ai-assistant-chat";

const STEPS = [
  {
    id: 1,
    title: "Service",
    description: "Choose your service",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    id: 2,
    title: "Provider",
    description: "Select a provider",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 3,
    title: "Date & Time",
    description: "Pick your preferred time",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: 4,
    title: "Information",
    description: "Enter your details",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 5,
    title: "Confirmation",
    description: "Review and confirm",
    icon: <CheckCircle className="h-4 w-4" />,
  },
];

export default function BookingPage() {
  const [bookingState, setBookingState] = useState<BookingState>({
    currentStep: 1,
    isLoading: false,
    errors: {},
  });

  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const currentStep = STEPS.find(step => step.id === bookingState.currentStep);
  const progress = ((bookingState.currentStep - 1) / (STEPS.length - 1)) * 100;

  const updateBookingState = (updates: Partial<BookingState>) => {
    setBookingState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (bookingState.currentStep < STEPS.length) {
      updateBookingState({ currentStep: bookingState.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (bookingState.currentStep > 1) {
      updateBookingState({ currentStep: bookingState.currentStep - 1 });
    }
  };

  const canProceed = () => {
    switch (bookingState.currentStep) {
      case 1:
        return !!bookingState.selectedService;
      case 2:
        return !!bookingState.selectedProvider;
      case 3:
        return !!bookingState.selectedDate && !!bookingState.selectedTime;
      case 4:
        return !!bookingState.customerInfo?.firstName && 
               !!bookingState.customerInfo?.lastName && 
               !!bookingState.customerInfo?.email;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (bookingState.currentStep) {
      case 1:
        return (
          <ServiceSelection 
            bookingState={bookingState} 
            updateBookingState={updateBookingState} 
          />
        );
      case 2:
        return (
          <ProviderSelection 
            bookingState={bookingState} 
            updateBookingState={updateBookingState} 
          />
        );
      case 3:
        return (
          <DateTimeSelection 
            bookingState={bookingState} 
            updateBookingState={updateBookingState} 
          />
        );
      case 4:
        return (
          <CustomerInfo 
            bookingState={bookingState} 
            updateBookingState={updateBookingState} 
          />
        );
      case 5:
        return (
          <BookingConfirmation 
            bookingState={bookingState} 
            updateBookingState={updateBookingState} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Book Appointment</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAIAssistant(true)}
              className="relative"
            >
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></span>
              AI Assistant
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Step {bookingState.currentStep} of {STEPS.length}</h2>
                <p className="text-muted-foreground">{currentStep?.title}</p>
              </div>
              <Badge variant="outline" className="text-sm">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  index < STEPS.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.id === bookingState.currentStep
                      ? 'bg-primary text-primary-foreground border-primary'
                      : step.id < bookingState.currentStep
                      ? 'bg-primary/20 text-primary border-primary'
                      : 'bg-muted text-muted-foreground border-muted'
                  }`}
                >
                  {step.id < bookingState.currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-border mx-4" />
                )}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentStep?.icon}
                <span>{currentStep?.title}</span>
              </CardTitle>
              <CardDescription>{currentStep?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={bookingState.currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={bookingState.currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex space-x-2">
              {bookingState.currentStep < STEPS.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed() || bookingState.isLoading}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    // Handle final booking submission
                    console.log('Booking submitted:', bookingState);
                  }}
                  disabled={!canProceed() || bookingState.isLoading}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm Booking</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistantChat 
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        bookingState={bookingState}
        updateBookingState={updateBookingState}
      />
    </div>
  );
}