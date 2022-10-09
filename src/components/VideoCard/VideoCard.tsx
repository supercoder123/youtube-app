import Image from 'next/image'
import React, { useRef } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd';
import { YoutubeVideoItem } from '../../types';
import PlayIcon from '../../assets/images/play-icon.svg'

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const VideoCard = ({ video, id, index, moveCard }: { video: YoutubeVideoItem, id: string, index: number, moveCard: (dragIndex: number, hoverIndex: number) => void }) => {
  const title = video.snippet.title;

  const thumbnail = video.snippet?.thumbnails?.standard?.url || video.snippet?.thumbnails?.high.url;
  const defaultThumbnail = video.snippet?.thumbnails?.high.url;
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
      console.log(ref.current, hoverBoundingRect)

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;
      const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 3;

      // console.log()
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      console.log('clientOffset',clientOffset)

      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
      const hoverClientX = (clientOffset as any).x - hoverBoundingRect.left;

      if (hoverIndex < dragIndex && (hoverBoundingRect.width) < hoverMiddleX) {
        return
      }

      // if (hoverClientX < hoverMiddleX) {
      //   return
      // }
      console.log({hoverMiddleX})
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging, dragEnd }, drag, preview] = useDrag({
    type: 'card',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      dragEnd: monitor.canDrag()
    }),
    previewOptions: {
      captureDraggingState: false
    }
  });

  drag(drop(ref));
  return (
    <>
      {/* <DragPreviewImage src={thumbnail} connect={preview} /> */}
    <div key={video.id} ref={ref} className="relative group cursor-grab">
      <Image
        className="object-cover aspect-video sm:w-full group-hover:scale-125 transition ease-in-out"
        style={{
          cursor: dragEnd ? 'grab' : 'grabbing'
        }}
        src={thumbnail}
        alt={title}
        width="592"
        height="332"
        layout='responsive'
        placeholder='blur'
        blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0cXS5AQADPQGj+65iUQAAAABJRU5ErkJggg=='
      />
      <div className="flex flex-col justify-between invisible absolute p-4 md:p-8 text-base xl:text-2xl top-0 left-0 w-full h-full bg-slate-800/80 group-hover:visible">
        {title}

        <div className='flex justify-between items-center'>
          <div className="h-16 w-16 rounded-full p-2 pl-4 flex justify-between bg-gray-300/50">
            <Image src={PlayIcon} alt="play icon" />
          </div>

          <div className='text-base'></div>
        </div>


      </div>
      {/* </div> */}
      {/* <img src={thumbnail} alt={title} width="600" height="500" className="object-cover aspect-video sm:w-full sepia-0 hover:sepia hover:cursor-pointer" /> */}
    </div>
    </>

  )
}
export default VideoCard