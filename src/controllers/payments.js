// const { default: Stripe } = require("stripe");
const Stripe = require("stripe");
const _newStripe = new Stripe(process.env.SECRET_KEY);

const createPaymentSession = async (req, res) => {
  const protocol = req?.protocol;
  const host = req?.headers?.host;
  const dates = req?.body?.bookingInfo;
  const bookingTime =
    new Date(dates?.[0]?.endDate) - new Date(dates?.[0]?.startDate);

  const bookedDays = Math.ceil(bookingTime / (1000 * 60 * 60 * 24)) + 1;
  const costPerDay = req?.body?.propertyInfo?.pricePerDay;
  const totalCost = bookedDays * costPerDay;

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Amount",
        },
        unit_amount: totalCost * 100,
      },
      quantity: 1,
    },
  ];

  try {
    const session = await _newStripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${protocol}://${host}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${protocol}://${host}/payment-cancel`,
      line_items: lineItems,
      metadata: {
        data: "masum",
      },
    });
    res.json(session?.url);
  } catch (error) {
    console.log("Stripe Error:", error);
  }
};

module.exports = {
  createPaymentSession,
  _newStripe,
};
