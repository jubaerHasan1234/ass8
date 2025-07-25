import { NextResponse } from "next/server";

/**
 * This is a catch-all API route that handles any requests
 * to /api/ that don't match a more specific API route.
 * It's used to generate a custom "API Not Found" response.

 */
export async function GET(request) {
  const url = new URL(request.url);
  const requestedPath = url.pathname;
  console.warn(`API route not found: ${requestedPath}`);

  // Return a JSON response with a 404 status
  return NextResponse.json(
    {
      error: "API Route Not Found",
      message: `The requested API endpoint '${requestedPath}' does not exist. Please check the URL.`,
      status: 404,
    },
    { status: 404 } // Explicitly set the HTTP status code to 404
  );
}

export async function POST(request) {
  const url = new URL(request.url);
  const requestedPath = url.pathname;
  console.warn(`API route not found for POST: ${requestedPath}`);
  return NextResponse.json(
    {
      error: "API Route Not Found",
      message: `The requested API endpoint '${requestedPath}' does not exist for POST requests.`,
      status: 404,
    },
    { status: 404 }
  );
}

export async function PUT(request, { params }) {
  const requestedPath = params.path.join("/");

  return NextResponse.json(
    {
      error: "API Route Not Found",
      message: `The requested API endpoint '${requestedPath}' does not exist for PUT requests.`,
      status: 404,
    },
    { status: 404 }
  );
}

export async function DELETE(request, { params }) {
  const requestedPath = params.path.join("/");

  return NextResponse.json(
    {
      error: "API Route Not Found",
      message: `The requested API endpoint '${requestedPath}' does not exist for DELETE requests.`,
      status: 404,
    },
    { status: 404 }
  );
}
