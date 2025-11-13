"use client";
import React from "react";
import { useState, useEffect } from "react";
import { GlowingEffect } from "@/components/ui/glowEffect";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
} from "@material-tailwind/react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const useInView = () => {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsInView(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  return isInView;
};

const MotionDiv = ({ children, initial, whileInView, transition, className }) => {
  const isInView = useInView();
  
  return (
    <div 
      className={`transition-all duration-700 ${
        isInView 
          ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
          : 'opacity-0 translate-x-[-50px] sm:translate-x-[-150px] translate-y-4 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function EducationSection({educationData}) {

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      <div className="min-h-screen backdrop-blur-md bg-black/20 border-t border-white/10">
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
            
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <MotionDiv
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto shadow-2xl mb-4 sm:mb-8">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                    Education
                  </h2>
                </div>
              </MotionDiv>
              
              <MotionDiv
                initial={{ opacity: 0, x: -150 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto shadow-xl">
                  <p className="text-sm sm:text-lg lg:text-xl text-gray-200">
                    My academic foundation in computer science and continuous learning journey.
                  </p>
                </div>
              </MotionDiv>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 shadow-2xl overflow-hidden grid justify-center">
              <div className="w-full relative ">
                <Timeline className="relative">
                  {educationData.map((edu, index) => (
                    <TimelineItem key={index} className="relative z-10">
                      
                      {index < educationData.length - 1 && (
                        <div className="absolute left-4 sm:left-6 top-12 sm:top-14 w-0.5 h-40 sm:h-48 lg:h-56 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 z-0"></div>
                      )}

                      <TimelineConnector className="hidden" />
                      <TimelineHeader>
                        <TimelineIcon className="p-1 sm:p-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 rounded-full overflow-hidden">
                            <img
                              src={
                                index === 2
                                  ? "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/icons8-circle-48_jip8cm.png"
                                  : "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345763/icons8-checkmark-48_wgk7ka.png"
                              }
                              width={30}
                              height={30}
                              alt="Education Icon"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TimelineIcon>
                        <Typography
                          variant="h5"
                          color="blue-gray"
                          className="text-blue-200 font-semibold text-sm sm:text-base lg:text-lg"
                        >
                          {edu.year}
                        </Typography>
                      </TimelineHeader>
                      
                      <TimelineBody className="pb-6 sm:pb-8">
                        <MotionDiv
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="flex justify-center p-0 rounded-lg shadow-lg w-full pointer-events-none">
                            <div className="relative shadow-2xl w-full max-w-full sm:max-w-2xl lg:max-w-3xl object-cover object-top rounded-xl sm:rounded-2xl lg:rounded-3xl pointer-events-auto backdrop-blur-lg bg-white/10 border border-white/20 p-2 sm:p-3">
                              <GlowingEffect
                                spread={60}
                                glow={true}
                                disabled={false}
                                proximity={40}
                                inactiveZone={0.01}
                                borderWidth={2}
                              />

                              <div className="border-0.75 relative flex h-full w-full flex-col justify-between gap-3 sm:gap-4 lg:gap-6 overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-8">
                                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 lg:gap-6">
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center backdrop-blur-md bg-white/20 border border-white/30 rounded-lg flex-shrink-0 overflow-hidden border-2 sm:border-4 border-amber-50 mx-auto sm:mx-0">
                                    <img
                                      src={edu.icon}
                                      width={96}
                                      height={96}
                                      alt="Education Icon"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 text-center sm:text-left min-w-0">
                                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-100 mb-1 sm:mb-2 break-words">
                                      {edu.degree}
                                    </h3>
                                    <p className="text-green-400 font-semibold mb-1 text-sm sm:text-base break-words">
                                      {edu.university}
                                    </p>
                                    <p className="text-gray-200 font-semibold mb-1 text-sm sm:text-base break-words">
                                      {edu.college}
                                    </p>
                                    <p className="text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">
                                      {edu.year}
                                    </p>
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed break-words">
                                      {edu.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </MotionDiv>
                      </TimelineBody>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}