import React from "react";
import ContactFormSection from "../components/core/About/ContactFormSection";
import about1 from "../assets/Images/aboutus1.webp";
import about2 from "../assets/Images/aboutus2.webp";
import about3 from "../assets/Images/aboutus3.webp";
import HighLightText from "../components/core/HomePage/HighLightText";
import Footer from "../components/common/Footer";
import Quote from "../components/core/About/Quote";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponent from "../components/core/About/StatsComponent";
import LearningGrid from "../components/core/About/LearningGrid";
import ReviewSlider from "../components/common/ReviewSlider";

export const About = () => {
  return (
    <div className="flex flex-col">
      {/* section1 */}
      <section className="bg-richblack-800 ">
        <div className="mt-16 w-11/12 mx-auto max-w-maxContent  ">
          <div className="flex flex-col  text-3xl mx-auto items-center">
            <h1 className="text-richblack-5 font-bold text-center ">
              Driving Innovation in Online Education for a
            </h1>

            <HighLightText text={"Brighter Future"}></HighLightText>
            <p className="text-richblack-400 text-center mt-6 text-[18px] font-bold  leading-snug  space-x-1 w-[78%] mx-auto ">
              Studynotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </div>
          <div className="w-[100%] flex justify-center gap-4 flex-col lg:flex-row  mt-4 lg:translate-y-[20%] ">
            <img src={about1} alt="about1"></img>
            <img
              src={about2}
              alt="about2"
              className="shadow-[0_0_35px_0] shadow-[#e77575]"
            ></img>
            <img src={about3} alt="about3"></img>
          </div>
        </div>
      </section>
      {/* section2 */}

      <Quote></Quote>
      {/* section3 */}
      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>

            <div>
              <img
                src={FoundingStory}
                alt=""
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuals can connect, collaborate, and learn from one
                another. We believe that knowledge thrives in an environment of
                sharing and dialogue, and we foster this spirit of collaboration
                through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* section4 */}
      <section>
        <StatsComponent></StatsComponent>
      </section>
      {/* section5 */}
      <section className="w-11/12 mx-auto max-w-maxContent ">
        <LearningGrid></LearningGrid>
      </section>
      <ContactFormSection />

      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        {/* Review Slider here */}
        <ReviewSlider />
      </div>
      <Footer></Footer>
    </div>
  );
};
