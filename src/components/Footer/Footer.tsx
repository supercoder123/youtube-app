import React from "react";

function Icon({ name, ...props }: { name: string, [props: string]: any }) {
  switch (name) {
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0"
          viewBox="0 0 1024 1024"
          {...props}
        >
          <path
            stroke="none"
            d="M512 306.9c-113.5 0-205.1 91.6-205.1 205.1S398.5 717.1 512 717.1 717.1 625.5 717.1 512 625.5 306.9 512 306.9zm0 338.4c-73.4 0-133.3-59.9-133.3-133.3S438.6 378.7 512 378.7 645.3 438.6 645.3 512 585.4 645.3 512 645.3zm213.5-394.6c-26.5 0-47.9 21.4-47.9 47.9s21.4 47.9 47.9 47.9 47.9-21.3 47.9-47.9a47.84 47.84 0 00-47.9-47.9zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zm-88 235.8c-7.3 18.2-16.1 31.8-30.2 45.8-14.1 14.1-27.6 22.9-45.8 30.2C695.2 844.7 570.3 840 512 840c-58.3 0-183.3 4.7-235.9-16.1-18.2-7.3-31.8-16.1-45.8-30.2-14.1-14.1-22.9-27.6-30.2-45.8C179.3 695.2 184 570.3 184 512c0-58.3-4.7-183.3 16.1-235.9 7.3-18.2 16.1-31.8 30.2-45.8s27.6-22.9 45.8-30.2C328.7 179.3 453.7 184 512 184s183.3-4.7 235.9 16.1c18.2 7.3 31.8 16.1 45.8 30.2 14.1 14.1 22.9 27.6 30.2 45.8C844.7 328.7 840 453.7 840 512c0 58.3 4.7 183.2-16.2 235.8z"
          ></path>
        </svg>
      );
    case 'facebook':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0"
          className="h-5 w-5 md:h-8 md:w-8"
          viewBox="0 0 320 512"
          {...props}
        >
          <path
            stroke="none"
            d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
          ></path>
        </svg>
      )
    case 'vimeo':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          {...props}
        >
          <path
            stroke="none"
            d="M447.8 153.6c-2 43.6-32.4 103.3-91.4 179.1-60.9 79.2-112.4 118.8-154.6 118.8-26.1 0-48.2-24.1-66.3-72.3C100.3 250 85.3 174.3 56.2 174.3c-3.4 0-15.1 7.1-35.2 21.1L0 168.2c51.6-45.3 100.9-95.7 131.8-98.5 34.9-3.4 56.3 20.5 64.4 71.5 28.7 181.5 41.4 208.9 93.6 126.7 18.7-29.6 28.8-52.1 30.2-67.6 4.8-45.9-35.8-42.8-63.3-31 22-72.1 64.1-107.1 126.2-105.1 45.8 1.2 67.5 31.1 64.9 89.4z"
          ></path>
        </svg>
      );
    case 'youtube':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0"
          {...props}
          viewBox="0 0 1024 1024"
        >
          <path d="M941.3 296.1a112.3 112.3 0 00-79.2-79.3C792.2 198 512 198 512 198s-280.2 0-350.1 18.7A112.12 112.12 0 0082.7 296C64 366 64 512 64 512s0 146 18.7 215.9c10.3 38.6 40.7 69 79.2 79.3C231.8 826 512 826 512 826s280.2 0 350.1-18.8c38.6-10.3 68.9-40.7 79.2-79.3C960 658 960 512 960 512s0-146-18.7-215.9zM423 646V378l232 133-232 135z"></path>
        </svg>
      );
    case 'email':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0"
          viewBox="0 0 1024 1024"
          {...props}
        >
          <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0068.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z"></path>
        </svg>
      )
  }

  return null;
}

interface HoverIconProps {
  name: string;
  hoverText: string;
  href: string;
}

const HoverIcon = ({ name, hoverText, href }: HoverIconProps) => {
  return (
    <a className="mx-1 md:mx-4 relative" href={href} rel="noreferrer" target="_blank">
      <div className="group cursor-pointer flex justify-center">
        <p className="absolute -top-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition mb-1 text-center">{hoverText}</p>

        <div className="rounded-md group-hover:bg-white w-fit mx-auto p-1 group-hover:text-black transition-colors ease-in">
          <Icon className="h-5 w-5 md:h-8 md:w-8" name={name} />
        </div>
      </div>
    </a>);
};

const Footer = () => {
  return (
    <footer className="text-white h-24 sm:h-36 w-full sm:p-6 sm:pb-8 flex items-center">
      <div className="flex mx-auto justify-center">
        <HoverIcon name="youtube" hoverText="Subscribe" href="https://www.youtube.com/channel/UCDt-2KorfMpzLf-CX71n18A?sub_confirmation=1" />
        <HoverIcon name="facebook" hoverText="Facebook" href="https://www.facebook.com/LeftHandRightFilms" />
        <HoverIcon name="instagram" hoverText="Instagram" href="https://vimeo.com/user71836566" />
        <HoverIcon name="vimeo" hoverText="Vimeo" href="https://vimeo.com/user71836566" />
        <HoverIcon name="email" hoverText="Email" href="mailto:info@lefthandright.in" />
      </div>
    </footer>
  );
};

export default Footer;
