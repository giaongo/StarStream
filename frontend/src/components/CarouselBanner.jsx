import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import React from "react";
import banner_1 from "../assets/banner_1.jpg";
import banner_2 from "../assets/banner_2.png";
import banner_3 from "../assets/banner_3.jpg";

const CarouselBanner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const slides = [
    {
      id: 1,
      src: banner_1,
      alt: "Banner 1",
      title: " Seamless Live Streaming from Server to Screen!",
    },
    {
      id: 2,
      src: banner_2,
      alt: "Banner 2",
      title:
        "Your Stream, Your Control – Robust Server, Intuitive Web Platform!",
    },
    {
      id: 3,
      src: banner_3,
      alt: "Banner 3",
      title:
        "The Future of Streaming – Built for Performance, Designed for Ease!",
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: "85%",
          margin: "auto",
        }}
      >
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="carousel-slide">
              <img
                src={slide.src}
                alt={slide.alt}
                style={{
                  width: "100%",
                  height: "500px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  filter: "brightness(50%)",
                }}
              />
              <Box>
                <Typography
                  variant="h2"
                  textAlign="center"
                  className="carousel-text"
                >
                  {slide.title}
                </Typography>
              </Box>
            </div>
          ))}
        </Slider>
      </Box>
    </>
  );
};

export default CarouselBanner;
