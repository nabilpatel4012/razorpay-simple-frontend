import { useState } from "react";
import axios from "axios";
import "./App.css";

const keyId = import.meta.env.VITE_KEY_ID;

function App() {
  const [accountId, setAccountId] = useState("");
  async function displayRazorpay() {
    try {
      const response = await axios.post("http://localhost:3000/razorpay", {
        acctId: accountId,
      });
      const order_id = response.data.id;
      const amount = parseInt(response.data.amount);
      const currency = response.data.currency;
      console.log(response.data);
      console.log(amount);
      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "TekGeminus Solutions Pvt Ltd",
        description: "Test Transaction",
        image:
          "https://www.tekgeminus.com/wp-content/uploads/2023/01/Tek_P3_Logo-300x40.png",
        order_id: order_id,
        handler: async function (res) {
          try {
            const response = await verifyPayment(
              res.razorpay_payment_id,
              res.razorpay_order_id,
              res.razorpay_signature
            );
            console.log(response);
            if (response.data.status === "success") {
              alert("Payment Successful");
            } else {
              alert("Payment Verification Failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("An error occurred while verifying the payment");
          }
          // alert(res.razorpay_payment_id);
          // alert(res.razorpay_order_id);
          // alert(res.razorpay_signature);
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
      const rzpPayment = new window.Razorpay(options);
      rzpPayment.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      rzpPayment.open();
    } catch (error) {
      console.error("Error fetching order_id:", error);
      alert("Failed to fetch order_id");
    }
  }
  async function verifyPayment(payment_id, order_id, razorpay_signature) {
    const res = await axios.post("http://localhost:3000/verify", {
      razorpay_payment_id: payment_id,
      razorpay_order_id: order_id,
      razorpay_signature: razorpay_signature,
    });
    return res;
  }
  return (
    <>
      <input
        type="number"
        placeholder="account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      ></input>
      <button onClick={displayRazorpay}>PayNow</button>
    </>
  );
}

export default App;
