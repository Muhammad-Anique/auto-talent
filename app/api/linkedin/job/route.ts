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

    if (!keywords || !locationId || !datePosted || !sort) {
      return NextResponse.json(
        { error: "Missing required query parameters" },
        { status: 400 },
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
      rapidApi,
      data,
    });
  } catch (error) {
    console.error(error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
