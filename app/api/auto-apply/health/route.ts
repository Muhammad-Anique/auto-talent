import { NextResponse } from "next/server";
import { HealthChecker } from "@/lib/auto-apply-logging";

// GET /api/auto-apply/health - Health check endpoint
export async function GET() {
  try {
    const health = await HealthChecker.checkSystemHealth();

    const isHealthy = health.database.healthy && health.memory.percentage < 90;

    return NextResponse.json(
      {
        status: isHealthy ? "healthy" : "unhealthy",
        timestamp: new Date().toISOString(),
        ...health,
      },
      {
        status: isHealthy ? 200 : 503,
      }
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      {
        status: 503,
      }
    );
  }
}
