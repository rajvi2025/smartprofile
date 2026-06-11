export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">We are here to help you. Reach out to us anytime.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-gray-700">Rajvi Enterprises</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href="mailto:info@smartprofile.in" className="text-blue-600 hover:underline">info@smartprofile.in</a>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <a href="tel:9987029548" className="text-blue-600 hover:underline">9987029548</a>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-700">Villa No. 04, Beverly Park, Kanakia, Mira Road, Thane - 401107, Maharashtra, India</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GST Number</p>
                <p className="text-gray-700">27AKCPP3957F1ZZ</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Support Hours</p>
                <p className="text-gray-700">Monday - Saturday, 10:00 AM - 6:00 PM IST</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Send us a Message</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Your Email" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Subject" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Your Message" rows="4" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
