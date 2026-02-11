import React, { forwardRef } from 'react';
import { GripVertical, X } from 'lucide-react';
import { PLAYER_COLORS } from '../../constants';

const PlayerItem = forwardRef(({ player, index, onRemove, style, className, dragProps, listeners }, ref) => {
    return (
        <div 
            ref={ref} 
            style={style} 
            className={`flex items-center gap-4 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm hover:border-amber-500/50 hover:bg-slate-700 hover:shadow-md transition group animate-in zoom-in-95 duration-200 ${className}`}
        >
            <div {...dragProps} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-500 group-hover:text-amber-500 touch-none">
                <GripVertical size={20}/>
            </div>
            
            <div className={`w-10 h-10 rounded-full ${PLAYER_COLORS[player?.colorIdx]?.class || 'bg-gray-400'} shadow-md border-2 border-slate-600 ring-1 ring-slate-900 flex items-center justify-center font-bold text-white text-xs shrink-0 select-none`}>
                {index + 1}
            </div>
            
            <span className="font-bold text-slate-200 text-lg flex-1 truncate select-none">{player?.name}</span>
            
            {onRemove && (
                <button onClick={() => onRemove(player.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg transition shrink-0">
                    <X size={20}/>
                </button>
            )}
        </div>
    );
});

export default PlayerItem;
