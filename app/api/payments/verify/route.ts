import { NextResponse } from 'next/server';
export async function POST(){return NextResponse.json({error:'This checkout has been replaced. Please use the current ticket booking page. If a payment was already taken, contact GGL support before paying again.',bookingUrl:'/book-ticket'},{status:410});}
