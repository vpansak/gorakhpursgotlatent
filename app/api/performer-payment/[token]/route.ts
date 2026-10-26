import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendPerformerApplicationEmail } from '@/lib/emailjs';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';
import Razorpay from 'razorpay';
import crypto from 'crypto';
function getApplicationRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID1 || '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET1 || '';
  if (!key_id || !key_secret) return null;
  try { return new Razorpay({ key_id, key_secret }); } catch { return null; }
}
function isApplicationRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID1 && process.env.RAZORPAY_KEY_SECRET1);
}
function verifyApplicationSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET1 || '';
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId).digest('hex');
  const a = Buffer.from(expected, 'hex'); const b = Buffer.from(signature, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
async function ensureTable(){await db.execute("CREATE TABLE IF NOT EXISTS performer_payment_links (token TEXT PRIMARY KEY, app_id TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING', razorpay_order_id TEXT, razorpay_payment_id TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, paid_at TIMESTAMPTZ)");}
export async function GET(_req:Request,ctx:{params:Promise<{token:string}>}){try{await ensureTable();const {token}=await ctx.params;const rows=await db.query('SELECT l.token,l.amount,l.status,l.razorpay_payment_id,p.app_id,p.full_name,p.email,p.mobile_number,p.whatsapp_number,p.city,p.performance_category,p.performance_title,p.performance_description,p.instagram_url,p.age FROM performer_payment_links l JOIN performer_applications p ON p.app_id=l.app_id WHERE l.token=? LIMIT 1',[token]);if(!rows[0])return NextResponse.json({error:'Payment link not found'},{status:404});const payment=rows[0];if(payment.status!=='PAID'&&payment.app_id){const app=await db.queryOne("SELECT payment_status,payment_id FROM performer_applications WHERE app_id=?",[payment.app_id]);if(app?.payment_status==='PAID'){await db.execute("UPDATE performer_payment_links SET status='PAID',razorpay_payment_id=COALESCE(razorpay_payment_id,?) WHERE token=?",[app.payment_id||null,token]);payment.status='PAID';payment.razorpay_payment_id=payment.razorpay_payment_id||app.payment_id||null;}}return NextResponse.json({success:true,payment,keyId:process.env.RAZORPAY_KEY_ID1||''});}catch(e:any){return NextResponse.json({error:e.message||'Unable to load payment details'},{status:500});}}
export async function POST(req:Request,ctx:{params:Promise<{token:string}>}){try{await ensureTable();const {token}=await ctx.params;const b=await req.json();const link=await db.queryOne('SELECT * FROM performer_payment_links WHERE token=?',[token]);if(!link)return NextResponse.json({error:'Payment link not found'},{status:404});if(link.status==='PAID')return NextResponse.json({success:true,status:'PAID'});const rzp=getApplicationRazorpay();if(b.action==='create-order'){if(!rzp||!isApplicationRazorpayConfigured())return NextResponse.json({error:'Online payment is temporarily unavailable. Please contact GGL support.'},{status:503});const order=await rzp.orders.create({amount:Math.round(Number(link.amount)*100),currency:'INR',receipt:('ggl'+token).slice(0,40),notes:{app_id:link.app_id,performer_payment_token:token}});await db.execute('UPDATE performer_payment_links SET razorpay_order_id=? WHERE token=?',[order.id,token]);const p=await db.queryOne('SELECT full_name,email,mobile_number FROM performer_applications WHERE app_id=?',[link.app_id]);return NextResponse.json({success:true,orderId:order.id,amount:Math.round(Number(link.amount)*100),currency:'INR',keyId:process.env.RAZORPAY_KEY_ID1,name:p?.full_name||'GGL Performer',email:p?.email||'',phone:p?.mobile_number||''});}if(b.action==='verify'){const o=b.razorpay_order_id, pid=b.razorpay_payment_id, sig=b.razorpay_signature;if(!rzp||!isApplicationRazorpayConfigured()||!o||!pid||!sig||o!==link.razorpay_order_id||!verifyApplicationSignature(o,pid,sig))return NextResponse.json({error:'Payment verification failed'},{status:400});const payment=await rzp.payments.fetch(pid);if(payment.status!=='captured'||Number(payment.amount)!==Math.round(Number(link.amount)*100))return NextResponse.json({error:'Payment is not captured or amount mismatch'},{status:400});await db.execute("UPDATE performer_payment_links SET status='PAID',razorpay_payment_id=?,paid_at=CURRENT_TIMESTAMP WHERE token=?",[pid,token]);await db.execute("UPDATE performer_applications SET payment_status='PAID',payment_amount=?,payment_id=?,order_id=?,payment_verified_at=CURRENT_TIMESTAMP,application_status='SUBMITTED',status='SUBMITTED',updated_at=CURRENT_TIMESTAMP WHERE app_id=?",[link.amount,pid,o,link.app_id]);
const p=await db.queryOne('SELECT app_id,full_name,email,mobile_number,whatsapp_number,performance_category,performance_title,performance_description,performance_type,performer_count,performance_duration,performance_language,city,age,instagram_url,interested_in_talent_trip FROM performer_applications WHERE app_id=?',[link.app_id]);
if(p){
  const emailResult=await sendPerformerApplicationEmail({
    application_id:p.app_id,created_at:new Date().toISOString(),full_name:p.full_name,email:p.email,
    mobile_number:p.mobile_number,whatsapp_number:p.whatsapp_number,call_number:p.mobile_number,
    alternate_contact:p.mobile_number,performance_category:p.performance_category,performance_title:p.performance_title,
    performance_description:p.performance_description,additional_message:'',performance_type:p.performance_type,
    performer_count:p.performer_count,performance_duration:p.performance_duration,performance_language:p.performance_language,
    city:p.city,age:p.age,instagram_url:p.instagram_url,payment_status:'PAID',order_id:o,payment_id:pid,
    payment_amount:Number(link.amount),payment_verified_at:new Date().toISOString(),application_status:'SUBMITTED'
  });
  if(emailResult.success) await db.execute("UPDATE performer_applications SET email_status='SENT',admin_email_status='SENT' WHERE app_id=?",[p.app_id]).catch(()=>{});
  saveIndividualEntryToS3('performers/all',p.app_id,{...p,payment_status:'PAID',payment_amount:Number(link.amount),status:'SUBMITTED',created_at:new Date().toISOString()}).catch(err=>console.error('S3 performer save error:',err));
  syncSheetsToS3().catch(err=>console.error('S3 sync error:',err));
}
return NextResponse.json({success:true,status:'PAID'});}return NextResponse.json({error:'Invalid action'},{status:400});}catch(e:any){return NextResponse.json({error:e.message||'Payment processing failed'},{status:500});}}
