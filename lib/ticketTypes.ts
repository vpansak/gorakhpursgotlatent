export interface TicketRecord {
  id: string;
  ticket_id: string;
  booking_id: string;
  customer_name: string;
  mobile: string;
  email: string;
  instagram_id: string;
  date_of_birth: string;
  quantity: number;
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  payment_status: string;
  ticket_status: 'VALID' | 'CANCELLED';
  qr_token: string;
  checked_in: number; // 0 or 1
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
  is_demo?: boolean;
}

/**
 * Validates age >= 18 from DOB string (e.g. '2000-08-15' or '15 August 2000')
 */
export function validateAgeIs18Plus(dobString: string): { is18Plus: boolean; age: number; formattedDob: string } {
  const dobDate = new Date(dobString);
  if (isNaN(dobDate.getTime())) {
    return { is18Plus: false, age: 0, formattedDob: dobString };
  }

  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDob = dobDate.toLocaleDateString('en-GB', options);

  return {
    is18Plus: age >= 18,
    age,
    formattedDob,
  };
}
