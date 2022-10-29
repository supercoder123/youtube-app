import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import { YoutubeVideoItem } from "../../types";
import PlayIcon from "../../assets/images/play-icon.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import cx from "classnames";
import { EditedCardsDescription } from "../../pages";
import { useModal } from "./useModal";
import VideoPopup from "../VideoPopup/VideoPopup";

const VideoCard = ({
  video,
  index,
  isEditing,
  hide,
  setEditedCards,
  setEditInProgress,
}: {
  video: YoutubeVideoItem;
  index: number;
  isEditing: boolean;
  hide: boolean | undefined;
  setEditedCards: Dispatch<SetStateAction<EditedCardsDescription>>;
  setEditInProgress: Dispatch<SetStateAction<boolean>>;
}) => {
  const id = video.id;
  const title = video.snippet.title;
  const thumbnail =
    video.snippet?.thumbnails?.standard?.url ||
    video.snippet?.thumbnails?.high.url;
  const defaultThumbnail = video.snippet?.thumbnails?.high.url;
  const videoId = video.snippet.resourceId.videoId;
  const description = video.snippet.description;
  const [isOpen, setIsOpen, toggleModal] = useModal(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id, disabled: !isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : "auto",
  };

  if (!isEditing && hide) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => {
          if (!isEditing) {
            setIsOpen(true);
          }
        }}
        key={video.id}
        style={style}
        ref={setNodeRef}
        className={cx("relative group ease-in-out", {
          "cursor-grab border m-2 rounded-sm": isEditing,
          "cursor-pointer": !isEditing,
          "opacity-30 border-dashed border-4 ": hide,
        })}
      >
        <Image
          className="object-cover aspect-video sm:w-full group-hover:scale-125 transition-transform duration-300"
          src={thumbnail}
          alt={title}
          width="592"
          height="332"
          layout="responsive"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0cXS5AQADPQGj+65iUQAAAABJRU5ErkJggg=="
        />

        {isEditing && (
          <div className="absolute -right-3 -top-3 z-10">
            <button
              onClick={() => {
                setEditedCards((prev) => ({
                  ...prev,
                  [id]: {
                    ...prev[id],
                    id,
                    hide: !hide,
                    pageNumber: parseInt((index / 25).toString()),
                    videoId,
                  },
                }));
                setEditInProgress(true);
              }}
              className="bg-red-600 rounded-full flex justify-center items-center w-9 h-9 hover:bg-red-400 text-white"
            >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            </button>
          </div>
        )}

        <div
          {...listeners}
          className="flex flex-col justify-between invisible absolute p-4 md:p-8 text-base xl:text-xl top-0 left-0 w-full h-full bg-gradient-to-t from-black/100 via-black-50 to-transparent text-white uppercase group-hover:visible"
        >
          <div className="flex justify-between items-center">
            <div className="h-16 w-16 rounded-full mr-auto flex justify-between">
              <Image src={PlayIcon} className="scale-50 group-hover:scale-100 transition" alt="play icon" />
            </div>

            <div className="text-base"></div>
          </div>
          <span className="opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition duration-500">{title}</span>

        </div>
      </div>

      <VideoPopup isOpen={isOpen} onClose={setIsOpen} videoId={videoId} />
    </>
  );
};

export default VideoCard;
