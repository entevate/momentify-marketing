import { NextResponse } from "next/server";

interface DemoFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  solution: string;
  companySize: string;
  eventsPerYear: string;
  referral: string;
  sourcePage: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const data: DemoFormData = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.company || !data.solution) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const results = await Promise.allSettled([
      submitToHubSpot(data),
      submitToIntercom(data),
    ]);

    // Check if at least one succeeded
    const anySucceeded = results.some((r) => r.status === "fulfilled");
    if (!anySucceeded) {
      console.error("Both HubSpot and Intercom submissions failed:", results);
      return NextResponse.json({ error: "Submission failed." }, { status: 500 });
    }

    // Log any individual failures for monitoring
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const service = i === 0 ? "HubSpot" : "Intercom";
        console.error(`${service} submission failed:`, r.reason);
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Demo form error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

/* ── HubSpot Forms API ────────────────────────────── */

async function submitToHubSpot(data: DemoFormData) {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = process.env.HUBSPOT_FORM_GUID;

  if (!portalId || !formGuid) {
    throw new Error("HubSpot credentials not configured.");
  }

  const response = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [
          { name: "firstname", value: data.firstName },
          { name: "lastname", value: data.lastName },
          { name: "email", value: data.email },
          { name: "company", value: data.company },
          { name: "jobtitle", value: data.jobTitle },
          { name: "solution_interest", value: data.solution },
          { name: "company_size", value: data.companySize },
          { name: "events_per_year", value: data.eventsPerYear },
          { name: "referral_source", value: data.referral },
          { name: "source_page", value: data.sourcePage },
          { name: "message", value: data.message },
        ],
        context: {
          pageUri: "https://momentifyapp.com/demo",
          pageName: "Demo Request",
        },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HubSpot error ${response.status}: ${body}`);
  }
}

/* ── Intercom Contacts API ────────────────────────── */

async function submitToIntercom(data: DemoFormData) {
  const token = process.env.INTERCOM_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Intercom credentials not configured.");
  }

  const response = await fetch("https://api.intercom.io/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      role: "lead",
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      custom_attributes: {
        company_name: data.company,
        job_title: data.jobTitle,
        solution_interest: data.solution,
        company_size: data.companySize,
        events_per_year: data.eventsPerYear,
        referral_source: data.referral,
        source_page: data.sourcePage,
        demo_message: data.message,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Intercom error ${response.status}: ${body}`);
  }
}
