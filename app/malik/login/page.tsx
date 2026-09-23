import AdminOtpLogin from '@/components/AdminOtpLogin';

export const metadata = {
  title: 'GGL Admin Portal — Secure Administrator Verification',
  description: 'Authorized administrator login for Gorakhpur’s Got Latent control room and operations.',
};

export default function AdminLoginPage() {
  return <AdminOtpLogin />;
}
