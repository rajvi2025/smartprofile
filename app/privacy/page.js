export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: July 7, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">Rajvi Enterprises ("we", "us", or "our") operates SmartProfile.in. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-2">We collect the following types of information:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Name, email address, and password during registration</li>
            <li>Business details you provide while creating your profile</li>
            <li>Profile photos, logos, and media uploads</li>
            <li>Usage data and analytics</li>
            <li>Payment information (processed securely via Razorpay)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>To create and manage your SmartProfile</li>
            <li>To process payments and subscriptions</li>
            <li>To send service-related emails and notifications</li>
            <li>To improve our platform and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Sharing</h2>
          <p className="text-gray-600 leading-relaxed">We do not sell your personal data. We may share data with trusted third-party service providers (such as Supabase for database, Razorpay for payments, and Vercel for hosting) solely to operate our service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">We use industry-standard encryption and security practices to protect your data. Passwords are hashed and never stored in plain text.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">We use cookies for session management and analytics. You can disable cookies in your browser settings, though some features may not work properly.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Your Rights</h2>
          <p className="text-gray-600 leading-relaxed">You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at info@smartprofile.in.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">For privacy-related queries, contact:<br/>
          <strong>Rajvi Enterprises</strong><br/>
          Villa No. 04, Beverly Park, Kanakia, Mira Road, Thane - 401107, Maharashtra, India<br/>
          Email: info@smartprofile.in<br/>
          Phone: 9987029548</p>
        </section>
      </div>
    </div>
  );
}


