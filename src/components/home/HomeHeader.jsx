import React from "react";

function HomeHeader() {
  return (
    <header className="relative max-sm:h-[565px] sm:h-[865px] lg:h-[500px] border-red  overflow-hidden">
      <div className="flex flex-col items-center gap-6 sm:gap-8 text-center sm:mt-[30px]">
        <h1 className="mt-12 text-[48px] leading-[56px] font-black sm:text-display text-black z-10">
          Pet Sitter<span className="text-orange-500">,</span>
          <br /> Perfect<span className="text-blue-500">,</span>
          <br /> For Your Pet<span className="text-yellow-500">.</span>
        </h1>
        <p className="text-head4 sm:text-head3 text-gray-400 z-10">
          Find your perfect pet sitter with us.
        </p>
      </div>
      <div className="w-full flex justify-center lg:justify-around absolute top-[310px] sm:top-[440px] lg:top-[80px]">
        <div className="w-[226px] h-[255px] relative left-[-54px] sm:left-[0px] sm:w-[428px] sm:h-[441px] ">
          <img
            src="/paw-pink.png"
            className="w-[93.63px] h-[96.63px] absolute left-[132.12px] sm:w-[163px] sm:h-[169px] sm:left-[230px] sm:top-[-5px]"
          />
          <img
            src="/quarter-yellow.png"
            className="w-[67.5px] h-[67.18px] absolute top-[49.5px] left-[38.49px] sm:w-[117.5px] sm:h-[117.5px] sm:left-[67px] sm:top-[81.57px]"
          />
          <img
            src="/3cat-header.png"
            className="w-[145.33px] h-[144.65px] absolute top-[110.1px] left-[64.84px] sm:w-[253px] sm:h-[253px] sm:left-[127.57px] sm:top-[174px]"
          />
          <img
            src="/dotdot.png"
            className="w-[45.38px] h-[25.16px] absolute top-[103.81px] left-[93.06px] sm:w-[79px] sm:h-[44px] sm:left-[162px] sm:top-[162px]"
          />
        </div>
        <div className="w-[226px] h-[255px] relative sm:w-[428px] sm:h-[441px] ">
          <img
            src="/star-orange.png"
            className="w-[92.27px] h-[90.13px] absolute left-[6.38px] sm:w-[159.89px] sm:h-[155.88px] sm:left-[11.05px]"
          />
          <img
            src="/1dog-header.png"
            className="w-[146.01px] h-[146.29px] absolute top-[46.26px] left-[54.82px] sm:w-[253px] sm:h-[253px] sm:left-[95px] sm:top-[80px]"
          />
          <img
            src="/half-circle-green.png"
            className="w-[132.16px] h-[66.21px] absolute top-[188.5px] left-[28.28px] sm:w-[229px] sm:h-[114.5px] sm:left-[49px] sm:top-[326px]"
          />
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
