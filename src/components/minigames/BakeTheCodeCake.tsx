import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw, Play, ChevronRight } from "lucide-react";
import baking1 from "@/assets/baking1.png";
import baking2 from "@/assets/baking2.png";
import baking3 from "@/assets/baking3.png";
import baking4 from "@/assets/baking4.png";

interface Step {
  image: string;
  instruction: string;
  code: string;
}

const steps: Step[] = [
  {
    image: baking1,
    instruction: "Mix ingredients",
    code: "print('Mix!')",
  },
  {
    image: baking2,
    instruction: "Preheat oven",
    code: "print('Heat!')",
  },
  {
    image: baking3,
    instruction: "Pour batter",
    code: "print('Pour!')",
  },
  {
    image: baking4,
    instruction: "Bake the cake!",
    code: "print('Bake!')",
  },
];

// Confetti component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-2 h-2 rounded"
            style={{
              backgroundColor: ['#f44336', '#2196F3', '#4CAF50', '#FFEB3B', '#FF9800', '#9C27B0'][
                Math.floor(Math.random() * 6)
              ],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default function BakeTheCodeCake() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Final step - show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleRestart = () => {
    setIsStarted(false);
    setCurrentStep(0);
    setShowConfetti(false);
    setIsTransitioning(false);
  };

  const isFinalStep = currentStep === steps.length - 1;

  if (!isStarted) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎂 Bake the Code Cake
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Learn coding through a fun baking adventure!
            </p>
            <Button onClick={handleStart} size="lg" className="mt-4">
              <Play className="w-4 h-4 mr-2" />
              Start Playing
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              🎂 Bake the Code Cake
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded transition-all ${
                  index < currentStep
                    ? "bg-green-500"
                    : index === currentStep
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Large centered image display */}
          <div className="flex justify-center items-center min-h-[400px] bg-muted/30 rounded-lg p-6">
            <div
              className={`relative transition-all duration-500 ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <img
                src={steps[currentStep].image}
                alt={`Step ${currentStep + 1}: ${steps[currentStep].instruction}`}
                className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Step info and code */}
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">
                Step {currentStep + 1} of {steps.length}
              </p>
              <p className="text-lg font-semibold">{steps[currentStep].instruction}</p>
            </div>

            {/* Code display (auto-filled for demo) */}
            <div className="space-y-2">
              <Label htmlFor="code-display">Code:</Label>
              <Input
                id="code-display"
                value={steps[currentStep].code}
                readOnly
                className="font-mono bg-muted/50 cursor-default"
              />
            </div>

            {/* Final step completion message */}
            {isFinalStep && (
              <div className="p-6 bg-gradient-to-r from-green-500/10 to-primary/10 border-2 border-green-500/50 rounded-lg text-center space-y-3">
                <p className="text-4xl mb-2">🎂</p>
                <p className="text-2xl font-bold text-green-500">You baked a cake!</p>
                <p className="text-sm text-muted-foreground">
                  Congratulations! You completed all the steps!
                </p>
              </div>
            )}

            {/* Navigation button */}
            <div className="flex justify-center">
              {isFinalStep ? (
                <Button onClick={handleRestart} size="lg" className="w-full sm:w-auto">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              ) : (
                <Button onClick={handleNext} size="lg" className="w-full sm:w-auto">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
