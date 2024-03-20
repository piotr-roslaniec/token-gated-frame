import { getMessage } from "@/lib/messages";

export async function POST(
  request: Request,
  { params }: { params: { message: string } },
) {
  console.log("POST /api/[message]/reshare", { params });
  return Response.redirect(request.url, 302);
}

export async function GET(
  request: Request,
  { params }: { params: { message: string } },
) {
  console.log("GET /api/[message]/reshare", { params });
  const message = await getMessage(params.message);
  if (!message) {
    return new Response("Message not found", { status: 404 });
  }

  return Response.redirect(message.frame.checkoutUrl, 302);
}
