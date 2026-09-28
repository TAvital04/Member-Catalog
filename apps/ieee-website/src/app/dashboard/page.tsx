import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { EventList } from "@/components/dashboard/event-list";
import { Member_QR_Code } from "@/components/dashboard/member-qr-code";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
	return (
		<div className="flex flex-col max-w-screen overflow-hidden bg-black min-h-screen text-black">
			{/* Navbar – match home/admin spacing */}
			<div className="w-full px-5">
				<Navbar />
			</div>

			{/* Dashboard Content */}
			<main className="flex-1">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
					{/* Left Panel – Upcoming Events */}
					{/* <section className="flex-1 rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/40 lg:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-100 lg:text-xl">
              Upcoming Events
            </h2>
            <EventList />
          </section> */}
					<Card className="flex-1 rounded-xl border border-gray-800 bg-[var(--ieee-black)]  p-4 shadow-lg shadow-black/40 lg:p-6">
						<CardHeader>
							<CardTitle className="mb-1 text-lg font-semibold text-gray-100 lg:text-xl">
                Your Check-In QR
							</CardTitle>
						</CardHeader>
						<div className="flex justify-center">
							<Member_QR_Code />
						</div>
					</Card>

					{/* Left Panel – Upcoming Events */}
					<Card className="flex-1 rounded-xl border border-gray-800 bg-[--ieee-dark-grey] p-4 shadow-lg shadow-black/40 lg:p-6">
						<CardTitle className="-mb-4 text-lg font-semibold text-gray-100 lg:text-xl">
              Upcoming Events
						</CardTitle>
						<EventList />
					</Card>

					{/* Right Panel – Member Resume Database */}
					<Card className="flex-1 rounded-xl border border-gray-800 bg-[var(--ieee-black)] p-4 shadow-lg shadow-black/40 lg:p-6 flex flex-col justify-between">
						<div>
							<CardHeader className="px-0 pt-0">
								<CardTitle className="mb-2 text-lg font-semibold text-gray-100 lg:text-xl flex items-center gap-2">
									<span>📄</span> Member Résumé Database
								</CardTitle>
							</CardHeader>
							<p className="text-sm text-gray-300 mb-6 leading-relaxed">
								Submit and manage your student candidate profile, technical skills, project links, and résumé PDF for sponsors and recruiters.
							</p>
						</div>
						<div className="flex flex-col gap-3 mt-4">
							<Link
								href="/settings#resume-form"
								className="px-5 py-2.5 bg-[var(--ieee-dark-yellow)] text-white font-[heading-font] text-sm rounded-lg hover:bg-[var(--ieee-bright-yellow)] transition duration-200 text-center flex items-center justify-center gap-2"
							>
								Update Résumé Profile →
							</Link>
							<a
								href="http://localhost:3001"
								target="_blank"
								rel="noopener noreferrer"
								className="px-5 py-2.5 bg-neutral-800 border border-gray-700 text-gray-200 font-[heading-font] text-sm rounded-lg hover:bg-neutral-700 transition duration-200 text-center flex items-center justify-center gap-2"
							>
								Browse Candidate Catalog ↗
							</a>
						</div>
					</Card>
				</div>
			</main>
		</div>
	);
}
