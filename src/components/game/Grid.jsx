import React from 'react';
import ClueCard from './ClueCard';

const Grid = ({ gamePlayers, currentEdition, gridData, onCellClick, highlightedCards = [] }) => {
    
    // Helper to render a category section
    const renderSection = (title, items) => (
        <div className="mb-10 last:mb-0">
            {/* Section Header - Minimal & Clean */}
            <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-slate-700 uppercase tracking-widest px-1">
                    {title}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {items.map(item => (
                    <ClueCard 
                        key={item}
                        name={item}
                        players={gamePlayers}
                        gridData={gridData}
                        onCellClick={onCellClick}
                        solutionState={gridData[`${item}_SOLUTION`]}
                        isHighlighted={highlightedCards.includes(item)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="pb-24">
            {renderSection('Sospettati', currentEdition.suspects)}
            {renderSection('Armi', currentEdition.weapons)}
            {renderSection('Luoghi', currentEdition.rooms)}
        </div>
    );
};

export default Grid;
