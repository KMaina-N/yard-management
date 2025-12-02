'use client'
import React, { useRef, useEffect } from 'react';

// Define the dimensions for the canvas
const CANVAS_WIDTH = 700; // Increased width for better layout
const CANVAS_HEIGHT = 550; // Increased height

// Define a type for a drawable rectangle with its properties
interface YardRect {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fillColor: string;
  strokeColor: string;
  status: 'available' | 'occupied' | 'maintenance' | 'road'; // New status types
}

// 1. Helper function to draw a single colored rectangle with text
const drawYardRect = (context: CanvasRenderingContext2D, rect: YardRect) => {
  // Set fill style
  context.fillStyle = rect.fillColor;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);

  // Set stroke style
  // context.strokeStyle = rect.strokeColor;
  // context.lineWidth = 2; // Thinner border for aesthetic
  // context.strokeRect(rect.x, rect.y, rect.width, rect.height);

  // Add text label
  context.fillStyle = '#FFFFFF'; // White text for visibility
  if (rect.status === 'road') { // Darker text for roads
    context.fillStyle = '#ffffff';
  }
  context.font = '16px Inter, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // Calculate text position (center of the rectangle)
  const textX = rect.x + rect.width / 2;
  const textY = rect.y + rect.height / 2;
  context.fillText(rect.label, textX, textY);
};

// 2. Main CanvasYardMap Component
const YardMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error("2D context not available.");
      return;
    }

    const parkingZoneDefaultCordinates = {
      x: 150, y: 286, width: 38, height: 68
    }

    // Generate multiple parking zones dynamically and x positions will be increased incrementally
    const zones: YardRect[] = [];
    for (let i = 0; i < 3; i++) {
      zones.push({
        x: parkingZoneDefaultCordinates.x + i * (parkingZoneDefaultCordinates.width + 10), // 10px gap
        y: parkingZoneDefaultCordinates.y,
        width: parkingZoneDefaultCordinates.width,
        height: parkingZoneDefaultCordinates.height,
        label: `P${i + 1}`,
        fillColor: '#10B981', // Green for available parking
        strokeColor: "transparent",
        status: 'available'
      });
    }

    // --- Define our Yard Rectangles with enhanced properties ---
    const yardRects: YardRect[] = [
      {
        x: 151, y: 89, width: 401, height: 197,
        label: 'Tokić Uprava', fillColor: '#cacaca', strokeColor: '#cacaca', status: 'available'
      },
      {
        x: 300, y: 287, width: 252, height: 68,
        label: '', fillColor: '#cacaca', strokeColor: '#cacaca', status: 'occupied'
      },
      ...zones,
      // Adding a "Road" or "Pathway" area for context
      {
        x: 0, y: 380, width: CANVAS_WIDTH, height: 40,
        label: 'Main Access Road', fillColor: '#222222', strokeColor: '#222222', status: 'road'
      },
       // Adding another small zone
      {
        x: 560, y: 110, width: 68, height: 38,
        label: 'Zone C', fillColor: '#3B82F6', strokeColor: '#1E40AF', status: 'available'
      },
       // Adding another small zone
      {
        x: 560, y: 160, width: 68, height: 38,
        label: 'Zone D', fillColor: '#3B82F6', strokeColor: '#1E40AF', status: 'maintenance'
      }
    ];

    // Clear the canvas
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw a light background for the entire yard area
    context.fillStyle = '#F3F4F6'; // Very light gray background
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.strokeStyle = '#E5E7EB'; // Light border for the whole canvas
    context.lineWidth = 1;
    context.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    // Draw each defined yard rectangle
    yardRects.forEach(rect => drawYardRect(context, rect));

    // Optional: Add a title overlay on the canvas
    context.fillStyle = '#1F2937'; // Dark gray for title
    // context.font = 'bold 24px Inter, sans-serif';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    
    // context.fillText('Storage Yard Layout', 20, 20);


  }, []); // Empty dependency array means this runs only once on mount

  return (
    <div className="w-full bg-gray-100 min-h-screen flex flex-col items-center">

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">

        {/* Legend */}
        {/* <div className="md:w-1/3 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Map Legend</h2>
          <div className="space-y-3 text-lg">
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-md mr-3 border border-green-700" style={{ backgroundColor: '#34D399' }}></span> Available
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-md mr-3 border border-red-700" style={{ backgroundColor: '#EF4444' }}></span> Occupied
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-md mr-3 border border-yellow-700" style={{ backgroundColor: '#FBBF24' }}></span> Maintenance
            </div>
             <div className="flex items-center">
              <span className="w-6 h-6 rounded-md mr-3 border border-gray-700" style={{ backgroundColor: '#D1D5DB' }}></span> Road / Pathway
            </div>
             <div className="flex items-center">
              <span className="w-6 h-6 rounded-md mr-3 border border-gray-700" style={{ backgroundColor: '#9CA3AF' }}></span> Parking / Fixed
            </div>
          </div>
          <p className="mt-6 text-gray-500 text-sm italic">
            This map displays real-time yard asset allocation.
          </p>
        </div> */}

        {/* Canvas Area */}
        <div className="w-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            id="yardCanvas"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="rounded-lg"
          />
        </div>

      </div>

      <p className="mt-8 text-md text-gray-700 max-w-2xl text-center">
        Using the HTML Canvas API, this visualization provides a dynamic and color-coded representation of a storage yard layout. Each zone is clearly labeled and styled based on its current status.
      </p>
    </div>
  );
};

export default YardMap;