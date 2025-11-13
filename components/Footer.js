"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="dark:text-white py-12 text-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-pacifico text-yellow-100">
              Achinta Hazra
            </h3>
            <p className="font-semibold text-gray-200">
              Building amazing digital experiences with passion and creativity.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-100">
              Quick Links
            </h4>
            <div className="space-y-2">
              <Link
                href="/#home"
                className="text-green-600 hover:text-blue-600 font-semibold dark:hover:text-white transition-colors cursor-pointer block w-fit"
              >
                Home
              </Link>
              <Link
                href="/#about"
                className="text-green-600 hover:text-blue-600 font-semibold dark:hover:text-white transition-colors cursor-pointer block w-fit"
              >
                About
              </Link>
              <Link
                href="/#projects"
                className="text-green-600 hover:text-blue-600 font-semibold dark:hover:text-white  transition-colors cursor-pointer block w-fit"
              >
                Projects
              </Link>
              <Link
                href="/#contact"
                className="text-green-600 hover:text-blue-600 font-semibold dark:hover:text-white transition-colors cursor-pointer block w-fit"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-100">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/achinta-hazra?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                className="dark:text-gray-400 dark:hover:text-white hover:text-blue-600 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 flex items-center justify-center text-green-600">
                  <i className="ri-linkedin-fill"></i>
                </div>
              </a>
              <a
                href="https://github.com/Achinta005"
                className="dark:text-gray-400 dark:hover:text-white  hover:text-blue-600 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 flex items-center justify-center text-green-600">
                  <i className="ri-github-fill"></i>
                </div>
              </a>
              <a
                href="#"
                className="dark:text-gray-400 dark:hover:text-white hover:text-blue-600 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 flex items-center justify-center text-green-600">
                  <i className="ri-twitter-fill"></i>
                </div>
              </a>
              <a
                href="mailto:achintahazra8515@gmail.com"
                className="dark:text-gray-400 dark:hover:text-white hover:text-blue-600 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 flex items-center justify-center text-green-600">
                  <i className="ri-mail-fill"></i>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="dark:text-gray-400 ">
            © 2025 Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
