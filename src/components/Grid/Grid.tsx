import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
    UniqueIdentifier
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

const Grid = ({ cards, setCards, getReorderedCards, isLoading }: {
    cards: YoutubeVideosResponse['items'],
    setCards: Dispatch<SetStateAction<YoutubeVideoItem[]>>,
    getReorderedCards: (cards: UpdatedVideoList) => void,
    isLoading: boolean
}) => {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>('');
    // const [items, setItems] = useState(cards);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setCards((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
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
        <>
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

            {(isLoading) && (<div className="flex justify-center mt-3">
                <div className="animate-ping inline-flex h-10 w-10 rounded-full bg-sky-400 opacity-75"></div>
            </div>)}

        </>

    )
}

export default Grid;