// app/api/form-config/route.js
import FormSection from '@/models/FormSection';
import dbConnect from '@/lib/dbConnect';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const sections = await FormSection.find().sort({ order: 1 });
    return new Response(JSON.stringify(sections), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}