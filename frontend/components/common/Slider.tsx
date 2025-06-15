"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Navigation,
  Pagination,
  EffectCreative,
  EffectCoverflow,
} from "swiper/modules";
import Image from "next/image";

export default function Slider() {
  return (
    <>
      <Swiper
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 0,
          stretch: 150,
          depth: 100,
          modifier: 2.5,
          slideShadows: true,
        }}
        navigation={false}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        loop={true}
        autoplay={true}
        pagination={true}
        modules={[Pagination, Navigation, EffectCoverflow]}
        className="horizionSwiper w-full max-w-[calc(100vw-2rem)]"
      >
        <SwiperSlide>
          <Image
            src="/image.jpg"
            alt="Nature 1"
            width={600}
            height={400}
            style={{
              borderRadius: "40px",
              width: "100%",
              height: "389px",
              objectFit: "cover",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/hero.jpg"
            alt="Nature 2"
            width={600}
            height={400}
            style={{
              borderRadius: "40px",
              width: "100%",
              height: "389px",
              objectFit: "cover",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/hero2.jpg"
            alt="Nature 3"
            width={600}
            height={400}
            style={{
              borderRadius: "40px",
              width: "100%",
              height: "389px",
              objectFit: "cover",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/hero3.jpg"
            alt="Nature 4"
            width={600}
            height={400}
            style={{
              borderRadius: "40px",
              width: "100%",
              height: "389px",
              objectFit: "cover",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/image.jpg"
            alt="Nature 5"
            width={600}
            height={400}
            style={{
              borderRadius: "40px",
              width: "100%",
              height: "389px",
              objectFit: "cover",
            }}
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
