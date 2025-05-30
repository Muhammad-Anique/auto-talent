import {
  getValidRapidApiToken,
  searchProfile,
} from "@/utils/linkedin/linkedinUtils";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileUrl = searchParams.get("profileUrl");

    if (!profileUrl) {
      return NextResponse.json(
        { error: "Missing profileUrl" },
        { status: 400 },
      );
    }

    const rapidApi = await getValidRapidApiToken();

    const data = await searchProfile(rapidApi.token, { profileUrl });

    return NextResponse.json({ rapidApi, data });
  } catch (error) {
    console.error(error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
