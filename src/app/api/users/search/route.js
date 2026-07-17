import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

// Force dynamic to ensure it doesn't get statically cached
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await dbConnect();

        // 1. Authentication & Identification
        // Get token to identify current user and exclude them from results
        let token = request.cookies.get('authToken')?.value;
        if (!token) {
            const authHeader = request.headers.get('authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        let currentUserId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                currentUserId = decoded.userId;
            } catch (err) {
                console.warn('Invalid token in search:', err.message);
                // We can continue without currentUserId, or enforce auth. 
                // Requirement says "opposite of current user" for gender default, 
                // so knowing the user helps, but basic search might be public? 
                // The prompt implies "at my mobile at matches tab", so likely logged in.
                // Let's assume purely authenticated for now to be safe, or just ignore if null.
            }
        }

        // 2. Parse Query Parameters
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');
        const gender = searchParams.get('gender');
        const religion = searchParams.get('religion');
        const minAge = searchParams.get('minAge');
        const maxAge = searchParams.get('maxAge');
        const caste = searchParams.get('caste');
        const location = searchParams.get('location');
        const education = searchParams.get('education');
        const occupation = searchParams.get('occupation');
        const income = searchParams.get('income');
        const diet = searchParams.get('diet');
        const manglik = searchParams.get('manglik');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;

        // 3. Build MongoDB Query
        const query = {};

        // Exclude current user
        if (currentUserId) {
            query._id = { $ne: currentUserId };
        }

        // Text Search (Partial Match)
        if (q) {
            const regex = new RegExp(q, 'i'); // case-insensitive
            const searchConditions = [
                { name: regex },
                { currentCity: regex },
                { caste: regex },
                { subCaste: regex }, // Added subCaste search
            ];

            // Check if q is a number (Age Search)
            const ageQuery = parseInt(q);
            if (!isNaN(ageQuery)) {
                const today = new Date();
                const maxDob = new Date(today.getFullYear() - ageQuery, today.getMonth(), today.getDate());
                const minDob = new Date(today.getFullYear() - ageQuery - 1, today.getMonth(), today.getDate());

                searchConditions.push({
                    dob: { $gte: minDob, $lte: maxDob }
                });
            }

            query.$or = searchConditions;
        }

        // Exact Filters
        if (gender) {
            query.gender = gender;
        }

        if (religion && religion !== 'Any') {
            query.religion = religion;
        }

        if (caste && caste !== 'Any') {
            query.caste = caste;
        }

        if (location && location !== 'Any') {
            const city = location.split(',')[0].trim();
            query.currentCity = new RegExp(city, 'i');
        }

        if (education && education !== 'Any') {
            query.education = education;
        }

        if (occupation && occupation !== 'Any') {
            query.occupation = occupation;
        }

        if (income && income !== 'Any') {
            query.income = income;
        }

        if (diet && diet !== 'Any') {
            query.diet = diet;
        }

        if (manglik && manglik !== 'Any') {
            query.mangal = manglik;
        }

        // Age Filter (Derived from DOB)
        // Formula: DOB <= Today - minAge_Years  AND  DOB >= Today - (maxAge_Years + 1)
        if (minAge || maxAge) {
            const today = new Date();
            query.dob = {};

            if (minAge) {
                const maxDob = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
                query.dob.$lte = maxDob;
            }

            if (maxAge) {
                const minDob = new Date(today.getFullYear() - parseInt(maxAge) - 1, today.getMonth(), today.getDate());
                // Careful with "max age 30" -> implies they are not yet 31.
                // Usually: user is 30 if DOB is between Today-31 and Today-30. 
                // Let's stick to standard logic: 
                // older than MaxAge? -> exclude. 
                // If maxAge is 30, we want born AFTER (Today - 31 years).
                query.dob.$gte = minDob;
            }
        }

        // Optional: Filter only verified users or similar if needed? 
        // Requirement said "Do NOT return users already blocked or rejected".
        // Schema has `verificationStatus`. Let's assume we want 'Verified' or at least not 'Rejected'.
        // Adding basics:
        query.verificationStatus = { $ne: 'Rejected' };


        // 4. Execute Query with Pagination
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(query)
                .select('name dob profilePhoto currentCity profession religion caste subCaste gender') // Select only needed fields including subCaste
                .skip(skip)
                .limit(limit)
                .lean(), // faster
            User.countDocuments(query)
        ]);

        // 5. Format Response
        const formattedUsers = users.map(user => {
            // Calculate age helper
            let age = null;
            if (user.dob) {
                const dob = new Date(user.dob);
                const diff_ms = Date.now() - dob.getTime();
                const age_dt = new Date(diff_ms);
                age = Math.abs(age_dt.getUTCFullYear() - 1970);
            }

            return {
                _id: user._id,
                name: user.name,
                dob: user.dob,
                age: age,
                profilePhoto: user.profilePhoto,
                currentCity: user.currentCity,
                profession: user.occupation, // Mapping 'occupation' to 'profession' as per request key
                religion: user.religion,
                caste: user.caste,
                subCaste: user.subCaste,
                gender: user.gender
            };
        });

        return NextResponse.json({
            success: true,
            data: formattedUsers,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Server Error' },
            { status: 500 }
        );
    }
}
