'use client';

export default function ServicesSection() {
  const services = [
    {
      icon: 'ri-code-s-slash-line',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies like React, Next.js, and Node.js.',
      features: ['Responsive Design', 'Performance Optimization', 'SEO Ready', 'Cross-browser Compatible']
    },
    {
      icon: 'ri-smartphone-line',
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile apps that deliver exceptional user experiences.',
      features: ['iOS & Android', 'React Native', 'App Store Deployment', 'Push Notifications']
    },
    {
      icon: 'ri-palette-line',
      title: 'UI/UX Design',
      description: 'User-centered design solutions that combine aesthetics with functionality.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
    },
    {
      icon: 'ri-shopping-cart-line',
      title: 'E-Commerce Solutions',
      description: 'Complete e-commerce platforms with payment processing and inventory management.',
      features: ['Payment Integration', 'Inventory Management', 'Order Processing', 'Analytics']
    },
    {
      icon: 'ri-cloud-line',
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment solutions for modern applications.',
      features: ['AWS/GCP Setup', 'CI/CD Pipelines', 'Database Management', 'Monitoring']
    },
    {
      icon: 'ri-search-eye-line',
      title: 'SEO & Optimization',
      description: 'Technical SEO and performance optimization to improve your online visibility.',
      features: ['Technical SEO', 'Performance Audit', 'Core Web Vitals', 'Analytics Setup']
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Services I Offer</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From concept to deployment, I provide end-to-end solutions 
            tailored to your specific needs and goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mb-6">
                <i className={`${service.icon} text-2xl text-blue-600`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <div className="w-4 h-4 flex items-center justify-center mr-2">
                      <i className="ri-check-line text-green-500"></i>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}