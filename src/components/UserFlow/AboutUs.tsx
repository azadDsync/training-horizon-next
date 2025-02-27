// import Navbar from "../UserFlow/NavBar";
// import Footer from "./Footer";

// const AboutUs = () => {
//   return (
//     <>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />

//         <div className="flex-grow flex flex-col justify-center items-center">
//           <div className="max-w-screen-lg mx-auto p-8 bg-white rounded-lg ">
//           <h2 className="text-5xl p-navbar font-bold text-center">
//                   About <span className="text-blue-500">Us</span>
//                 </h2>
//             <p className="text-lg leading-relaxed text-gray-700 mb-4">
//               Welcome to our website! We are a team of passionate individuals
//               dedicated to providing the best services and products to our
//               customers.
//             </p>
//             <p className="text-lg leading-relaxed text-gray-700 mb-4">
//               Our journey began in [Year], with the goal of [Your Company Goal
//               or Mission]. Since then, we've been committed to [What You Do
//               Best], continuously improving and adapting to the ever-changing
//               market.
//             </p>
//             <p className="text-lg leading-relaxed text-gray-700 mb-4">
//               Our team consists of experts in various fields, including [Field
//               1], [Field 2], and [Field 3]. Together, we strive to deliver
//               exceptional value and exceed our customers' expectations.
//             </p>
//             <p className="text-lg leading-relaxed text-gray-700">
//               Thank you for visiting our site. We look forward to serving you!
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default AboutUs;
import React from "react";
import Navbar from "../UserFlow/NavBar";
import Footer from "./Footer";
// import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="m-10 ">
        <div className="text-center text-2xl pt-10 text-gray-500">
          <p className="text-blue-700 font-bold text-3xl">
            ABOUT <span className="text-gray-600 font-medium ">US</span>
          </p>
        </div>
        <div className="my-5 gap-12 ">
          {/* <img className="w-full md:max-w-[340px] " src="" /> */}
          <div className="flex  justify-center items-center ">
            <div className="gap-6 flex flex-col md:w-2/4 text-md text-gray-800 ">
              <p>
                Welcome to Training-Horizon, your ultimate destination for
                learning and personal development. We are dedicated to providing
                a seamless experience for individuals seeking to enhance their
                skills in various fields such as sports, dance, education,
                programming, and more. Our platform offers a diverse range of
                online and offline courses, tailored to meet the needs of
                learners at every stage of their journey.
              </p>
              <p>
                In addition to our courses, Training-Horizon features a
                convenient facility for booking gyms and rentals, making it easy
                to stay active and pursue your fitness goals. Whether you're
                expanding your knowledge or engaging in hands-on practice,
                Training-Horizon is here to guide and support you every step of
                the way.
              </p>
              <b className="text-gray-700 ">OUR VISION</b>
              <p>
                Our vision at Training-Horizon is to provide a seamless learning
                experience for every user. We strive to bridge the gap between
                learners and experts, making it easier to access courses and
                resources when you need them.{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="text-xl text-center my-10 ">
          <p className="text-blue-700 font-bold text-2xl">
            WHY <span className="text-gray-600  font-semibold">CHOOSE US</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row mb-20 justify-center gap-5">
          <div className="border border-gray-500 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[14px] hover:bg-blue-600 hover:text-white transition-all duration-280 text-gray-800 cursor-pointer ">
            <b>Efficiency:</b>
            <p>
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>
          <div className="border border-gray-500 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[14px] hover:bg-blue-600 hover:text-white transition-all duration-280 text-gray-800 cursor-pointer ">
            <b>Convenience:</b>
            <p>Access to a network of trusted professionals in your area.</p>
          </div>
          <div className="border border-gray-500 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[14px] hover:bg-blue-600 hover:text-white transition-all duration-280 text-gray-800 cursor-pointer ">
            <b>Personalisation:</b>
            <p>
              Tailored recommendations and reminders to help you stay on top.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
