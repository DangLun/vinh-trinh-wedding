import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WeddingPage from "@/components/WeddingPage";
import { coupleName } from "@/config/wedding";
import { guests } from "@/data/guests";
import { findGuest } from "@/lib/guests";

export function generateStaticParams() {
  return guests.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/moi/[slug]">): Promise<Metadata> {
  const guest = findGuest((await params).slug);
  return {
    title: `Thân mời ${guest?.name ?? "bạn"} | ${coupleName}`,
  };
}

export default async function InvitePage({ params }: PageProps<"/moi/[slug]">) {
  const guest = findGuest((await params).slug);
  if (!guest) notFound();
  return <WeddingPage guestName={guest.name} />;
}
