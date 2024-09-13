"use client";

import MainLayout from "@/components/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { Pagination } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";
const ReviewCard = ({ review }) => {
  const { user, created_at, rating, review: reviewText } = review;
  // console.log("review JAA**** อันนี้เวิร์ค", review);

  // Check if the date is valid
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex mb-4 p-[24px_24px_24px_24px] w-full h-auto rounded-lg border-b gap-4">
      <div className="flex w-[220px] max-lg:flex-col max-lg:w-auto items-start gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full "></div>
        <div>
          <p className="font-semibold text-body1">{user}</p>
          <p className="text-body3 text-gray-400"> {formatDate(created_at)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[70%]">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "text-green-500" : "text-gray-300"}
            />
          ))}
        </div>
        <p className="text-gray-500 text-body2">{reviewText}</p>
      </div>
    </div>
  );
};
const PetSitterProfile = ({ sitterId }) => {
  const { data: session, status } = useSession();
  const { sitter } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const ratings = reviews.map((variable) => Number(variable.rating));
  const totalRating = ratings.reduce((acc, curr) => acc + curr, 0);
  const avgRating = ratings.length > 0 ? totalRating / ratings.length : 0;

  const ratingCounts = [
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleBookNow = () => {
    // Router.push("")
    console.log("จะจองแล้วแต่ยังก่อน");
  };
  const handleSendMessage = () => {
    // Router.push("")
    console.log("จะส่งข้อความแล้วแต่ยังก่อน");
  };
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/pet-sitter/${sitter}/review`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to fetch reviews");
    }
  };

  const getSitter = async () => {
    try {
      const response = await axios
        // .get(`/api/search/${sitter}`)
        .get(`/api/search/sitter-profile/${sitter}`)
        .then((response) => {
          const data = response.data;
          if (data.error) {
            setError(data.error);
          } else {
            setProfile(data[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setError("Failed to fetch profile data");
        });
    } catch (error) {
      console.error("Error fetching sitter:", error);
      setError("Failed to fetch sitter");
    }
  };
  useEffect(() => {
    fetchReviews();
    getSitter();
  }, [sitter]);

  if (error) return <div>Error: {error}</div>;
  if (!profile || !reviews) {
    return (
      <div className="flex h-screen justify-center items-center">
        <BeatLoader size={15} color={"#FF7037"} margin={2} />
      </div>
    );
  }

  return (
    <MainLayout session={session}>
      <div className="w-full h-full flex flex-col bg-gray-cat">
        <div className="flex justify-center my-4 pb-4 overflow-hidden">
          {profile.images && profile.images.length > 0 ? (
            <Swiper
              navigation={true}
              modules={[Navigation]}
              slidesPerView={3}
              centeredSlides={true}
              spaceBetween={10}
              initialSlide={1}
              className="mySwiper"
              breakpoints={{
                1: {
                  slidesPerView: 2,
                  spaceBetween: 1,
                },
                1000: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
              }}
            >
              {profile.images.map((image, index) => (
                <SwiperSlide key={index} className="flex justify-center">
                  <img
                    src={image}
                    alt={`Profile image ${index + 1}`}
                    style={{
                      width: "550px",
                      height: "550px",
                    }}
                    className="object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>No images available</p>
          )}
        </div>
        <div className="text-body2 flex justify-evenly max-lg:flex-col-reverse max-lg:items-center gap-4">
          <div className="w-[45%] max-lg:w-[70%]  font-sans h-auto flex flex-col gap-12">
            {/* part A */}
            <h1 className="text-head1 font-bold mb-4">{profile.trade_name}</h1>
            <section className="mb-8">
              <h2 className="text-head3 font-semibold mb-2">Introduction</h2>
              <p className="text-gray-500">{profile.introduction}</p>
            </section>
            <section className="flex flex-col gap-3" text-body2>
              <h2 className="text-head3 font-semibold mb-2">Services</h2>
              <ul className="space-y-4  text-gray-500">
                <li>
                  <h3 className="font-semibold">
                    🐱 Cat Sitting: Cats are fascinating creatures, and I take
                    joy in catering to their independent yet affectionate
                    nature. Whether your feline friend needs playtime, cuddles,
                    or just a cozy spot to relax, I ensure they feel right at
                    home.
                  </h3>
                </li>
                <li>
                  <h3 className="font-semibold">🐶 Dog Sitting</h3>
                  <p className="text-gray-500">Dog</p>
                </li>
                <li>
                  <h3 className="font-semibold">🐇 Rabbit Sitting</h3>
                  <p className="text-gray-500">Rabbit</p>
                </li>
              </ul>
            </section>
            <section className="mb-8">
              <h2 className="text-head3 font-semibold mb-2">My Place</h2>
              <p className="text-gray-500 mb-4">{profile.place}</p>
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
            <div className="bg-gray-100 flex flex-col h-full w-auto p-6  items-start">
              <div className="bg-white gap-10 max-lg:gap-2 rounded-[99px_12px_12px_99px] flex ">
                <div className="relative flex flex-col items-center justify-center p-6">
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
                    <foreignObject x="0" y="0" width="146" height="146">
                      <div className="flex flex-col items-center justify-center w-full h-full p-4">
                        <div className="text-white font-satoshi text-head2 mb-2">
                          {avgRating}
                        </div>
                        <div className="text-white font-satoshi text-body3 ">
                          {ratings.length} reviews
                        </div>
                      </div>
                    </foreignObject>
                  </svg>
                </div>

                <div className="flex flex-col gap-4 w-[70%] max-lg:w-full justify-center">
                  <h2 className="text-head3 ">Rating & Reviews</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="px-3 py-1 text-orange-500 border border-orange-500 rounded-full hover:bg-orange-50">
                      All Reviews
                    </button>
                    {ratingCounts.map(({ stars, count }) => (
                      <button
                        key={stars}
                        className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-lg text-gray-400 text-body-2 hover:bg-gray-50"
                      >
                        <span>{stars}</span>
                        {[...Array(stars)].map((_, i) => (
                          <FaStar key={i} className="text-green-500 w-4 h-4" />
                        ))}
                        {count > 0 && (
                          <span className="ml-1 text-gray-500">({count})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full p-[24px_24px_0px_24px] max-lg:px-0 gap-4">
                <div className="flex flex-col w-full p-[24px_24px_40px_24px] max-lg:px-0 gap-4">
                  {currentReviews.length > 0 ? (
                    currentReviews.map((review, index) => (
                      <ReviewCard key={index} review={review} />
                    ))
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center w-full mb-4">
              {/* Pagination arrow */}
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                size="large"
                shape="rounded"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "99px",
                  marginBottom: "20px",
                  "& .MuiPaginationItem-root": {
                    color: "#AEB1C3", // Color of the page numbers
                    "&.Mui-selected": {
                      backgroundColor: "#FFF1EC", // Background color of the selected page
                      color: "#FF7037", // Color of the selected page number
                    },
                    "&:hover": {
                      backgroundColor: "#FFF1EC",
                      color: "#FF986F", // Color when hovering
                    },
                  },
                  "& .MuiPaginationItem-previousNext": {
                    color: "#AEB1C3", // Color of the next/previous buttons
                    "&:hover": {
                      backgroundColor: "#FFF1EC",
                      color: "#FF986F", // Color when hovering
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white h-full flex flex-col items-center rounded-lg w-auto max-lg:w-[45%] max-md:w-[70%] overflow-hidden shadow-md p-[40px_24px_24px_24px] gap-6">
            <div className="relative flex justify-center">
              <img
                src={profile.profile_image}
                alt="Profile picture"
                className="w-[160px] h-[160px] rounded-full border-4"
              />
            </div>
            <div className="w-auto py-4 px-6 text-center flex flex-col h-auto gap-[4px]">
              <h2 className="text-head2 font-bold mb-2">
                {profile.trade_name}
              </h2>
              <p className="text-gray-600 text-head4 justify-center flex font-bold gap-[4px]">
                {profile.name}
                <span className="text-green-500">
                  {profile.experience} Years Exp.
                </span>
              </p>
              <div className="flex justify-center gap-3 items-center text-gray-500 mb-4">
                <span>
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 13.4 7.05 19.5 7.35 19.76C7.53113 19.9149 7.76165 20.0001 8 20.0001C8.23835 20.0001 8.46887 19.9149 8.65 19.76C9 19.5 16 13.4 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0ZM8 17.65C5.87 15.65 2 11.34 2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.5913 2 11.1174 2.63214 12.2426 3.75736C13.3679 4.88258 14 6.4087 14 8C14 11.34 10.13 15.66 8 17.65ZM8 4C7.20887 4 6.43552 4.2346 5.77772 4.67412C5.11992 5.11365 4.60723 5.73836 4.30448 6.46927C4.00173 7.20017 3.92252 8.00444 4.07686 8.78036C4.2312 9.55628 4.61216 10.269 5.17157 10.8284C5.73098 11.3878 6.44371 11.7688 7.21964 11.9231C7.99556 12.0775 8.79983 11.9983 9.53073 11.6955C10.2616 11.3928 10.8864 10.8801 11.3259 10.2223C11.7654 9.56448 12 8.79113 12 8C12 6.93913 11.5786 5.92172 10.8284 5.17157C10.0783 4.42143 9.06087 4 8 4ZM8 10C7.60444 10 7.21776 9.8827 6.88886 9.66294C6.55996 9.44318 6.30362 9.13082 6.15224 8.76537C6.00087 8.39991 5.96126 7.99778 6.03843 7.60982C6.1156 7.22186 6.30608 6.86549 6.58579 6.58579C6.86549 6.30608 7.22186 6.1156 7.60982 6.03843C7.99778 5.96126 8.39991 6.00087 8.76537 6.15224C9.13082 6.30362 9.44318 6.55996 9.66294 6.88886C9.8827 7.21776 10 7.60444 10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10Z"
                      fill="#AEB1C4"
                    />
                  </svg>
                </span>
                {profile.address}
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
              <button
                className="w-[176px] h-auto bg-orange-100 text-gray-800 rounded-lg p-[12px_24px_12px_24px] hover:bg-gray-200 transition duration-300"
                onClick={handleSendMessage}
              >
                Send Message
              </button>
              <button
                className="w-[176px] h-auto bg-orange-500 text-white rounded-lg p-[12px_24px_12px_24px] hover:bg-orange-600 transition duration-300"
                onClick={handleBookNow}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PetSitterProfile;
