// "use client";
// import { Clock } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useEffect } from "react";

// interface TimerProps {
//   timeRemaining: number;
//   totalTime: number;
//   className?: string;
//   onTimeUp: () => void;
// }

// export function Timer({
//   timeRemaining,
//   totalTime,
//   onTimeUp,
//   className,
// }: TimerProps) {
//   const minutes = Math.floor(timeRemaining / 60);
//   const seconds = timeRemaining % 60;
//   const percentage = (timeRemaining / totalTime) * 100;

//   const isLow = percentage < 25;
//   const isCritical = percentage < 10;
//   useEffect(() => {
//     if (timeRemaining <= 0 && onTimeUp) {
//       onTimeUp();
//     }
//   }, [timeRemaining, onTimeUp]);
//   return (
//     <div className={cn("flex items-center gap-3", className)}>
//       <Clock
//         className={cn(
//           "h-5 w-5 transition-colors",
//           isCritical
//             ? "text-destructive animate-pulse"
//             : isLow
//             ? "text-warning"
//             : "text-primary"
//         )}
//       />

//       <div className="flex-1">
//         <div
//           className={cn(
//             "text-lg font-mono font-bold transition-colors",
//             isCritical
//               ? "text-destructive"
//               : isLow
//               ? "text-warning"
//               : "text-foreground"
//           )}>
//           {minutes}:{seconds.toString().padStart(2, "0")}
//         </div>

//         {/* <div className="w-full bg-muted rounded-full h-2 mt-1">
//           <div
//             className={cn(
//               "h-2 rounded-full transition-all duration-1000",
//               isCritical ? "bg-destructive shadow-glow-warning animate-pulse" :
//               isLow ? "bg-warning" : "bg-primary"
//             )}
//             style={{ width: `${Math.max(0, percentage)}%` }}
//           />
//         </div> */}
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  onTimeUp: () => void;
  className?: string;
}

export function Timer({
  timeRemaining,
  totalTime,
  onTimeUp,
  className,
}: TimerProps) {
  const minutes = Math.floor(Math.max(0, timeRemaining) / 60);
  const seconds = Math.max(0, timeRemaining) % 60;
  const percentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;

  const isLow = percentage < 25;
  const isCritical = percentage < 10;

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Clock
        className={cn(
          "h-5 w-5 transition-colors",
          isCritical
            ? "text-destructive animate-pulse"
            : isLow
            ? "text-warning"
            : "text-primary"
        )}
      />
      <div className="flex-1">
        <div
          className={cn(
            "text-lg font-mono font-bold transition-colors",
            isCritical
              ? "text-destructive"
              : isLow
              ? "text-warning"
              : "text-foreground"
          )}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
