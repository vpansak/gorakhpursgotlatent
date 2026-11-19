import {GET as protectedDocument} from '@/app/api/malik/documents/[file]/route';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const GET=protectedDocument;
