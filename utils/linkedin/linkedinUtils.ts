import { createClient } from "../supabase/server";

export const getValidRapidApiToken = async () => {
  try {
    const supabase = await createClient();

    const { data, error: selectError } = await supabase
      .from("rapid_api_db")
      .select("*")
      .gt("counter", 0)
      .limit(1)
      .single();

    if (selectError) {
      console.error(selectError);
      throw selectError;
    }

    if (!data) {
      throw new Error("No valid RapidAPI token found.");
    }

    const { error: updateError } = await supabase
      .from("rapid_api_db")
      .update({ counter: data.counter - 1 })
      .eq("id", data.id);

    if (updateError) {
      console.error(updateError);
      throw updateError;
    }

    return data;
  } catch (error) {
    throw new Error("Error fetching or updating RapidApi token.");
  }
};

type SearchJobsParams = {
  keywords: string;
  locationId?: string;
  datePosted?: string;
  sort?: string;
};

export async function searchJobs(
  token: string,
  {
    keywords,
    locationId = "92000000",
    datePosted = "anyTime",
    sort = "mostRelevant",
  }: SearchJobsParams,
) {
  const url = new URL("https://linkedin-data-api.p.rapidapi.com/search-jobs");
  url.searchParams.append("keywords", keywords);
  url.searchParams.append("locationId", locationId);
  url.searchParams.append("datePosted", datePosted);
  url.searchParams.append("sort", sort);

  const options = {
    method: "GET",
    headers: {
      "X-Rapidapi-Key": token,
      "X-Rapidapi-Host": "linkedin-data-api.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    throw error;
  }
}

export async function searchProfile(
  token: string,
  { profileUrl }: { profileUrl: string },
) {
  const url = new URL(
    "https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url",
  );
  url.searchParams.append("url", profileUrl);

  const options = {
    method: "GET",
    headers: {
      "X-Rapidapi-Key": token,
      "X-Rapidapi-Host": "linkedin-data-api.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch LinkedIn profile:", error);
    throw error;
  }
}
