const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
  admin.initializeApp(functions.config().firebase);
}
const db = admin.firestore();

exports.createBooking = functions.https.onCall(async (bookingData, context) => {
  try {
    return await db.collection("bookings").add(bookingData);
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error);
  }
});

exports.updateBooking = functions.https.onCall(async (data, context) => {
  const { bookingData, bookingId } = data;
  try {
    return await db
      .collection("bookings")
      .doc(bookingId)
      .update({ ...bookingData });
  } catch (error) {}
});

exports.writeBookingFromStripeEvent = functions.firestore
  .document("stripeEvents/{eventId}")
  .onCreate((event, context) => {
    const eventData = event.data();

    switch (eventData.type) {
      case "payment_intent.created":
        // createBooking(eventData);
        break;
      case "payment_intent.succeeded":
        // updateBooking(eventData)
        break;
      case "payment_intent.cancelled":
        // deleteBooking(eventData)
        break;
    }

    return { message: "Success" };
  });
