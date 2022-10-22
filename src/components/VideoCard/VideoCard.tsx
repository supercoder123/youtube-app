import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import ReactDOM from "react-dom";
import { YoutubeVideoItem } from "../../types";
import PlayIcon from "../../assets/images/play-icon.svg";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import cx from "classnames";
import { EditedCardsDescription } from "../../pages";
import { useModal } from "./useModal";

const VideoPopup = ({
  isOpen,
  onClose,
  videoId,
}: {
  isOpen: boolean;
  videoId: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (!isOpen) {
    return null;
  }
  return ReactDOM.createPortal(
    <div
      onClick={() => {
        onClose(false);
      }}
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-20 overflow-y-auto"
    >
      <div className="flex w-full h-full fixed justify-center items-center">
        <div className="aspect-video w-full md:w-8/12 resize bg-gray-800 rounded-lg relative drop-shadow-md m-3">
          <button
            className="absolute rounded-full border border-neutral-600 w-8 h-8 -right-2 -top-2 bg-stone-900"
            onClick={() => {
              onClose(false);
            }}
          >
            X
          </button>

          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")!
  );
};

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
        className={cx("relative group", {
          "cursor-grab border m-2 rounded-sm": isEditing,
          "cursor-pointer": !isEditing,
          "opacity-30 border-dashed border-4 ": hide,
        })}
      >
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
              className="bg-red-600 rounded-full flex justify-center items-center w-9 h-9 hover:bg-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        )}

        <div
          {...listeners}
          className="flex flex-col justify-between invisible absolute p-4 md:p-8 text-base xl:text-2xl top-0 left-0 w-full h-full bg-slate-800/80 group-hover:visible ease-in-out"
        >
          {title}
          <div className="flex justify-between items-center">
            <div className="h-16 w-16 rounded-full ml-auto flex justify-between">
              <Image src={PlayIcon} alt="play icon" />
            </div>

            <div className="text-base"></div>
          </div>
        </div>
      </div>

      <VideoPopup isOpen={isOpen} onClose={setIsOpen} videoId={videoId} />
    </>
  );
};

export default VideoCard;
