import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";

interface Props {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
}

export default function BookingNotificationEmail({
  guestName,
  guestPhone,
  guestEmail,
  hotelName,
  checkIn,
  checkOut,
  guestsCount,
}: Props) {
  return (
    <Html>
      <Head />

      <Body>
        <Container>

          <Heading>New Booking</Heading>

          <Text>Hotel: {hotelName}</Text>

          <Text>Guest: {guestName}</Text>

          <Text>Phone: {guestPhone}</Text>

          <Text>Email: {guestEmail}</Text>

          <Text>Check In: {checkIn}</Text>

          <Text>Check Out: {checkOut}</Text>

          <Text>Guests: {guestsCount}</Text>

        </Container>
      </Body>
    </Html>
  );
}