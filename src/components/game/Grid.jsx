import React, { useState, useEffect, useRef } from 'react';
import ClueCard from './ClueCard';

// HOOK: Calculates optimal balanced columns based on container width & item count
// Goal: Distribute items evenly (e.g., 6 items -> 3 cols x 2 rows, not 4 cols x 1 row + 2 orphans)
const useBalancedColumns = (itemCount, minItemWidth, gap) => {
    const containerRef = useRef(null);
    const [cols, setCols] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;

        const calculate = (width) => {
            if (width <= 0) return;
            // standard width equation: cols * minWidth + (cols - 1) * gap <= width
            // roughly: cols * (minWidth + gap) <= width + gap
            const maxPossibleCols = Math.floor((width + gap) / (minItemWidth + gap));
            const safeMaxCols = Math.max(1, maxPossibleCols);

            // Calculate rows needed to fit strictly
            const rowsNeeded = Math.ceil(itemCount / safeMaxCols);
            
            // Recalculate cols to be as balanced as possible given the rows
            // e.g. 6 items. safeMax=4. Rows=2. OptimalCols = ceil(6/2) = 3. 
            // Result: 3 cols (balanced) instead of 4 cols (4+2 unbalanced).
            const optimalCols = Math.ceil(itemCount / Math.max(1, rowsNeeded));
            
            setCols(optimalCols);
        };

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                calculate(entry.contentRect.width);
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [itemCount, minItemWidth, gap]);

    return { containerRef, cols };
};

const Section = ({ title, items, gamePlayers, gridData, onCellClick, highlightedCards }) => {
    // Min Card Width: ~260px, Gap: 16px
    const { containerRef, cols } = useBalancedColumns(items.length, 260, 16);

    return (
        <div className="mb-12 last:mb-0">
            {/* Section Header */}
            <h3 className="text-2xl font-black text-amber-300 uppercase tracking-tight text-center mb-6 drop-shadow-sm">
                {title}
            </h3>

            {/* Cards Grid - Dynamic Balanced Columns */}
            <div 
                ref={containerRef}
                className="grid gap-4 w-full"
                style={{ 
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
                }}
            >
                {items.map(item => (
                    <div key={item} className="h-full">
                            <ClueCard 
                            name={item}
                            players={gamePlayers} 
                            gridData={gridData} 
                            onCellClick={onCellClick} 
                            solutionState={gridData[`${item}_SOLUTION`]}
                            isHighlighted={highlightedCards.includes(item)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const Grid = ({ gamePlayers, currentEdition, gridData, onCellClick, highlightedCards = [] }) => {
    return (
        <div className="pb-24">
            <Section 
                title="Sospettati" 
                items={currentEdition.suspects}
                gamePlayers={gamePlayers}
                gridData={gridData}
                onCellClick={onCellClick}
                highlightedCards={highlightedCards}
            />
            <Section 
                title="Armi" 
                items={currentEdition.weapons} 
                gamePlayers={gamePlayers}
                gridData={gridData}
                onCellClick={onCellClick}
                highlightedCards={highlightedCards}
            />
            <Section 
                title="Stanze" 
                items={currentEdition.rooms} 
                gamePlayers={gamePlayers}
                gridData={gridData}
                onCellClick={onCellClick}
                highlightedCards={highlightedCards}
            />
        </div>
    );
};

export default Grid;
