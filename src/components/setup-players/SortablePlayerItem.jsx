import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';

const SortablePlayerItem = ({ player, index, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: player.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        touchAction: 'none' // Required for pointer sensors
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition group animate-in zoom-in-95 duration-200 ${isDragging ? 'z-50 shadow-xl ring-2 ring-indigo-500 scale-105' : ''}`}>
            
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 group-hover:text-indigo-400 touch-none">
                <GripVertical size={20}/>
            </div>
            
            <div className={`w-10 h-10 rounded-full ${PLAYER_COLORS[player.colorIdx]?.class || 'bg-gray-400'} shadow-md border-2 border-white ring-1 ring-slate-200 flex items-center justify-center font-bold text-white text-xs shrink-0 select-none`}>
                {index + 1}
            </div>
            
            <span className="font-bold text-slate-800 text-lg flex-1 truncate select-none">{player.name}</span>
            
            <button onClick={() => onRemove(player.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition shrink-0">
                <X size={20}/>
            </button>
        </div>
    );
};

export default SortablePlayerItem;
