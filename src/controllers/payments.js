const Stripe = require("stripe");
const User = require("../models/User");
const _newStripe = new Stripe(process.env.SECRET_KEY);

const createPaymentSession = async (req, res) => {
  const protocol = req?.protocol;
  const host = req?.headers?.host;

  const user = req?.decoded;
  const dates = req?.body?.bookingInfo;
  const property = req?.body?.propertyInfo;

  if (!property?._id) {
    return res.status(400).send({
      success: false,
      message: "Property ID is required!",
    });
  }

  const propertyId = property._id.toString();
  const hostEmail = property?.host?.email;
  const startDate = new Date(dates?.[0]?.startDate);
  const endDate = new Date(dates?.[0]?.endDate);

  if (user?.email === hostEmail) {
    return res.status(403).send({
      success: false,
      message: "Host cannot book their own property!",
    });
  }

  const bookingTime = endDate - startDate;
  const bookedDays = Math.ceil(bookingTime / (1000 * 60 * 60 * 24)) + 1;
  const costPerDay = property?.pricePerDay;
  const totalCost = bookedDays * costPerDay;

  try {
    // Check if there is an existing reservation for this property in DB
    // const conflictUser = await User.findOne({
    //   reservationList: {
    //     $elemMatch: {
    //       propertyId: propertyId,
    //       startDate: { $lte: endDate },
    //       endDate: { $gte: startDate },
    //     },
    //   },
    // });

    // console.log(conflictUser);

    // if (conflictUser) {
    //   return res.status(409).send({
    //     success: false,
    //     message: "This property is already reserved for the given dates!",
    //   });
    // }

    // If no conflict, create Stripe session
    const session = await _newStripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${protocol}://${host}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${host}/payment-cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Reservation Payment" },
            unit_amount: totalCost * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        propertyId,
        userId: user?._id,
        hostEmail,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    const dbUser = await User.findById(user?._id);
    dbUser.transactionID = session.id;
    await dbUser.save();

    res.json(session?.url);
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to create payment session",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentSession,
  _newStripe,
};
