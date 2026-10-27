export const performerDetailFields = [
  { key: 'mobile', label: 'Mobile Number — Same as Provided Earlier', required: true, type: 'tel' },
  { key: 'fullName', label: 'Full name', required: true },
  { key: 'stageName', label: 'Stage name / naam jisse host aapko introduce kare' },
  { key: 'instagram', label: 'Instagram ID' },
  { key: 'category', label: 'Aap kis category ka act perform karenge? (Comedy, singing, dance, poetry, mimicry, magic, unusual talent, etc.)', required: true },
  { key: 'description', label: 'Apne act ko simple words mein samjhaiye', required: true, multiline: true },
  { key: 'actDetails', label: 'Aap jo karne wale ho detail mein batao', multiline: true },
  { key: 'duration', label: 'Expected performance duration (target: around 2 minutes)', options: ['1', '2', '3'] },
  { key: 'technicalRequirements', label: 'Props, mic, instrument, chair, table, screen ya kisi technical setup ki requirement', multiline: true },
  { key: 'stageExperience', label: 'Kya aapne pehle stage par perform kiya hai? Agar haan, kahan aur kaisa experience tha?', multiline: true },
  { key: 'meaningfulStory', label: 'Aapki life ki ek emotional ya meaningful baat jo aap comfortable hokar production team ke saath share kar sakte hain', multiline: true },
  { key: 'funnyFacts', label: 'Apne baare mein do funny facts, jokes ya strange habits batayein jinpar host halka-phulka fun kar sakta hai', required: true, multiline: true },
  { key: 'funnyIncident', label: 'Aapke saath hua koi funny, embarrassing ya completely unexpected incident', required: true, multiline: true },
  { key: 'hostTopics', label: 'Host aapke saath kis cheez ko lekar fun ya conversation kar sakta hai?', multiline: true },
  { key: 'offLimitTopics', label: 'Kaunse topics, personal details ya jokes stage par bilkul mention nahi hone chahiye?', multiline: true },
  { key: 'introduction', label: 'Aap chahte hain host aapko kis one-line introduction ke saath stage par bulaye?', multiline: true },
  { key: 'audienceMemory', label: 'Aapko kya lagta hai audience aapko performance ke baad kyun yaad rakhegi?', multiline: true },
  { key: 'reportedPaymentStatus', label: 'Payment Status', required: true, options: ['Paid', 'Unpaid', 'Paid via QR'] },
] as const;

export function validatePerformerDetails(input: Record<string, unknown>) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid form');
  const data: Record<string, string> = {};
  for (const field of performerDetailFields) {
    const raw = input[field.key];
    const value = typeof raw === 'string' ? raw.trim() : '';
    if ('required' in field && field.required && !value) throw new Error(`${field.label} is required`);
    if (value.length > 6000) throw new Error(`${field.label} is too long`);
    if ('options' in field && value && !(field.options as readonly string[]).includes(value)) throw new Error(`Invalid ${field.label}`);
    data[field.key] = value;
  }
  if (!/^\+?[\d\s()-]{10,20}$/.test(data.mobile)) throw new Error('Please enter a valid mobile number');
  return data;
}

export function hasVerifiedPerformerPayment(item: Record<string, any>) {
  return ['PAID', 'PAYMENT_VERIFIED'].includes(item.payment_status) && Boolean(item.verified_payment_id) && !['REFUNDED', 'REJECTED_REFUND'].includes(item.status);
}
