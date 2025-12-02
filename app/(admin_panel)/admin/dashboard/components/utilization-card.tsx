"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react"; // Icon for activity

// --- Status Logic (Provided by User) ---
const getUtilisationStatus = (value: number) => {
  if (value < 20)
    return {
      label: "Underutilized",
      color: "text-red-600",
      bg: "bg-red-100",
      stroke: "#dc2626",
    };
  if (value < 60)
    return {
      label: "Suboptimal",
      color: "text-orange-600",
      bg: "bg-orange-100",
      stroke: "#ea580c",
    };
  if (value < 80)
    return {
      label: "Optimal",
      color: "text-amber-600",
      bg: "bg-amber-100",
      stroke: "#f59e0b",
    };
  if (value <= 100)
    return {
      label: "Highly Utilized",
      color: "text-green-600",
      bg: "bg-green-100",
      stroke: "#16a34a",
    };
  if (value <= 500)
    return {
      label: "Overutilized",
      color: "text-blue-600",
      bg: "bg-blue-100",
      stroke: "#2563eb",
    };
  return {
    label: "Overload",
    color: "text-purple-600",
    bg: "bg-purple-100",
    stroke: "#9333ea",
  };
};

type UtilisationCardProps = {
  avgUtilisation: number; // actual value
  yardsWithCapacity: any[];
};

// --- Gauge Configuration Constants ---
const GAUGE_RADIUS = 50;
const GAUGE_CENTER = 65;
const GAUGE_STROKE_WIDTH = 15;
const SVG_WIDTH = 140;
const SVG_HEIGHT = 90;
const MAX_UTILISATION_VALUE = 500; // Max value for the gauge scale
const CRITICAL_END = 100;
const CRITICAL_ANGLE = 120; // 0-100 takes up 120 degrees
const TOTAL_GAUGE_ANGLE = 180; // Total sweep of the gauge (left to right)
const REMAINING_ANGLE = TOTAL_GAUGE_ANGLE - CRITICAL_ANGLE; // 60 degrees for 100-500

// Function to calculate coordinates on the arc
const getCoords = (angle: number, radius: number, center: number) => {
  const radians = angle * (Math.PI / 180);
  const x = center + radius * Math.cos(Math.PI + radians); // Start from 180 deg (left)
  const y = center + radius * Math.sin(Math.PI + radians); // Sweep to 0 deg (right)
  return { x, y };
};

// Non-linear angle calculation for the gauge
const calculateNonLinearAngle = (value: number): number => {
  if (value <= CRITICAL_END) {
    return (value / CRITICAL_END) * CRITICAL_ANGLE;
  }

  const clampedValue = Math.min(value, MAX_UTILISATION_VALUE);
  const extendedRange = MAX_UTILISATION_VALUE - CRITICAL_END; // 400 units (100 to 500)
  const valueAboveCritical = clampedValue - CRITICAL_END;

  const extendedAngle = (valueAboveCritical / extendedRange) * REMAINING_ANGLE;
  return CRITICAL_ANGLE + extendedAngle;
};

// Custom Easing function (easeOutElastic) for a cool "springy" effect
// From https://easings.net/ (adapted for 0-1 range)
const easeOutElastic = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export const UtilisationCard = ({
  avgUtilisation,
  yardsWithCapacity,
}: UtilisationCardProps) => {
  const status = getUtilisationStatus(avgUtilisation);
  const [animatedValue, setAnimatedValue] = useState(0); // Value the needle is currently pointing to
  const animationRef = useRef<number | null>(null); // For requestAnimationFrame
  const previousAvgUtilisation = useRef<number>(0); // To detect significant changes

  // Callback to animate the needle
  const animateNeedle = useCallback(
    (
      startValue: number,
      endValue: number,
      duration: number,
      easing: (t: number) => number,
      onComplete?: () => void
    ) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const startTime = performance.now();
      const animate = (currentTime: DOMHighResTimeStamp) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easing(progress);

        const currentValue =
          startValue + (endValue - startValue) * easedProgress;
        setAnimatedValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          if (onComplete) onComplete();
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    },
    []
  ); // Empty dependency array, callback doesn't change

  useEffect(() => {
    // Determine animation strategy
    const diff = Math.abs(avgUtilisation - previousAvgUtilisation.current);
    const isInitialRender =
      previousAvgUtilisation.current === 0 && avgUtilisation === 0; // Avoid sweep on initial 0
    const shouldSweepToMax =
      diff > MAX_UTILISATION_VALUE / 10 || previousAvgUtilisation.current === 0;

    if (shouldSweepToMax && !isInitialRender) {
      // 1. Sweep to Max
      animateNeedle(
        animatedValue,
        MAX_UTILISATION_VALUE,
        800,
        (t) => t,
        () => {
          // Linear easing to max
          // 2. Settle to Target
          animateNeedle(
            MAX_UTILISATION_VALUE,
            avgUtilisation,
            1500,
            easeOutElastic
          ); // Elastic easing to target
        }
      );
    } else {
      // Direct smooth transition for smaller changes
      animateNeedle(animatedValue, avgUtilisation, 500, (t) => t * t); // easeOutQuad for smoother direct transition
    }

    previousAvgUtilisation.current = avgUtilisation; // Update for next render

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [avgUtilisation, animateNeedle]);

  // Calculate the angle for the currently animated value
  const currentAngle = calculateNonLinearAngle(animatedValue);

  // Calculate needle end coordinates based on the animated angle
  const needleLength = GAUGE_RADIUS - 5;
  const needleRadians = Math.PI + currentAngle * (Math.PI / 180);
  const x2 = GAUGE_CENTER + needleLength * Math.cos(needleRadians);
  const y2 = GAUGE_CENTER + needleLength * Math.sin(needleRadians);

  // --- Arc Segments ---
  const ranges = [
    { value: 20, color: "#dc2626" }, // Underutilized
    { value: 50, color: "#ea580c" }, // Suboptimal
    { value: 80, color: "#f59e0b" }, // Optimal
    { value: 100, color: "#16a34a" }, // Highly Utilized
    { value: MAX_UTILISATION_VALUE, color: "#2563eb" }, // Overutilized (up to 500)
  ];

  let currentArcSegmentAngle = 0;
  const arcSegments = ranges.map((range) => {
    const endAngle = calculateNonLinearAngle(range.value);
    const startCoords = getCoords(
      currentArcSegmentAngle,
      GAUGE_RADIUS,
      GAUGE_CENTER
    );
    const endCoords = getCoords(endAngle, GAUGE_RADIUS, GAUGE_CENTER);

    const segment = (
      <path
        key={range.value}
        d={`M${startCoords.x},${startCoords.y} A${GAUGE_RADIUS},${GAUGE_RADIUS} 0 0,1 ${endCoords.x},${endCoords.y}`}
        stroke={range.color}
        strokeWidth={GAUGE_STROKE_WIDTH}
        fill="none"
        strokeLinecap="butt"
      />
    );
    currentArcSegmentAngle = endAngle;
    return segment;
  });

  // --- Tick Marks with Text Labels ---
  const tickMarks: React.ReactNode[] = [];
  const tickLabels: React.ReactNode[] = [];
  const tickValues = [0, 50, 100, 200, 300, 400, 500];
  const tickRadius = GAUGE_RADIUS - GAUGE_STROKE_WIDTH / 2 + 1;
  const tickLength = 5;
  const labelOffset = 18; // Distance for labels from center

  tickValues.forEach((value) => {
    const tickAngle = calculateNonLinearAngle(value);
    const { x, y } = getCoords(tickAngle, tickRadius, GAUGE_CENTER);
    const { x: xInner, y: yInner } = getCoords(
      tickAngle,
      tickRadius - tickLength,
      GAUGE_CENTER
    );
    const { x: xLabel, y: yLabel } = getCoords(
      tickAngle,
      GAUGE_RADIUS + labelOffset,
      GAUGE_CENTER
    );

    const tickStroke = value === MAX_UTILISATION_VALUE ? "#dc2626" : "#475569"; // Red for 500

    tickMarks.push(
      <line
        key={`tick-${value}`}
        x1={x}
        y1={y}
        x2={xInner}
        y2={yInner}
        stroke={tickStroke}
        strokeWidth="1.5"
      />
    );

    // Add text labels
    tickLabels.push(
      <text
        key={`label-${value}`}
        x={xLabel}
        y={yLabel}
        textAnchor="middle" // Center the text horizontally
        alignmentBaseline="middle" // Center the text vertically
        fill="#475569"
        fontSize="8"
        fontWeight="bold"
      >
        {value}
      </text>
    );
  });

  return (
    <Card
      className={`border-l-4 ${status.color.replace(
        "text",
        "border"
      )} shadow-lg hover:shadow-xl transition-shadow`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600">
            Avg Utilization
          </CardTitle>
          <Activity className={`w-5 h-5 ${status.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-6">
          {/* Gauge */}
          <svg
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          >
            {/* Subtle radial gradient for background arc for more depth */}
            <defs>
              <radialGradient
                id="gaugeBgGradient"
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop offset="0%" stopColor="#f0f4f8" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </radialGradient>
            </defs>

            <path
              d={`M${getCoords(0, GAUGE_RADIUS, GAUGE_CENTER).x},${
                getCoords(0, GAUGE_RADIUS, GAUGE_CENTER).y
              } A${GAUGE_RADIUS},${GAUGE_RADIUS} 0 0,1 ${
                getCoords(TOTAL_GAUGE_ANGLE, GAUGE_RADIUS, GAUGE_CENTER).x
              },${getCoords(TOTAL_GAUGE_ANGLE, GAUGE_RADIUS, GAUGE_CENTER).y}`}
              stroke="url(#gaugeBgGradient)" // Apply gradient
              strokeWidth={GAUGE_STROKE_WIDTH + 2} // Slightly wider background
              fill="none"
              strokeLinecap="round"
            />

            {/* Colored arc segments */}
            {arcSegments}

            {/* Tick Marks */}
            {tickMarks}

            {/* Tick Labels */}
            {tickLabels}

            {/* Needle with subtle glow/shadow */}
            <filter id="needleShadow">
              <feDropShadow
                dx="1"
                dy="1"
                stdDeviation="1"
                floodColor="#000000"
                floodOpacity="0.3"
              />
            </filter>
            <line
              x1={GAUGE_CENTER}
              y1={GAUGE_CENTER}
              x2={x2}
              y2={y2}
              stroke={status.stroke}
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#needleShadow)" // Apply shadow
            />

            {/* Center bolt/pivot point */}
            <circle
              cx={GAUGE_CENTER}
              cy={GAUGE_CENTER}
              r="7"
              fill="#1e293b"
              stroke="white"
              strokeWidth="2.5"
            />
            <circle
              cx={GAUGE_CENTER}
              cy={GAUGE_CENTER}
              r="4"
              fill={status.stroke}
            />
          </svg>

          {/* Info */}
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${status.color}`}>
              {/* Always display the actual utilisation value */}
              {avgUtilisation.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500">
              {yardsWithCapacity.length} yards with capacity
            </p>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${status.bg} ${status.color}`}
            >
              {status.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
