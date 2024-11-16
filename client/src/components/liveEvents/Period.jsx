/* eslint-disable react/prop-types */

const Period = ({ activePeriod, setActivePeriod }) => {
  const events = [
    { label: "Start First Half", value: "first_half" },
    { label: "Start Second Half", value: "second_half" },
    { label: "Start First Extra Time", value: "first_extra_time" },
    { label: "Start Second Extra Time", value: "second_extra_time" },
    { label: "Start Third Extra Time", value: "third_extra_time" },
    { label: "Start Fourth Extra Time", value: "fourth_extra_time" },
  ];
  return (
    <div className="font-semibold uppercase flex justify-center m-2">
      {events.map((event, index) => (
        <span
          key={index}
          className={`border-2 cursor-pointer hover:bg-[#3051A8]/90 duration-500 p-2 ${
            event.value === activePeriod ? "bg-[#3051A8] text-white" : ""
          } ${index !== 0 ? "border-l-0" : ""}`}
          onClick={() => setActivePeriod(event.value)}
        >
          {event.label}
        </span>
      ))}
    </div>
  );
};

export default Period;
