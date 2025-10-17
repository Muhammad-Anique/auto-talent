import {
  getValidRapidApiToken,
  searchJobs,
} from "@/utils/linkedin/linkedinUtils";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const keywords = searchParams.get("keywords");
    const locationId = searchParams.get("locationId");
    const datePosted = searchParams.get("datePosted");
    const sort = searchParams.get("sort");

    // Validate required parameters
    if (!keywords || !locationId || !datePosted || !sort) {
      return NextResponse.json(
        {
          error: "Missing required query parameters",
          required: ["keywords", "locationId", "datePosted", "sort"],
          received: { keywords, locationId, datePosted, sort },
        },
        { status: 400 }
      );
    }

    // Validate parameter values
    const validDatePosted = ["anyTime", "past24Hours", "pastWeek", "pastMonth"];
    const validSort = ["mostRelevant", "mostRecent"];

    if (!validDatePosted.includes(datePosted)) {
      return NextResponse.json(
        {
          error: "Invalid datePosted parameter",
          validValues: validDatePosted,
          received: datePosted,
        },
        { status: 400 }
      );
    }

    if (!validSort.includes(sort)) {
      return NextResponse.json(
        {
          error: "Invalid sort parameter",
          validValues: validSort,
          received: sort,
        },
        { status: 400 }
      );
    }

    const rapidApi = await getValidRapidApiToken();

    const data = await searchJobs(rapidApi.token, {
      keywords,
      locationId,
      datePosted,
      sort,
    });

    return NextResponse.json({
      success: true,
      rapidApi: {
        id: rapidApi.id,
        counter: rapidApi.counter,
      },
      data,
    });
  } catch (error) {
    console.error("LinkedIn job search error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Return more specific error responses
    if (errorMessage.includes("No valid RapidAPI token")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable - no API tokens available" },
        { status: 503 }
      );
    }

    if (errorMessage.includes("HTTP error")) {
      return NextResponse.json(
        { error: "External API error - LinkedIn service unavailable" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
