import { receiveWebhook, verifyWebhook } from '@/lib/meta/webhook';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export function GET(req:Request) { return verifyWebhook(req,'whatsapp'); }
export function POST(req:Request) { return receiveWebhook(req,'whatsapp'); }
