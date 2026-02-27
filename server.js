app.use(express.json());

app.post("/order-webhook", async (req, res) => {
  try {
    console.log("Incoming webhook:", req.body);

    if (!req.body || !req.body.id) {
      return res.status(400).json({ error: "Order ID missing" });
    }

    const orderId = req.body.id;
    const status = req.body.status;

    if (status !== "completed") {
      return res.sendStatus(200);
    }

    // Now generate invoice URL OR fetch it
    const invoiceUrl = `https://yourdomain.com/?generate_wpo_wcpdf=invoice&order_ids=${orderId}`;

    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`,
      {
        chat_id: process.env.CHAT_ID,
        document: invoiceUrl,
        caption: `New Order #${orderId}`,
      },
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
