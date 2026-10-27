// Payment verification annotates records; it never hides submitted applications.
export const performerSelect = "SELECT p.*, CASE WHEN p.payment_status='PAID' AND p.payment_amount=29 AND p.payment_id IS NOT NULL AND EXISTS (SELECT 1 FROM performer_payment_links l WHERE l.app_id=p.app_id AND l.status='PAID' AND l.razorpay_payment_id=p.payment_id AND l.amount=29) THEN p.payment_id ELSE NULL END AS verified_payment_id FROM performer_applications p";
export const guestSelect = "SELECT g.*, l.razorpay_payment_id AS payment_id, l.amount AS payment_amount, CASE WHEN l.status='PAID' AND l.razorpay_payment_id IS NOT NULL AND l.amount=49 THEN 'PAID' ELSE NULL END AS payment_status FROM guest_applications g LEFT JOIN guest_payment_links l ON l.app_id=g.app_id";
export const performerOrder = " ORDER BY COALESCE(p.is_read, 0) ASC, p.created_at DESC";
export const guestOrder = " ORDER BY COALESCE(g.is_read, 0) ASC, g.created_at DESC";
