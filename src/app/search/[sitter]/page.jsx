"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ user, review, rating }) => (
  <div className="flex mb-4 p-[24px_24px_40px_24px] w-full h-auto rounded-lg shadow">
    <div className="flex items-center mb-2">
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
      <div>
        <p className="font-semibold">{user}</p>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-600">{review}</p>
  </div>
);

const PetSitterProfile = ({ sitterId }) => {
  const { sitter } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const ratingList = [5, 4, 3, 2, 1];
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/pet-sitter/${sitter}/review`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data); // Assuming the API returns an array of reviews
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to fetch reviews");
      }
    };
    fetchReviews();
  }, [sitter]);

  useEffect(() => {
    if (sitter) {
      fetch(`/api/search/${sitter}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setProfile(data[0]);
          }
        })
        .catch((err) => {
          setError("Failed to fetch profile data");
          console.error(err);
        });
    }
  }, [sitter]);

  if (error) return <div>Error: {error}</div>;
  if (!profile || !reviews) return <div>Loading...</div>;

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      <div className="flex justify-center my-4">
        {profile.images && profile.images.length > 0 ? (
          profile.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Profile image ${index + 1}`}
              className="m-2 w-[15%]"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
      <div className="text-body2 flex justify-center max-lg:flex-col-reverse max-lg:items-center gap-4">
        <div className="mx-10 p-2 w-[40%] font-sans h-auto flex flex-col gap-12">
          <h1 className="text-head1 font-bold mb-4">{profile.trade_name}</h1>
          <section className="mb-8">
            <h2 className="text-head3 font-semibold mb-2">Introduction</h2>
            <p className="text-gray-700">{profile.introduction}</p>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-head3 font-semibold mb-2">Services</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-semibold">🐱 Cat Sitting</h3>
                <p className="text-gray-700">Cat</p>
              </li>
              <li>
                <h3 className="font-semibold">🐶 Dog Sitting</h3>
                <p className="text-gray-700">Dog</p>
              </li>
              <li>
                <h3 className="font-semibold">🐇 Rabbit Sitting</h3>
                <p className="text-gray-700">Rabbit</p>
              </li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-head3 font-semibold mb-2">My Place</h2>
            <p className="text-gray-700 mb-4">{profile.place}</p>
            <div className="bg-gray-100 p-4 rounded-lg relative">
              <img
                src="/api/placeholder/400/200"
                alt="Map placeholder"
                className="w-full h-48 object-cover rounded"
              />
              <div className="absolute bottom-6 left-6 bg-white py-2 px-4 rounded-full shadow flex items-center">
                <span className="font-semibold">See Map</span>
              </div>
            </div>
          </section>
        </div>
        <div className="bg-white h-full flex flex-col rounded-lg w-[416px] overflow-hidden shadow-md p-[40px_24px_24px_24px] gap-6">
          <div className="relative flex justify-center">
            <img
              src={profile.profile_image}
              alt="Profile picture"
              className="w-[160px] h-[160px] rounded-full border-4"
            />
          </div>
          <div className="py-4 px-6 text-center flex flex-col h-[202px] gap-[4px]">
            <h2 className="text-head2 font-bold mb-2">{profile.trade_name}</h2>
            <p className="text-gray-600 text-head4 justify-center flex font-bold gap-[4px]">
              {profile.name}
              <span className="text-green-500">1.5 Years Exp.</span>
            </p>
            <div className="flex justify-center items-center text-gray-500 mb-4">
              <span>Senanikom, Bangkok</span>
            </div>
            <div className="flex justify-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Dog
              </span>
              <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                Cat
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                Rabbit
              </span>
            </div>
          </div>
          <div className="text-[16px] font-bold leading-[24px] h-auto w-full overflow-hidden border-t-[1px] pt-6 flex justify-center gap-4">
            <button className="w-[176px] h-auto bg-orange-100 text-gray-800 rounded-lg p-[12px_24px_12px_24px] hover:bg-gray-200 transition duration-300">
              Send Message
            </button>
            <button className="w-[176px] h-auto bg-orange-500 text-white rounded-lg p-[12px_24px_12px_24px] hover:bg-orange-600 transition duration-300">
              Book Now
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full mx-auto p-6">
          <div className="bg-white p-4 rounded-xl mb-6 flex items-center">
            <div className="flex items-center gap-10">
              <svg
                width="146"
                height="146"
                viewBox="0 0 146 146"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M70.4499 145.956C31.314 144.613 0 112.463 0 72.9999C0 32.6832 32.6832 0 72.9999 0C113.317 0 146 32.6832 146 72.9999C146 73.6843 145.99 74.3665 145.972 75.0463L146 75.0199V146H70.4031L70.4499 145.956Z"
                  fill="black"
                />
              </svg>
              <div className="w-full flex flex-col gap-4">
                <h2 className="text-head3 font-semibold">Rating & Reviews</h2>
                <div className="flex items-center gap-3">
                  <p className="px-1 py-1 w-auto h-auto text-orange-500 border-[1px] rounded border-orange-500">
                    1 Review
                  </p>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <p className="text-4 font-bold leading-6 text-gray-600">
                      Rating:
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {ratingList.map((num, index) => {
                        return (
                          <div
                            className={`flex gap-1 items-center border rounded-md p-[4px_8px] cursor-pointer
                            `}
                            onClick={() => handleToggle(num)}
                            key={index}
                          >
                            {/* <div
                            className={`flex gap-1 items-center border rounded-md p-[4px_8px] cursor-pointer
                               ${
                              search.rating.includes(num)
                                ? "border-orange-500"
                                : ""
                            }
                            `}
                            onClick={() => handleToggle(num)}
                            key={index}
                          > */}
                            <p>
                              {/* <p
                              className={` ${
                                search.rating.includes(num)
                                  ? "text-orange-500"
                                  : "text-gray-400"
                              }`}
                            > */}
                              {num}
                            </p>
                            {Array.from({ length: num }).map((_, index) => {
                              return (
                                <FaStar
                                  className="text-green-500 w-[20px] h-[20px]"
                                  key={index}
                                />
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.round(reviews.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  user={review.user}
                  review={review.review}
                  rating={review.rating}
                />
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetSitterProfile;
