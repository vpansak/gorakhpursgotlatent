import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from '@/lib/db';
import { getS3Client } from '@/lib/storage';

export const runtime = 'nodejs';
const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = new Set(['image/jpeg','image/png','image/webp']);

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const appId = String(data.get('appId') || '').trim();
    const paymentId = String(data.get('paymentId') || '').trim();
    if (!appId || !paymentId) return NextResponse.json({success:false,error:'Missing payment reference.'},{status:400});
    const bucket = process.env.GGL_PRIVATE_S3_BUCKET;
    const s3 = getS3Client();
    if (!bucket || !s3) return NextResponse.json({success:false,error:'Secure document storage is not configured yet. Please contact GGL support; do not send Aadhaar through an unverified link.'},{status:503});
    const rows = await db.query<any>('SELECT app_id, payment_status, razorpay_payment_id FROM ggl_talent_trip_registrations WHERE app_id = ?', [appId]);
    if (!rows[0] || rows[0].payment_status !== 'PAID' || rows[0].razorpay_payment_id !== paymentId) return NextResponse.json({success:false,error:'Payment reference is not verified.'},{status:403});
    const fields = [
      {form:'aadhaarFront', column:'aadhaar_front_key', label:'Aadhaar front'},
      {form:'aadhaarBack', column:'aadhaar_back_key', label:'Aadhaar back'},
      {form:'passportPhoto', column:'passport_photo_key', label:'Passport-size photo'}
    ] as const;
    const saved: string[] = [];
    for (const field of fields) {
      const file = data.get(field.form);
      if (!(file instanceof File) || file.size === 0) return NextResponse.json({success:false,error:`Please select the ${field.label} image.`},{status:400});
      if (!TYPES.has(file.type) || file.size > MAX_SIZE) return NextResponse.json({success:false,error:'Use JPG, PNG or WEBP images up to 5 MB each.'},{status:400});
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const key = `ggl-talent-trip-private/${appId}/${field.form}-${crypto.randomBytes(16).toString('hex')}.${ext}`;
      await s3.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:Buffer.from(await file.arrayBuffer()),ContentType:file.type,Metadata:{applicationid:appId,documenttype:field.form}}));
      await db.execute(`UPDATE ggl_talent_trip_registrations SET ${field.column} = ?, updated_at = CURRENT_TIMESTAMP WHERE app_id = ?`,[key,appId]);
      saved.push(field.label);
    }
    await db.execute(`UPDATE ggl_talent_trip_registrations SET documents_uploaded_at = CURRENT_TIMESTAMP, participant_status = 'DOCUMENTS_SUBMITTED', updated_at = CURRENT_TIMESTAMP WHERE app_id = ?`,[appId]);
    return NextResponse.json({success:true,saved});
  } catch (e:any) {
    console.error('GGL trip private document upload failed:',e);
    return NextResponse.json({success:false,error:'Document upload failed. Please try again or contact GGL support.'},{status:500});
  }
}
