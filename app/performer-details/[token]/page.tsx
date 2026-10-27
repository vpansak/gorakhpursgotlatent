import PerformerDetailsForm from '@/components/PerformerDetailsForm';
export const metadata = { title: 'Performer Details | GGL', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  return <PerformerDetailsForm token={(await params).token} />;
}
