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

    const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || "apify_api_TlHxsCGXP3Ja1FKPKf8jqp6AzpPZdx1Yt8oN";
    const ACTOR_ID = "dev_fusion~linkedin-profile-scraper";

    // Start the Actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileUrls: [profileUrl],
        }),
      }
    );

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      throw new Error(errorData.error?.message || "Failed to start Apify Actor");
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;
    const defaultDatasetId = runData.data.defaultDatasetId;

    // Poll for completion (wait up to 2 minutes)
    const maxAttempts = 24;
    let attempts = 0;
    let status = runData.data.status;

    while (status !== "SUCCEEDED" && status !== "FAILED" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;

      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/${ACTOR_ID}/runs/${runId}?token=${APIFY_API_TOKEN}`
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        status = statusData.data.status;
      }
    }

    if (status === "FAILED") {
      throw new Error("LinkedIn scraping failed");
    }

    if (status !== "SUCCEEDED") {
      throw new Error("LinkedIn scraping timed out");
    }

    // Get the results from the dataset
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${APIFY_API_TOKEN}`
    );

    if (!datasetResponse.ok) {
      throw new Error("Failed to fetch LinkedIn profile data");
    }

    const profileData = await datasetResponse.json();

    if (!profileData || profileData.length === 0) {
      throw new Error("No profile data found");
    }

    const profile = profileData[0];

    // Transform the Apify data to the expected format
    const data = {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      headline: profile.headline || "",
      summary: profile.about || "",
      location: profile.addressWithoutCountry || profile.addressWithCountry || "",
      profilePicture: profile.profilePicture || "",
      email: profile.email || "",
      phone: profile.mobileNumber || "",
      linkedinUrl: profile.linkedinPublicUrl || profileUrl,
      experiences: (profile.experiences || []).map((exp: any) => ({
        company: exp.companyName || "",
        title: exp.title || "",
        startDate: exp.jobStartedOn || "",
        endDate: exp.jobStillWorking ? "Present" : exp.jobEndedOn || "",
        description: exp.jobDescription || "",
        location: exp.jobLocation || "",
      })),
      educations: (profile.educations || []).map((edu: any) => ({
        school: edu.title || "",
        degree: edu.subtitle || "",
        startDate: edu.period?.startedOn || "",
        endDate: edu.period?.endedOn || "",
        grade: edu.grade || "",
      })),
      skills: (profile.skills || []).map((skill: any) =>
        typeof skill === "string" ? skill : skill.title || ""
      ),
      certifications: profile.certifications || [],
      languages: profile.languages || [],
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch LinkedIn profile:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
