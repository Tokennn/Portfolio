"use client";
import React from "react";
import { ContainerScroll } from "./container-scroll-animation";
import { ArrowRight } from "lucide-react";

export function HeroScrollDemo() {
  const projects = [
    {
      title: "Langage-Sensei",
      image: "https://cdn.midjourney.com/bf612167-d186-46f9-8141-ad6e799fa243/0_1.png",
      link: "https://langage-sensei.netlify.app/"
    },
    {
      title: "MoveSmart",
      image: "https://cdn.midjourney.com/c5b6d334-83c3-4d27-ace8-00ca180a65ce/0_2.png",
      link: "https://movesmart.netlify.app/"
    }
  ];

  return (
    <div className="flex flex-col overflow-hidden pb-[300px] pt-[800px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white mb-32">
              Découvrez mes <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Projets
              </span>
            </h1>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {projects.map((project, index) => (
            <a 
              href={project.link}
              key={index}
              className="group relative overflow-hidden rounded-lg h-full"
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                draggable={false}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="flex items-center">
                  <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
                </p>
              </div>
            </a>
          ))}
        </div>
      </ContainerScroll>
    </div>
  );
} 