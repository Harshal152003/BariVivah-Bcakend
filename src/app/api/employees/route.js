// app/api/employees/route.js
import { NextResponse } from 'next/server';
import Employee from '@/models/Employee';
import dbConnect from '@/lib/dbConnect';

export async function POST(request) {
  await dbConnect();

  try {
    const {
      name,
      username,
      email,
      phone,
      password,
      confirmPassword,
      role = 'Employee',
      status = 'Active',
      permissions = {},
      department = 'New Department',
      position = 'New Position'
    } = await request.json();

    // Basic validation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords don't match" },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ username }, { email }]
    });

    if (existingEmployee) {
      return NextResponse.json(
        { success: false, message: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // Create new employee
    const newEmployee = await Employee.create({
      name,
      username,
      email,
      phone,
      password, // In production, you should hash the password before saving
      role,
      status,
      permissions,
      department,
      position
    });

    return NextResponse.json(
      { success: true, data: newEmployee },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  await dbConnect();

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 4;
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    // Build query
    const query = {};
    
    if (status && status !== 'All Status') {
      query.status = status;
    }
    
    if (role && role !== 'All Roles') {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    // Execute count and find queries in parallel for better performance
    // Use .lean() to return plain objects instead of heavy Mongoose documents
    const [totalEmployees, employees] = await Promise.all([
      Employee.countDocuments(query),
      Employee.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
    ]);

    const totalPages = Math.ceil(totalEmployees / limit);

    return NextResponse.json({
      success: true,
      data: employees,
      pagination: {
        totalEmployees,
        totalPages,
        currentPage: page,
        employeesPerPage: limit
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}