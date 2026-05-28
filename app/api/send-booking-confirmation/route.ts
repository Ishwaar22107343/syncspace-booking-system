import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const appUrl = process.env.NEXT_PUBLIC_APP_URL

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      to,
      title,
      resourceName,
      resourceLocation,
      startTime,
      endTime,
    } = body;

    if (!to || !title || !resourceName || !startTime || !endTime) {
      return Response.json(
        { error: "Missing required email fields." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "SyncSpace <onboarding@resend.dev>",
      to: [to],
      subject: "Booking Confirmed - SyncSpace",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0f172a;">Booking Confirmed</h2>
          <p>Your booking has been successfully confirmed.</p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 20px;">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Resource:</strong> ${resourceName}</p>
            <p><strong>Location:</strong> ${resourceLocation || "N/A"}</p>
            <p><strong>Start:</strong> ${startTime}</p>
            <p><strong>End:</strong> ${endTime}</p>
          </div>

          <a
            href="${appUrl}/bookings"
            style="
                display: inline-block;
                margin-top: 20px;
                background: #0f172a;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 18px;
                border-radius: 10px;
                font-weight: 600;
            "
          >
           Manage Booking
          </a>

          <p style="margin-top: 20px;">Thank you for using SyncSpace.</p>
        </div>
      `,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("BOOKING EMAIL ERROR:", error)
    
    return Response.json(
      { error: "Failed to send confirmation email." },
      { status: 500 }
    );
  }
}