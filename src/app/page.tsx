import Link from "next/link";
import React from "react";

interface memeData {
  id: string;
  name: string;
  url: string;
  box_count: number;
}

async function MemeGenerator() {
  const data = await fetch("https://api.imgflip.com/get_memes");
  const res = await data.json();
  const meme = await res.data.memes;
  return (
    <>
      <h1 className="text-[#2f3542] text-[33px] text-center font-semibold py-6">
        MEME GENERATOR
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {meme.map((item: memeData) => {
          return (
            <div
              key={item.id}
              className="shadow-lg p-6 m-4 w-full max-w-sm bg-white rounded-lg flex flex-col items-center gap-4 hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-56 object-cover rounded-md"
              />
              <Link
                className="w-full"
                href={{
                  pathname: "generatememe/",
                  query: {
                    url: item.url,
                    boxCount: item.box_count,
                    id: item.id,
                    name: item.name,
                  },
                }}
              >
                <button className="w-full bg-[#16a085] text-white py-2 rounded-lg hover:bg-[#149174] transition-colors duration-300">
                  Create Meme
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default MemeGenerator;
