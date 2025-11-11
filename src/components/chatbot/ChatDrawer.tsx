import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ChatDrawer() {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
		{ role: "assistant", text: "Hi! I'm your CodeQuest Doubt Assistant." },
	]);
	const { toast } = useToast();

	const send = () => {
		if (!input.trim()) return;
		// Simulate occasional offline
		if (Math.random() < 0.1) {
			toast({ title: "Unable to reach assistant. Try again later.", variant: "destructive" });
			return;
		}
		setMessages((prev) => [...prev, { role: "user", text: input }, { role: "assistant", text: "This is a placeholder AI tutor response." }]);
		setInput("");
	};

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="fixed bottom-6 right-6 z-50 rounded-full p-4 bg-primary text-primary-foreground shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring"
				aria-label="Open chatbot"
			>
				<MessageSquare className="h-6 w-6" />
			</button>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerContent className="max-h-[80vh]">
					<DrawerHeader>
						<DrawerTitle>CodeQuest Doubt Assistant</DrawerTitle>
					</DrawerHeader>
					<div className="p-4 flex flex-col gap-3">
						<div className="h-64 overflow-y-auto rounded border p-3 bg-background">
							{messages.map((m, i) => (
								<div key={i} className={`text-sm mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
									<span className={`inline-block px-3 py-2 rounded ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m.text}</span>
								</div>
							))}
						</div>
						<div className="flex gap-2">
							<Input
								placeholder="Type your doubt..."
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && send()}
								aria-label="Chat input"
							/>
							<Button onClick={send}>Ask</Button>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}


