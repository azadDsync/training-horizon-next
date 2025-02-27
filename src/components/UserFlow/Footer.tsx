import { Instagram, Twitter, Youtube, YoutubeIcon } from "lucide-react";

export default function Footer(){
    return (
        <footer className="bg-white/20">
        <div className="container mx-auto px-6 py-12 text-center md:text-left">
          <div className="justify-center items-start grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Make Me Pro</h4>
              <p className="text-gray-500 mb-4">
                Join our Student Alumni or follow us on social media and stay connected with latest news.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Link</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Teachers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Community</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Get in touch
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-evenly items-center">
            <p className="text-gray-500 text-sm">Copyright © 2023 Training Process All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Privacy policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
                Terms of use
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
}