import React from "react";

const Stats = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];
const StatsComponent = () => {
  return (
    <div className="bg-richblack-700 ">
      <div className="flex lg:flex-row md:flex-row flex-col flex-wrap p-4 gap-5 w-10/12 mx-auto max-w-maxContent justify-between">
        {Stats.map((data, index) => (
          <div
            key={index}
            className="flex flex-col place-items-center p-6  gap-4"
          >
            <h1 className="text-richblack-5 font-bold text-3xl">
              {data.count}
            </h1>
            <p className="text-richblack-400 ">{data.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsComponent;
