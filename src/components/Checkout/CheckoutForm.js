import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import {
  apiUrl
} from "../Settings/Config";

const PaymentModal = ({ show, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "SG",
      currency: "sgd",
      total: {
        label: "Order",
        amount: 500, // $5.00
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
  }, [stripe]);

  useEffect(() => {
    fetch(`${apiUrl}payment/createpaymentintent`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json", 
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({ amount: 100 }),
})
  .then((res) => res.json())
  .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment successful!");
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div style={popupStyle.overlay}>
      <div style={popupStyle.modal}>
        <h2>Payment</h2>

        {paymentRequest && (
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        )}

        <form onSubmit={handleCardSubmit} style={{ marginTop: "20px" }}>
          <CardElement />
          <button type="submit" style={popupStyle.button}>Pay with Card</button>
        </form>

        <button onClick={onClose} style={popupStyle.close}>Close</button>
      </div>
    </div>
  );
};

const popupStyle = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    background: "#fff", padding: "20px", borderRadius: "10px", minWidth: "300px"
  },
  button: { marginTop: "10px", padding: "10px 20px" },
  close: { marginTop: "10px", background: "red", color: "#fff", padding: "5px 10px" }
};

export default PaymentModal;
