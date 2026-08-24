import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Report from '@/models/Report';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();

    // Fetch all reports with reporter & candidate user populated
    const reports = await Report.find({})
      .populate('reporterId', 'name phone email profilePhoto gender')
      .populate('reportedUserId', 'name phone email profilePhoto gender currentCity age isVerified isBlocked accountStatus createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Group reports by candidate user
    const groupedMap = new Map();

    reports.forEach((item) => {
      const candidate = item.reportedUserId;
      if (!candidate) return;

      const candidateId = String(candidate._id || candidate.id);

      if (!groupedMap.has(candidateId)) {
        groupedMap.set(candidateId, {
          candidate,
          reportCount: 0,
          pendingCount: 0,
          reasons: [],
          reportsList: [],
          latestReportDate: item.createdAt,
        });
      }

      const group = groupedMap.get(candidateId);
      group.reportCount += 1;
      if (item.status === 'Pending') group.pendingCount += 1;

      if (!group.reasons.includes(item.reason)) {
        group.reasons.push(item.reason);
      }

      group.reportsList.push({
        _id: item._id,
        reason: item.reason,
        description: item.description,
        status: item.status,
        createdAt: item.createdAt,
        reporter: item.reporterId || { name: 'Anonymous Member' },
      });
    });

    const groupedReports = Array.from(groupedMap.values()).sort(
      (a, b) => b.reportCount - a.reportCount || new Date(b.latestReportDate) - new Date(a.latestReportDate)
    );

    // Compute Overall Statistics
    const totalReports = reports.length;
    const totalReportedProfiles = groupedReports.length;
    const highRiskCount = groupedReports.filter((g) => g.reportCount >= 3).length;
    const pendingCount = reports.filter((r) => r.status === 'Pending').length;

    return NextResponse.json({
      success: true,
      data: {
        groupedReports,
        rawReports: reports,
        stats: {
          totalReports,
          totalReportedProfiles,
          highRiskCount,
          pendingCount,
        },
      },
    });
  } catch (error) {
    console.error('[API/Admin/Reports] Error fetching reports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user reports and complaints.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { action, candidateId, reportId, note } = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Action type is required.' },
        { status: 400 }
      );
    }

    if (action === 'block') {
      if (!candidateId) {
        return NextResponse.json({ success: false, message: 'Candidate User ID required to block.' }, { status: 400 });
      }

      // Mark user as blocked
      await User.findByIdAndUpdate(candidateId, {
        isBlocked: true,
        accountStatus: 'Blocked',
      });

      // Update all reports for this user to 'Blocked'
      await Report.updateMany(
        { reportedUserId: candidateId },
        { status: 'Blocked', actionTakenNote: note || 'Candidate blocked by admin' }
      );

      return NextResponse.json({
        success: true,
        message: 'Candidate profile permanently blocked and reports resolved.',
      });
    }

    if (action === 'dismiss' || action === 'resolve') {
      const newStatus = action === 'dismiss' ? 'Dismissed' : 'Reviewed';

      if (reportId) {
        await Report.findByIdAndUpdate(reportId, {
          status: newStatus,
          actionTakenNote: note || '',
        });
      } else if (candidateId) {
        await Report.updateMany(
          { reportedUserId: candidateId },
          { status: newStatus, actionTakenNote: note || '' }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Report(s) marked as ${newStatus}.`,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action type.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[API/Admin/Reports Action] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to execute admin report action.' },
      { status: 500 }
    );
  }
}
