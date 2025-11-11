import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/premium/PaymentModal";

export default function LevelPrompt() {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced" | "">("");
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // ✅ Show only if user is logged in AND hasn't selected a level yet
    const loggedIn = !!localStorage.getItem("codequest-role");
    const hasLevel = !!localStorage.getItem("codequest-level");
    if (loggedIn && !hasLevel) {
      setOpen(true);
    }
  }, []);

  const onSave = () => {
    if (!level) return;
    if (level === "advanced" && localStorage.getItem("codequest-premium") !== "true") {
      setShowPayment(true);
      return;
    }
    localStorage.setItem("codequest-level", level);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select your learning level</DialogTitle>
            <DialogDescription>Choose Beginner, Intermediate, or Advanced.</DialogDescription>
          </DialogHeader>

          <RadioGroup value={level} onValueChange={(v) => setLevel(v as any)} className="space-y-3">
            <div className="flex items-center space-x-2 border rounded p-3">
              <RadioGroupItem value="beginner" id="lvl-b" />
              <Label htmlFor="lvl-b">Beginner</Label>
            </div>

            <div className="flex items-center space-x-2 border rounded p-3">
              <RadioGroupItem value="intermediate" id="lvl-i" />
              <Label htmlFor="lvl-i">Intermediate</Label>
            </div>

            <div className="flex flex-col space-y-2 border rounded p-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="lvl-a" />
                <Label htmlFor="lvl-a">Advanced</Label>
                <span className="ml-2 text-xs rounded px-2 py-0.5 bg-secondary text-muted-foreground">
                  Premium required
                </span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Advanced tutorials require premium access.
              </p>
            </div>
          </RadioGroup>

          <div className="flex justify-end">
            <Button onClick={onSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal
        open={showPayment}
        onOpenChange={setShowPayment}
        onSuccess={() => {
          if (level) {
            localStorage.setItem("codequest-level", level);
            setOpen(false);
          }
        }}
      />
    </>
  );
}
