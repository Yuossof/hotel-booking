import BookingNotificationEmail from "@/emails/booking-notification";
import { resend } from "@/lib/resend";

interface BookingNotificationData {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
}

export async function sendBookingNotification(
  ownerEmail: string,
  data: BookingNotificationData,
) {
  await resend.emails.send({
    from: "Hotel Booking <bookings@hotel.marketeereg.com>",
    to: ownerEmail,
    subject: "New Booking",
    react: BookingNotificationEmail(data),
  });
}
