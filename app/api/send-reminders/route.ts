import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatMalaysiaDateTime(dateString: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + 25 * 60 * 1000).toISOString();
  const windowEnd = new Date(now.getTime() + 35 * 60 * 1000).toISOString();

  const { data: bookings, error } = await supabaseAdmin
    .from("bookings")
    .select(`
      id,
      title,
      start_time,
      end_time,
      user_id,
      resources (
        name,
        location
      ),
      profiles (
        email,
        full_name
      )
    `)
    .eq("status", "confirmed")
    .is("reminder_sent_at", null)
    .gte("start_time", windowStart)
    .lte("start_time", windowEnd);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!bookings || bookings.length === 0) {
    return Response.json({ success: true, sent: 0 });
  }

  let sent = 0;

  for (const booking of bookings as any[]) {
    const email = booking.profiles?.email;

    if (!email) continue;

    try {
      await resend.emails.send({
        from: "SyncSpace <onboarding@resend.dev>",
        to: [email],
        subject: "Reminder: Your booking is scheduled soon.",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #0f172a;">Booking Reminder</h2>
            <p>Hi ${booking.profiles?.full_name || "there"},</p>
            <p>Your SyncSpace booking starts soon.</p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 20px;">
              <p><strong>Title:</strong> ${booking.title}</p>
              <p><strong>Resource:</strong> ${booking.resources?.name || "N/A"}</p>
              <p><strong>Location:</strong> ${booking.resources?.location || "N/A"}</p>
              <p><strong>Start:</strong> ${formatMalaysiaDateTime(booking.start_time)}</p>
              <p><strong>End:</strong> ${formatMalaysiaDateTime(booking.end_time)}</p>
            </div>

            <p style="margin-top: 20px;">See you soon.</p>
          </div>
        `,
      });

      await supabaseAdmin
        .from("bookings")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", booking.id);

      sent++;
    } catch (err) {
      console.error("Reminder failed:", err);
    }
  }

  return Response.json({ success: true, sent });
}