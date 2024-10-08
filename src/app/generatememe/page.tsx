"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../loading";

interface GeneratorProps {
  searchParams: {
    url: string;
    boxCount: string;
    id: string;
    name: string;
  };
}

const MemeGeneratorPage = ({ searchParams }: GeneratorProps) => {
  const { url, id, boxCount, name } = searchParams;
  const [loading, setLoading] = useState<boolean>(false);
  const [inputTexts, setInputTexts] = useState<string[]>([]);
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (boxCount) {
      const count = parseInt(boxCount);
      setInputTexts(Array(count).fill(" "));
    }
  }, [boxCount]);

  const handleInput = (index: number, value: string) => {
    const updatedInp = [...inputTexts];
    updatedInp[index] = value;
    setInputTexts(updatedInp);
  };

  const generateMeme = async () => {
    setLoading(true);
    try {
      inputTexts.forEach((_, i) => (inputTexts[i] = inputTexts[i].trim()));
      const params = new URLSearchParams();
      params.append("template_id", id!);
      params.append("username", "abdulsameed");
      params.append("password", "sameed123");

      inputTexts.forEach((text, index) => {
        params.append(`boxes[${index}][text]`, text);
        params.append(`boxes[${index}][max_font_size]`, "25");
      });

      const response = await fetch(
        `https://api.imgflip.com/caption_image?${params.toString()}`,
        { method: "POST" }
      );
      const result = await response.json();

      if (result.success) {
        setMemeUrl(result.data.url);
        const imageResponse = await fetch(result.data.url);
        const blob = await imageResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
        setDownloadUrl(blobUrl);
      } else {
        console.error("Error generating meme:", result.error_message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while generating the meme. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[24px] sm:text-[34px] py-4 text-gray-800 font-bold">
          Meme Template: <span className="text-indigo-600">{name}</span>
        </h2>

        {/* Template Image */}
        {url && !memeUrl && (
          <div className="m-auto flex justify-center p-6">
            <Image
              className="rounded-lg shadow-lg"
              src={url}
              width={450}
              height={450}
              alt="Meme Template"
            />
          </div>
        )}

        {/* Generated Meme */}
        {memeUrl && (
          <div className="m-auto mt-10 flex flex-col items-center">
            <Image
              className="rounded-lg border-4 border-indigo-500 shadow-xl"
              src={memeUrl}
              width={500}
              height={500}
              alt={name}
            />
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={name}
                className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition duration-300 ease-in-out"
              >
                Download Meme
              </a>
            )}
          </div>
        )}

        {/* Input Fields */}
        <div className="mt-12 bg-white p-8 rounded-xl shadow-lg w-full sm:w-3/4 lg:w-1/2 mx-auto">
          <h3 className="text-center text-2xl font-semibold text-gray-700 mb-6">
            Enter Meme Text
          </h3>
          {inputTexts.map((_, index) => (
            <input
              type="text"
              key={index}
              onChange={(e) => handleInput(index, e.target.value)}
              placeholder={`Text for box ${index + 1}`}
              className="input input-bordered input-primary w-full mb-4 px-4 py-2 text-lg rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          ))}
          <button
            onClick={generateMeme}
            className={`w-full py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition duration-300 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating Meme..." : "Generate Meme"}
          </button>
        </div>
      </div>
    </>
  );
};

export default MemeGeneratorPage;
