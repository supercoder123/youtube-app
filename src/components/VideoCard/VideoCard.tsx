import Image from 'next/image'
import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd';
import { YoutubeVideoItem } from '../../types';

interface DragItem {
    index: number;
    id: string;
    type: string;
  }

const VideoCard = ({ video, id, index, moveCard }: { video: YoutubeVideoItem, id: string, index: number, moveCard: (dragIndex: number, hoverIndex: number) => void }) => {
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.standard.url;
    const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: any | null }>({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;
      const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 3;


      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
      const hoverClientX = (clientOffset as any).x - hoverBoundingRect.left;


      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
    //   if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //     return;
    //   }

    //   if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
    //     return;
    //   }

    //   // Dragging upwards
    //   if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //     return;
    //   }

    //   if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
    //     return;
    //   }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

    return (
        <div key={video.id} ref={ref}>
            {/* <div className="object-cover aspect-video sm:w-full"> */}
            <Image
                className="object-cover aspect-video sm:w-full hover:cursor-pointer"
                src={thumbnail}
                alt={title}
                width="592"
                height="332"
                layout='responsive'
            />

            {/* </div> */}
            {/* <img src={thumbnail} alt={title} width="600" height="500" className="object-cover aspect-video sm:w-full sepia-0 hover:sepia hover:cursor-pointer" /> */}
        </div>
    )
}

export default VideoCard