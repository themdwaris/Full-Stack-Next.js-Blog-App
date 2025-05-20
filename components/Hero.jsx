import React from "react";

const Hero = () => {
  return (
    <div className="w-full text-center py-8 ">
      <div className="max-w-2xl mx-auto mt-8">
        {/* <p className="text-xs text-gray-300">your own blogs</p> */}
        <h1 className="text-5xl md:text-6xl font-semibold py-5 bg-gradient-to-r from-slate-200 to-slate-500 inline-block text-transparent bg-clip-text">
          Explores, our latest blogs
        </h1>
        <p className="text-sm max-w-[500px] mx-auto text-slate-300">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias aliquid, dolorem aut pariatur tenetur vitae porro.
        </p>
        <div className="w-full max-w-xl mt-10">
            <h1 className="text-4xl py-5 font-semibold bg-gradient-to-r from-slate-500 to-slate-200 inline-block text-transparent bg-clip-text">news letter</h1>
           <div className="w-full flex flex-col md:flex-row items-center gap-3">
           <input type="email" placeholder="Enter your email" className="outline-none bg-white/10 w-full p-3 "/>
           <button className="w-full md:w-auto px-4 py-[11px] bg-gradient-to-r from-slate-200 to-slate-500 transition transform active:scale-90 cursor-pointer text-black font-semibold">Subscribe</button>
            </div> 
        </div>
      </div>
    </div>
  );
};

export default Hero;
