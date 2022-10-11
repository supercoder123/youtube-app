import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from "@dnd-kit/sortable";

import { YoutubeVideoItem, YoutubeVideosResponse } from '../../types';
import VideoCard from '../VideoCard/VideoCard';
import { UpdatedVideoList } from '../../pages';

const Grid = ({cards, setCards, getReorderedCards}: {
    cards: YoutubeVideosResponse['items'], 
    setCards: Dispatch<SetStateAction<YoutubeVideoItem[]>>
    getReorderedCards: Dispatch<SetStateAction<UpdatedVideoList | undefined>>}) => {
    const [activeId, setActiveId] = useState(null);
    // const [items, setItems] = useState(cards);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        const { active, over } = event;
        if (active.id !== over.id) {
            setCards((items) => {
                console.log('old', items);
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                console.log('new', newItems);
                const diff = newItems.map((item: YoutubeVideoItem, i) => {
                    if (item.snippet.position !== i) {
                        return {
                            id: item.id,
                            position: item.snippet.position,
                            newPosition: i,
                            pageNumber: parseInt((i / 25).toString()),
                            videoId: item.snippet.resourceId.videoId
                        };
                    }
                    return null;
                }).filter(val => val);
                getReorderedCards(diff);

                return newItems;
            });

        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center">
                <SortableContext items={cards} strategy={rectSortingStrategy}>
                    {
                        cards.map((video, index) => {
                            return <VideoCard key={video.id} id={video.id} index={index} video={video} />
                        })
                    }
                    {/* <DragOverlay>
                        {activeId ? (
                            <div
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    backgroundColor: "red"
                                }}
                            ></div>
                        ) : null}
                    </DragOverlay> */}
                </SortableContext>

            </div>
        </DndContext >

    )
}

export default Grid;