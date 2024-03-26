"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadScript from "../utils/loadScript";
function Products() {


  const amount = 500;
  const currency = "INR";
  const receiptId = "quicklftReceipt";
  const makePayment = async (e) => {
    const response = await fetch("http://localhost:8000/rayzorpay/Order", {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log("this is line 27", order.order.id);

    let options = {
      key: "rzp_test_dSGUgBKlIU2Ecm",
      amount: amount,
      currency: currency,
      name: "Qickly",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.order.id,
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          "http://localhost:8000/rayzorpay/Order/verify",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes);
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  };

  useEffect(() => {
    const loadRayzorPaymentScript = async () => {
      await LoadScript("https://checkout.razorpay.com/v1/checkout.js");
    };
    loadRayzorPaymentScript();
  }, []);
  return (
    <div className="flex justify-center flex-col items-center gap-[10px]">
      <h2>Tshirt</h2>
      <p>Solid Blue cotton Tshirt</p>
      <Image src="/vercel.svg" width={100} height={100} alt="About Tshirt" />
      <button
        className="bg-orange-900 h-[60px] w-[200px] text-white rounded-xl"
        onClick={makePayment}
      >
        Pay
      </button>
    </div>
  );
}

export default Products;
