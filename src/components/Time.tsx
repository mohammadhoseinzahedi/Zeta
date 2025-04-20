"use client"

const Time = ({ date }: { date: Date }) => {
  return (
    <time className="text-slate-700 text-sm">
      {date.toLocaleString("en-GB", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </time>
  );
};

export default Time;
