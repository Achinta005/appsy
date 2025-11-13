'use client';

import Link from 'next/link';

export default function WorkHero() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold mb-6">Let&apos;s Work Together</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
          Ready to bring your digital vision to life? I offer comprehensive
          development and design services to help your business thrive online.
        </p>
        <Link
          href="/contact"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap inline-block font-semibold"
        >
          Start Your Project
        </Link>
      </div>
    </section>
  );
}