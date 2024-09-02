import React from "react";

function Activity() {
  return (
    <section className="w-full flex flex-col lg:items-center relative">
      <div className="w-full flex lg:justify-center">
        <div className="flex flex-col items-center p-[40px_16px]">
          <h3 className="text-head3 lg:text-head2 text-center text-black ">
            "Your Pets, Our Priority: Perfect Care, Anytime, Anywhere."
          </h3>

          <div className="flex flex-col gap-10 py-[40px] md:flex-row md:justify-between items-center xl:w-[1064px] grow">
            <div className="flex flex-col gap-6 py-4 lg:w-[454px] p-[40px_0px] md:gap-[55px]">
              <div className="flex gap-3">
                <img src="/star-blue.png" className="w-[24px] h-[24px]" />
                <div className="flex flex-col gap-3">
                  <h4 className="text-black text-head4">Boarding</h4>
                  <p className="text-gray-500 text-body2">
                    Your pets stay overnight in your sitter’s home. They’ll be
                    treated like part of the family in a comfortable
                    environment.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <img src="/star-pink.png" className="w-[24px] h-[24px]" />
                <div className="flex flex-col gap-3">
                  <h4 className="text-black text-head4">House Sitting</h4>
                  <p className="text-gray-500 text-body2">
                    Your sitter takes care of your pets and your home. Your pets
                    will get all the attention they need without leaving home.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <img src="/star-green.png" className="w-[24px] h-[24px]" />
                <div className="flex flex-col gap-3">
                  <h4 className="text-black text-head4">Dog Walking</h4>
                  <p className="text-gray-500 text-body2">
                    Your dog gets a walk around your neighborhood. Perfect for
                    busy days and dogs with extra energy to burn.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <img src="/star-yellow.png" className="w-[24px] h-[24px]" />
                <div className="flex flex-col gap-3">
                  <h4 className="text-black text-head4">Drop-In Visits</h4>
                  <p className="text-gray-500 text-body2">
                    Your sitter drops by your home to play with your pets, offer
                    food, and give potty breaks or clean the litter box.
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="flex justify-center"> */}
            <img
              src="/cat-content.png"
              className="lg:w-[455px] lg:h-[601px] w-[349px] h-[453px] "
            />
            {/* </div> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col py-10 items-center justify-center">
        <div className="flex flex-col gap-10 px-4 md:flex-row md:justify-between xl:w-[1440px] lg:px-20">
          <div className="flex flex-col px-6 gap-[46px] items-center xl:w-[416px]">
            <img
              src="/connect.png"
              className="w-[200px] h-[200px] rounded-full lg:w-[268px] lg:h-[268px]"
            />
            <div className="flex flex-col gap-4 items-center">
              <h3 className="text-head3 text-green-500 text-center">
                Connect{" "}
                <span className="text-black text-head3">With Sitters</span>
              </h3>

              <p className="text-gray-500 text-body1 text-center">
                Find a verified and reviewed sitter who’ll keep your pets
                company and give time.
              </p>
            </div>
          </div>
          <div className="flex flex-col px-6 gap-[46px] items-center xl:w-[416px]">
            <img
              src="/better.png"
              className="w-[200px] h-[200px] rounded-full lg:w-[268px] lg:h-[268px]"
            />
            <div className="flex flex-col gap-4 items-center">
              <h3 className="text-head3 text-blue-500 text-center">
                Better{" "}
                <span className="text-black text-head3">For Your Pets</span>
              </h3>

              <p className="text-gray-500 text-body1 text-center">
                Pets stay happy at home with a sitter who gives them loving care
                and companionship.
              </p>
            </div>
          </div>
          <div className="flex flex-col px-6 gap-[46px] items-center xl:w-[416px]">
            <img
              src="/calling.png"
              className="w-[200px] h-[200px] rounded-full lg:w-[268px] lg:h-[268px]"
            />
            <div className="flex flex-col gap-4 items-center">
              <h3 className="text-head3 text-orange-500 text-center">
                Calling <span className="text-black text-head3">All Pets</span>
              </h3>

              <p className="text-gray-500 text-body1 text-center px-2">
                Stay for free with adorable animals in unique homes around the
                world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Activity;
