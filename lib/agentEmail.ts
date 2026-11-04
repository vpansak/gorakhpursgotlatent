import { createHash } from 'crypto';
export async function sendAgentEmail(payload: Record<string, unknown>, key: string) {
  const apiKey = process.env.PRIMITIVE_API_KEY;
  if (!apiKey) throw new Error('Agent email is not configured');
  const response = await fetch('https://api.primitive.dev/v1/send-mail', {
    method:'POST', signal:AbortSignal.timeout(20000),
    headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','Idempotency-Key':key},
    body:JSON.stringify({from:process.env.PRIMITIVE_FROM_EMAIL || 'agent@raw-trout.primitive.email',reply_to:'help.gglatent@gmail.com',...payload})
  });
  if (!response.ok) {console.error('Agent email provider rejected request', {status:response.status,key});throw new Error('Email could not be sent. Please try again shortly.');}
  const result = await response.json();
  console.info('Agent email accepted', {key});
  return result;
}
export function emailSendKey(ticketId:string,email:string) {return 'ggl-ticket-'+createHash('sha256').update(ticketId+'\n'+email.toLowerCase()).digest('hex');}
