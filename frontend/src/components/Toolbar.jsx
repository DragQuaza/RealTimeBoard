import React from 'react';
import { Eraser, Pen, Trash2 } from 'lucide-react';

const COLORS = [
    '#000000', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#6366f1', '#a855f7'
];

const Toolbar = ({
    currentColor,
    setCurrentColor,
    brushSize,
    setBrushSize,
    isEraser,
    setIsEraser,
    onClear
}) => {
    return (
        <div className="toolbar-container glass">
            {/* Tool Selection */}
            <div className="tool-group">
                <button
                    className={`tool-btn ${!isEraser ? 'active' : ''}`}
                    onClick={() => setIsEraser(false)}
                    title="Pen Tool"
                >
                    <Pen size={20} />
                </button>
                <button
                    className={`tool-btn ${isEraser ? 'active' : ''}`}
                    onClick={() => setIsEraser(true)}
                    title="Eraser"
                >
                    <Eraser size={20} />
                </button>
            </div>

            <div className="tool-divider" />

            {/* Colors */}
            <div className="tool-group color-picker">
                {COLORS.map((color) => (
                    <div
                        key={color}
                        className={`color-swatch ${!isEraser && currentColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                            setCurrentColor(color);
                            setIsEraser(false);
                        }}
                        title={color}
                    />
                ))}
            </div>

            <div className="tool-divider" />

            {/* Brush Size */}
            <div className="tool-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center' }}>
                <input
                    type="range"
                    min="1"
                    max="30"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="size-slider"
                    title="Brush Size"
                />
            </div>

            <div className="tool-divider" />

            {/* Clear Action */}
            <div className="tool-group">
                <button
                    className="tool-btn tool-btn-danger"
                    onClick={onClear}
                    title="Clear Canvas"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
