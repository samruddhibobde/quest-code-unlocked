import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
	const nav = useNavigate();
	return (
		<button
			onClick={() => nav(-1)}
			className="inline-flex items-center gap-2 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded px-1"
			aria-label="Go back"
		>
			<ArrowLeft size={16} /> Back
		</button>
	);
}


