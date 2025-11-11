import { Layout } from "@/components/Layout";
import BackButton from "@/components/common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminAnalytics, loginEvents, paidTutorials, certificates, payments } from "@/mock/adminData";

export default function AdminDashboardPage() {
	return (
		<Layout>
			<div className="container mx-auto max-w-6xl p-6 space-y-6">
				<BackButton />
				<div className="grid md:grid-cols-4 gap-4">
					<Card><CardHeader><CardTitle>DAU</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{adminAnalytics.dau}</CardContent></Card>
					<Card><CardHeader><CardTitle>MAU</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{adminAnalytics.mau}</CardContent></Card>
					<Card><CardHeader><CardTitle>Completion</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{adminAnalytics.completionRate}%</CardContent></Card>
					<Card><CardHeader><CardTitle>Logins Today</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{adminAnalytics.loginsToday}</CardContent></Card>
				</div>
				<div className="grid md:grid-cols-4 gap-4">
					<Card>
						<CardHeader><CardTitle>Revenue (Mo)</CardTitle></CardHeader>
						<CardContent className="text-2xl font-bold">₹{adminAnalytics.revenueMonth.toFixed(2)}</CardContent>
					</Card>
					<Card>
						<CardHeader><CardTitle>Premium Subs</CardTitle></CardHeader>
						<CardContent className="text-2xl font-bold">{adminAnalytics.premiumSubscribers}</CardContent>
					</Card>
					<Card>
						<CardHeader><CardTitle>Payments Success</CardTitle></CardHeader>
						<CardContent className="text-2xl font-bold">{adminAnalytics.payments.success}</CardContent>
					</Card>
					<Card>
						<CardHeader><CardTitle>Generated Certificates</CardTitle></CardHeader>
						<CardContent className="text-2xl font-bold">{certificates.length}</CardContent>
					</Card>
				</div>
				<div className="grid md:grid-cols-2 gap-6">
					<Card>
						<CardHeader><CardTitle>Recent Logins</CardTitle></CardHeader>
						<CardContent className="space-y-2">
							{loginEvents.map(ev => (
								<div key={ev.id} className="p-2 border rounded flex items-center justify-between text-sm">
									<span>{ev.user} • {ev.role}</span>
									<span className="text-muted-foreground">{ev.time}</span>
								</div>
							))}
						</CardContent>
					</Card>
					<Card>
						<CardHeader><CardTitle>Paid Tutorials</CardTitle></CardHeader>
						<CardContent className="space-y-2">
							{paidTutorials.map(t => (
								<div key={t.id} className="p-2 border rounded flex items-center justify-between text-sm">
									<span className="truncate">{t.title} • {t.mentor}</span>
									<span className="text-xs rounded-full px-2 py-0.5 bg-secondary text-secondary-foreground">{t.status}</span>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
				<Card>
					<CardHeader><CardTitle>Payments Overview</CardTitle></CardHeader>
					<CardContent className="grid md:grid-cols-3 gap-3">
						{payments.map(p => (
							<div key={p.id} className="p-2 border rounded text-sm flex items-center justify-between">
								<span>{p.user}</span>
								<span>₹{p.amount.toFixed(2)}</span>
								<span className="text-xs rounded-full px-2 py-0.5 bg-secondary text-secondary-foreground">{p.status}</span>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</Layout>
	);
}
