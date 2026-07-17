// app/api/admin/form-sections/route.js
import { getSession } from '@/lib/auth';
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

export async function POST(request) {
  try {


    const { sections } = await request.json();
    await dbConnect();
    
    // Delete all existing sections
    await FormSection.deleteMany({});
    
    // Insert new sections with validation
    const validatedSections = sections.map(section => ({
      name: section.name || `section-${Date.now()}`,
      label: section.label || 'Unnamed Section',
      icon: section.icon || 'User',
      order: typeof section.order === 'number' ? section.order : 0,
      fields: (section.fields || []).map(field => ({
        name: field.name || `field-${Date.now()}`,
        label: field.label || 'Unnamed Field',
        type: fieldTypes.includes(field.type) ? field.type : 'text',
        required: !!field.required,
        options: field.type === 'select' ? (field.options || []) : [],
        placeholder: field.placeholder || '',
        order: typeof field.order === 'number' ? field.order : 0
      }))
    }));

    const result = await FormSection.insertMany(validatedSections);
    
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

const fieldTypes = ['text', 'number', 'select', 'date', 'checkbox', 'textarea'];