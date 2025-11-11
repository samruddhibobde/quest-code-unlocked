import { Layout } from "@/components/Layout";
import MentorDashboard from "@/components/mentor/MentorDashboard";
import BackButton from "@/components/common/BackButton";

export default function MentorDashboardPage() {
	return (
		<Layout>
			<div className="container mx-auto max-w-7xl p-6">
				<div className="absolute top-4 left-4">
					<BackButton />
				</div>
				<div className="mt-12">
					<MentorDashboard />
				</div>
			</div>
		</Layout>
	);
}


