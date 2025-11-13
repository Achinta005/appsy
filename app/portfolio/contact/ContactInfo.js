"use client";
import socialLinks from "./socialLink.json";

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: "ri-mail-line",
      title: "Email",
      details: "achintahazra815@gmail.com",
      description: "Send me an email anytime!",
      onClick: () => window.open("mailto:achintahazra8515@gmail.com"),
    },
    {
      icon: "ri-phone-line",
      title: "Phone",
      details: "+91 7602699715",
      description: "Mon-Fri from 8am to 6pm",
      onClick: () => window.open("tel:+917602699715"),
    },
    {
      icon: "ri-map-pin-line",
      title: "Location",
      details: "Arambagh West Bengal",
      description: "Available for remote work",
      onClick: () => window.open("https://www.google.com/maps/search/?api=1&query=Arambagh+West+Bengal"),
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-200 mb-6">
            Let&apos;s Connect
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            I&apos;m always open to discussing new opportunities, creative
            projects, or potential collaborations. Don&apos;t hesitate to reach
            out!
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="flex items-start">
              <div
                className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg mr-4 flex-shrink-0 cursor-pointer"
                onClick={method.onClick}
                title={method.title}
              >
                <i className={`${method.icon} text-xl text-green-600`}></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-1 ">
                  {method.title}
                </h3>
                <p className="text-blue-600 font-medium mb-1">
                  {method.details}
                </p>
                <p className="text-gray-300 text-sm ">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
