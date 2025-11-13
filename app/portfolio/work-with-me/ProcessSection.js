'use client';

export default function ProcessSection() {
  const steps = [
    {
      number: '01',
      title: 'Discovery & Planning',
      description: 'We start by understanding your goals, target audience, and project requirements through detailed discussions and research.',
      icon: 'ri-lightbulb-line'
    },
    {
      number: '02',
      title: 'Design & Prototyping',
      description: 'I create wireframes, mockups, and interactive prototypes to visualize the final product before development begins.',
      icon: 'ri-pencil-ruler-2-line'
    },
    {
      number: '03',
      title: 'Development & Testing',
      description: 'Clean, scalable code is written with regular testing and quality assurance throughout the development process.',
      icon: 'ri-code-box-line'
    },
    {
      number: '04',
      title: 'Launch & Optimization',
      description: 'After thorough testing, we launch your project and continue to monitor and optimize for peak performance.',
      icon: 'ri-rocket-line'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">My Process</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A proven methodology that ensures your project is delivered on time, 
            within budget, and exceeds expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 flex items-center justify-center bg-blue-600 rounded-full mx-auto mb-4">
                  <i className={`${step.icon} text-3xl text-white`}></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full border-2 border-blue-600 text-blue-600 font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}