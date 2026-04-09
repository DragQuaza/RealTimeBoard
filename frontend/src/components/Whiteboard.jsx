import React, { useRef, useEffect } from 'react';

const Whiteboard = ({ socket, roomId, currentColor, brushSize, isEraser, clearTrigger }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const isDrawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // To handle high DPI displays, scale canvas
        const updateCanvasSize = () => {
            // Save canvas content
            let tempCanvas;
            if (canvas.width > 0 && canvas.height > 0) {
                tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(canvas, 0, 0);
            }

            canvas.width = window.innerWidth * 2;
            canvas.height = window.innerHeight * 2;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            const context = canvas.getContext('2d');
            context.scale(2, 2);
            context.lineCap = 'round';
            context.lineJoin = 'round';

            // Fill with white background initially if no previous content
            if (!tempCanvas) {
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, window.innerWidth, window.innerHeight);
            } else {
                context.drawImage(tempCanvas, 0, 0, tempCanvas.width / 2, tempCanvas.height / 2);
            }

            contextRef.current = context;
        };

        updateCanvasSize();

        // Handle initial socket events
        if (socket) {
            socket.on('drawing', onReceivingDrawing);
            socket.on('clear-canvas', handleRemoteClear);
        }

        window.addEventListener('resize', updateCanvasSize);

        return () => {
            if (socket) {
                socket.off('drawing', onReceivingDrawing);
                socket.off('clear-canvas', handleRemoteClear);
            }
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [socket]); // Run once mostly, rebind socket if it changes

    // Update context when tools change
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = isEraser ? '#ffffff' : currentColor;
            contextRef.current.lineWidth = brushSize;
        }
    }, [currentColor, brushSize, isEraser]);

    // Handle local clear trigger
    useEffect(() => {
        if (clearTrigger > 0) {
            clearCanvas(false);
        }
    }, [clearTrigger]);

    const clearCanvas = (isRemote) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (ctx && canvas) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleRemoteClear = () => {
        clearCanvas(true);
    };

    const drawLine = (x0, y0, x1, y1, color, size, isEr, emit) => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);

        // Override local tools with received tools during remote draw
        const originalColor = ctx.strokeStyle;
        const originalSize = ctx.lineWidth;

        ctx.strokeStyle = isEr ? '#ffffff' : color;
        ctx.lineWidth = size;
        ctx.stroke();
        ctx.closePath();

        // Restore local tools
        ctx.strokeStyle = originalColor;
        ctx.lineWidth = originalSize;

        if (!emit) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        socket.emit('drawing', {
            roomId,
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: currentColor,
            size: brushSize,
            isEraser
        });
    };

    const onReceivingDrawing = (data) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.size, data.isEraser, false);
    };

    const startDrawing = (e) => {
        isDrawing.current = true;
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        lastPos.current = { x: clientX, y: clientY };

        // Draw dot for single click
        drawLine(clientX, clientY, clientX, clientY, currentColor, brushSize, isEraser, true);
    };

    const draw = (e) => {
        if (!isDrawing.current) return;
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const currentPos = { x: clientX, y: clientY };

        drawLine(lastPos.current.x, lastPos.current.y, currentPos.x, currentPos.y, currentColor, brushSize, isEraser, true);
        lastPos.current = currentPos;
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
    };

    return (
        <div className="canvas-container">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
            />
        </div>
    );
};

export default Whiteboard;
