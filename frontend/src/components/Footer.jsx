
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

        {/* Left Section */}
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-5">
            Medicare
          </h1>

          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Medicare is a healthcare appointment booking
            platform that connects patients with trusted
            doctors. Find specialists, book appointments
            and manage your healthcare with ease.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-xl font-medium mb-5">Company</p>

          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link to="/" onClick={() => window.scrollTo(0, 0)}
                className="hover:text-blue-600 transition-all">
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" onClick={() => window.scrollTo(0, 0)}
                className="hover:text-blue-600 transition-all">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}
                className="hover:text-blue-600 transition-all">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)}
                className="hover:text-blue-600 transition-all">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>

          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Contact Medicare</li>
            <li>Healthcare Appointment System</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-600">
          Copyright © {currentYear} Medicare
          - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
