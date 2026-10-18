import type { Metadata } from 'next';
import TalentTourRegistrationForm from '@/components/TalentTourRegistrationForm';

export const metadata: Metadata = {
  title: 'GGL Talent Tour Registration | Pay ₹999',
  description: 'Register for the GGL Talent Tour. Enter your name, email and WhatsApp number, pay the ₹999 registration fee securely, and receive your registration confirmation.',
  alternates: { canonical: 'https://www.gkpgotlatent.in/qwer' },
  robots: { index: true, follow: true },
};

export default function TalentTourRegistrationPage() {
  return <TalentTourRegistrationForm />;
}
