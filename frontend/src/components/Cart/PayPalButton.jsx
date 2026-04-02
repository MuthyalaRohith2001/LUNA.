import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const PayPalButton = ({ amount, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              { amount: { value: Number(amount || 0).toFixed(2) } },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          if (onError) onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;

{
  /*//note: imported in Checkout.jsx 
//note FLOW:
// Checkout Button
//   ↓
// createOrder
//   ↓
// PayPal approve
//   ↓
// captureOrder
//   ↓
// success page 
    */
}

/**(5.1) */

{
  /**PayPalScriptProvider  hey browser load paypal and keep it ready*/
}
{
  /**PayPalButtons Handles Popups/redirect talks to paypal server */
}
