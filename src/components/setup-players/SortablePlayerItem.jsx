import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlayerItem from './PlayerItem';

const SortablePlayerItem = ({ player, index, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: player.id });

    // When we use DragOverlay, the item in the list should fade out (be a placeholder)
    // The overlay will handle the "visible" dragged item.
    const style = {
        transform: CSS.Transform.toString(transform),
        transition, // We can keep transition here because the overlay handles the drag movement
        opacity: isDragging ? 0.3 : 1, // Fade out the placeholder
        touchAction: 'none'
    };

    return (
        <PlayerItem 
            ref={setNodeRef}
            player={player}
            index={index}
            onRemove={onRemove}
            style={style}
            dragProps={attributes}
            listeners={listeners}
        />
    );
};

export default SortablePlayerItem;
