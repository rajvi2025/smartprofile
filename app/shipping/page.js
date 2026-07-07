export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping & Delivery Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: July 7, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Applicability</h2>
          <p className="text-gray-600 leading-relaxed">This Shipping & Delivery Policy applies only to physical NFC Smart Cards purchased through SmartProfile.in. Digital subscription plans (Basic, Business, Premium, Pro) are delivered instantly online and are not covered by this policy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Order Processing Time</h2>
          <p className="text-gray-600 leading-relaxed">NFC Smart Card orders are processed and dispatched within 2-4 business days of successful payment and confirmation of card details.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Delivery Timeline</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Metro cities: 4-7 business days from dispatch</li>
            <li>Other locations across India: 5-10 business days from dispatch</li>
            <li>Delivery timelines are estimates and may vary due to courier delays or logistical disruptions beyond our control</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Shipping Charges</h2>
          <p className="text-gray-600 leading-relaxed">Shipping charges, if applicable, will be clearly displayed at checkout before payment. We may offer free shipping during select promotional periods.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Shipping Coverage</h2>
          <p className="text-gray-600 leading-relaxed">We currently ship NFC Smart Cards to all serviceable pin codes within India via our courier partners. International shipping is not currently supported.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Order Tracking</h2>
          <p className="text-gray-600 leading-relaxed">Once your order is shipped, you will receive a tracking number or link via email or WhatsApp to monitor delivery status.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Delayed or Failed Delivery</h2>
          <p className="text-gray-600 leading-relaxed">If your order has not arrived within the estimated delivery window, or delivery fails due to an incorrect address provided by you, please contact us so we can assist with re-shipping. Additional charges may apply for address errors caused by the customer.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Damaged or Incorrect Items</h2>
          <p className="text-gray-600 leading-relaxed">If you receive a damaged, defective, or incorrect NFC card, please refer to our Refund & Cancellation Policy for replacement or refund eligibility.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact</h2>
          <p className="text-gray-600 leading-relaxed">Rajvi Enterprises, Villa No. 04, Beverly Park, Kanakia, Mira Road, Thane - 401107, Maharashtra, India. Email: info@smartprofile.in | Phone: 9987029548</p>
        </section>
      </div>
    </div>
  );
}