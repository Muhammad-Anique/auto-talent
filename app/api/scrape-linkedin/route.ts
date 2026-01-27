import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  console.log("=".repeat(80));
  console.log("🚀 LinkedIn Scraping API - Request Started");
  console.log("=".repeat(80));

  try {
    const { profileUrl } = await req.json();
    console.log("📥 Received Profile URL:", profileUrl);

    if (!profileUrl) {
      console.log("❌ ERROR: No profile URL provided");
      return NextResponse.json(
        { success: false, message: "LinkedIn profile URL is required" },
        { status: 400 }
      );
    }

    const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || "apify_api_TlHxsCGXP3Ja1FKPKf8jqp6AzpPZdx1Yt8oN";
    const ACTOR_ID = "dev_fusion~linkedin-profile-scraper";

    console.log("🔑 Using Actor ID:", ACTOR_ID);
    console.log("🔐 API Token:", APIFY_API_TOKEN ? `${APIFY_API_TOKEN.substring(0, 15)}...` : "NOT SET");

    // Start the Actor run
    console.log("\n📤 Starting Apify Actor run...");
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

    console.log("📡 Actor Start Response Status:", runResponse.status);

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      console.log("❌ Failed to start Actor. Error data:", JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error?.message || "Failed to start Apify Actor");
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;
    const defaultDatasetId = runData.data.defaultDatasetId;

    console.log("✅ Actor started successfully!");
    console.log("🆔 Run ID:", runId);
    console.log("📊 Dataset ID:", defaultDatasetId);
    console.log("📍 Initial Status:", runData.data.status);

    // Poll for completion (wait up to 2 minutes)
    console.log("\n⏳ Polling for completion (max 2 minutes)...");
    const maxAttempts = 24; // 24 * 5 seconds = 2 minutes
    let attempts = 0;
    let status = runData.data.status;

    while (status !== "SUCCEEDED" && status !== "FAILED" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      attempts++;

      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/${ACTOR_ID}/runs/${runId}?token=${APIFY_API_TOKEN}`
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        status = statusData.data.status;
        console.log(`🔄 Attempt ${attempts}/${maxAttempts} - Status: ${status}`);
      } else {
        console.log(`⚠️  Attempt ${attempts}/${maxAttempts} - Failed to fetch status (HTTP ${statusResponse.status})`);
      }
    }

    console.log(`\n📊 Final Status: ${status} (after ${attempts} attempts)`);

    if (status === "FAILED") {
      console.log("❌ LinkedIn scraping FAILED");
      throw new Error("LinkedIn scraping failed");
    }

    if (status !== "SUCCEEDED") {
      console.log("⏰ LinkedIn scraping TIMED OUT");
      throw new Error("LinkedIn scraping timed out");
    }

    // Get the results from the dataset
    console.log("\n📥 Fetching results from dataset...");
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${APIFY_API_TOKEN}`
    );

    console.log("📡 Dataset Response Status:", datasetResponse.status);

    if (!datasetResponse.ok) {
      console.log("❌ Failed to fetch dataset");
      throw new Error("Failed to fetch LinkedIn profile data");
    }

    const profileData = await datasetResponse.json();
    console.log("📦 Dataset items count:", profileData?.length || 0);

    if (!profileData || profileData.length === 0) {
      console.log("❌ No profile data found in dataset");
      throw new Error("No profile data found");
    }

    const profile = profileData[0];
    console.log("\n👤 Raw Profile Data Preview:");
    console.log("  - Name:", profile.firstName, profile.lastName);
    console.log("  - Headline:", profile.headline);
    console.log("  - Location:", profile.addressWithoutCountry || profile.addressWithCountry);
    console.log("  - Experiences:", profile.experiences?.length || 0);
    console.log("  - Education:", profile.educations?.length || 0);
    console.log("  - Skills:", profile.skills?.length || 0);

    console.log("\n🔍 Full Raw Profile Data:");
    console.log(JSON.stringify(profile, null, 2));

    // Transform the Apify data to resume format
    console.log("\n🔄 Transforming data to resume format...");
    const transformedData = {
      first_name: profile.firstName || "",
      last_name: profile.lastName || "",
      email: profile.email || "",
      phone_number: profile.mobileNumber || "",
      location: profile.addressWithoutCountry || profile.addressWithCountry || "",
      linkedin_url: profile.linkedinPublicUrl || profileUrl,
      work_experience: (profile.experiences || []).map((exp: any) => ({
        company: exp.companyName || "Unknown Company",
        position: exp.title || "",
        date: exp.jobStartedOn && exp.jobEndedOn
          ? `${exp.jobStartedOn} - ${exp.jobEndedOn}`
          : exp.jobStartedOn && exp.jobStillWorking
          ? `${exp.jobStartedOn} - Present`
          : exp.jobStartedOn || "",
        description: exp.jobDescription || "",
        location: exp.jobLocation || "",
      })),
      education: (profile.educations || []).map((edu: any) => ({
        school: edu.title || "",
        degree: edu.subtitle || "",
        field: "",
        date: edu.period?.startedOn && edu.period?.endedOn
          ? `${edu.period.startedOn} - ${edu.period.endedOn}`
          : edu.period?.startedOn || "",
        gpa: edu.grade || "",
      })),
      skills: profile.skills && profile.skills.length > 0
        ? [
            {
              category: "Skills",
              items: profile.skills.map((skill: any) =>
                typeof skill === "string" ? skill : skill.title || ""
              ),
            },
          ]
        : [],
      projects: [],
    };

    console.log("\n✅ Transformed Data Preview:");
    console.log("  - Name:", transformedData.first_name, transformedData.last_name);
    console.log("  - Work Experience:", transformedData.work_experience.length, "items");
    console.log("  - Education:", transformedData.education.length, "items");
    console.log("  - Skills:", transformedData.skills[0]?.items?.length || 0, "items");

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log("\n⏱️  Total Duration:", duration, "seconds");
    console.log("=".repeat(80));
    console.log("✅ LinkedIn Scraping API - Success!");
    console.log("=".repeat(80));

    return NextResponse.json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("\n" + "=".repeat(80));
    console.log("❌ LinkedIn Scraping API - ERROR");
    console.log("=".repeat(80));
    console.error("Error Details:", error);
    console.error("Error Message:", error instanceof Error ? error.message : "Unknown error");
    console.error("Error Stack:", error instanceof Error ? error.stack : "No stack trace");
    console.log("⏱️  Duration before error:", duration, "seconds");
    console.log("=".repeat(80));

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to scrape LinkedIn profile",
      },
      { status: 500 }
    );
  }
}
