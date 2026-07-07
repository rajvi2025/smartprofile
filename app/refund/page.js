export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund & Cancellation Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: July 7, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Subscription Plans</h2>
          <p className="text-gray-600 leading-relaxed">SmartProfile.in offers annual subscription plans — Basic (₹199/yr), Business (₹399/yr), Premium (₹599/yr), and Pro (₹999/yr). All plans are billed annually at the time of purchase.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Refund Eligibility</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Refund requests made within 7 days of purchase will be considered</li>
            <li>If you face a technical issue that we are unable to resolve, a full refund will be issued</li>
            <li>Refunds will not be provided if the service has been actively used</li>
            <li>No refund will be issued after 7 days from the date of purchase</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Cancellation Policy</h2>
          <p className="text-gray-600 leading-relaxed">You may cancel your subscription at any time from your dashboard. Upon cancellation, your profile will remain active until the end of the current billing period. No partial refunds are provided for unused time.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. How to Request a Refund</h2>
          <p className="text-gray-600 leading-relaxed">To request a refund, email us at info@smartprofile.in with your registered email address, order ID, and reason for refund. We will process eligible refunds within 5-7 business days to the original payment method.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Non-Refundable Items</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>NFC card orders once shipped</li>
            <li>Custom domain or branding services</li>
            <li>Subscriptions cancelled after 7 days of purchase</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Contact</h2>
          <p className="text-gray-600 leading-relaxed">Rajvi Enterprises, Villa No. 04, Beverly Park, Kanakia, Mira Road, Thane - 401107, Maharashtra, India. Email: info@smartprofile.in | Phone: 9987029548</p>
        </section>
      </div>
    </div>
  );
}


