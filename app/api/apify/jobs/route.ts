import { NextRequest, NextResponse } from "next/server";

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = "curious_coder~linkedin-jobs-scraper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      keywords = "",
      location = "",
      geoId,
      distance,
      workplaceType, // 1=On-site, 2=Remote, 3=Hybrid
      jobType, // F=Full-time, C=Contract, P=Part-time, T=Temporary, I=Internship
      experienceLevel, // 1=Internship, 2=Entry, 3=Associate, 4=Mid-Senior, 5=Director, 6=Executive
      recency, // r3600, r86400, r604800, r2592000
      easyApply = false,
      under10Applicants = false,
      sortBy = "DD", // DD=Date, R=Relevance
      pageNum = 0,
      count = 100, // Apify requires minimum 100
    } = body;

    // Build the LinkedIn job search URL with all parameters
    const params = new URLSearchParams();

    if (keywords) params.append("keywords", keywords);
    if (location) params.append("location", location);
    if (geoId) params.append("geoId", geoId);
    if (distance) params.append("distance", distance.toString());

    // Workplace Type filter
    if (workplaceType && workplaceType.length > 0) {
      params.append("f_WT", workplaceType.join(","));
    }

    // Job Type filter
    if (jobType && jobType.length > 0) {
      params.append("f_JT", jobType.join(","));
    }

    // Experience Level filter
    if (experienceLevel && experienceLevel.length > 0) {
      params.append("f_E", experienceLevel.join(","));
    }

    // Recency filter (time posted)
    if (recency) {
      params.append("f_TPR", recency);
    }

    // Easy Apply filter
    if (easyApply) {
      params.append("f_AL", "true");
    }

    // Under 10 applicants filter
    if (under10Applicants) {
      params.append("f_JIYN", "true");
    }

    // Sort by
    params.append("sortBy", sortBy);

    // Pagination
    params.append("position", "1");
    params.append("pageNum", pageNum.toString());

    const searchUrl = `https://www.linkedin.com/jobs/search/?${params.toString()}`;

    // Prepare Apify actor input
    const apifyInput = {
      count: Math.max(count, 100), // Ensure minimum 100
      scrapeCompany: true,
      urls: [searchUrl],
    };

    console.log("Triggering Apify actor with URL:", searchUrl);

    // Trigger Apify actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/runs?token=${APIFY_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apifyInput),
      }
    );

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error("Apify run error:", errorText);
      throw new Error(`Failed to start Apify actor: ${runResponse.status}`);
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;
    const defaultDatasetId = runData.data.defaultDatasetId;

    console.log("Apify run started:", runId);

    // Poll for completion (wait up to 2 minutes)
    let attempts = 0;
    const maxAttempts = 40; // 2 minutes with 3-second intervals
    let runStatus = "RUNNING";

    while (attempts < maxAttempts && runStatus === "RUNNING") {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds

      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/runs/${runId}?token=${APIFY_API_TOKEN}`
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        runStatus = statusData.data.status;
        console.log(`Attempt ${attempts + 1}: Status = ${runStatus}`);
      }

      attempts++;
    }

    if (runStatus !== "SUCCEEDED") {
      return NextResponse.json(
        {
          error: "Job search timed out or failed",
          status: runStatus,
        },
        { status: 408 }
      );
    }

    // Fetch results from dataset
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${APIFY_API_TOKEN}`
    );

    if (!datasetResponse.ok) {
      throw new Error(`Failed to fetch dataset: ${datasetResponse.status}`);
    }

    const jobs = await datasetResponse.json();

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: pageNum,
        count: jobs.length,
        hasMore: jobs.length === count, // If we got full count, there might be more pages
      },
      searchUrl,
    });
  } catch (error) {
    console.error("Apify job search error:", error);

    return NextResponse.json(
      {
        error: "Failed to search jobs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
