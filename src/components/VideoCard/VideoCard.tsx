import Image from "next/image";
import React, { useRef } from "react";
import { YoutubeVideoItem } from "../../types";
import PlayIcon from "../../assets/images/play-icon.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const VideoCard = ({
  video,
  id,
  index,
}: {
  video: YoutubeVideoItem;
  id: string;
  index: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const title = video.snippet.title;

  const thumbnail =
    video.snippet?.thumbnails?.standard?.url ||
    video.snippet?.thumbnails?.high.url;
  const defaultThumbnail = video.snippet?.thumbnails?.high.url;
  const ref = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : "auto",
  };

  return (
    <>
      <div
        key={video.id}
        style={style}
        ref={setNodeRef}
        className="relative group cursor-grab"
        {...listeners}
        // {...attributes}
      >

        {/* group-hover:scale-125 */}
        <Image
          className="object-cover aspect-video sm:w-full group-hover:scale-125 transition ease-in-out"
          src={thumbnail}
          alt={title}
          width="592"
          height="332"
          layout="responsive"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0cXS5AQADPQGj+65iUQAAAABJRU5ErkJggg=="
        />
        <div className="flex flex-col justify-between invisible absolute p-4 md:p-8 text-base xl:text-2xl top-0 left-0 w-full h-full bg-slate-800/80 group-hover:visible ease-in-out">
          {title}

          <div className="flex justify-between items-center">
            <div className="h-16 w-16 rounded-full p-2 pl-4 flex justify-between bg-gray-300/50">
              <Image src={PlayIcon} alt="play icon" />
            </div>

            <div className="text-base"></div>
          </div>
        </div>
        {/* </div> */}
        {/* <img src={thumbnail} alt={title} width="600" height="500" className="object-cover aspect-video sm:w-full sepia-0 hover:sepia hover:cursor-pointer" /> */}
      </div>
    </>
  );
};
export default VideoCard;
