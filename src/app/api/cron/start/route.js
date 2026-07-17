// src/app/api/cron/start/route.js
import checkExpiredSubscriptions from "@/lib/cron";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Start the cron job (runs on server startup)
    checkExpiredSubscriptions();
    return new Response(
      JSON.stringify({ message: "Cron job started" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error starting cron job", error: error.message }),
      { status: 500 }
    );
  }
}