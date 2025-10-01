// import React from "react";

// const getMwfReadable = (hour_code) => {
//   if (hour_code >= 0 && hour_code <= 13) {
//     const hour = 7 + hour_code;
//     return formatHourMWF(hour);
//   } else {
//     return "Invalid hour code";
//   }
// };

// const getTThReadable = (hour_code) => {
//   if (hour_code >= 0 && hour_code <= 9) {
//     const convertedTime = Number(hour_code) * 1.5 + 7;
//     return formatHourTTh(convertedTime);
//   }
// };

// const formatHourMWF = (decimalHour) => {
//   const hours = Math.floor(decimalHour);
//   const minutes = decimalHour % 1 === 0.5 ? "30" : "00";
//   const suffix = hours >= 12 ? "PM" : "AM";
//   const displayHour = hours > 12 ? hours - 12 : hours;
//   return `${displayHour}:${minutes} ${suffix}`;
// };

// const formatHourTTh = (convertedTime) => {
//   const hours = Math.floor(convertedTime);
//   const displayHour = hours > 12 ? hours - 12 : hours;
//   const meridiem = hours >= 12 ? "PM" : "AM";
//   const minutes = convertedTime % 1 === 0.5 ? "30" : "00";

//   return `${displayHour}:${minutes} ${meridiem}`;
// };

// export const readableMWFTime = (time) => {
//   return `${getMwfReadable(time)}`;
// };

// export const readableTThTime = (time) => {
//   return `${getTThReadable(time)}`;
// };

import React from "react";

const getReadableTime = (hour_code) => {
  if (hour_code >= 0 && hour_code <= 20) {
    const totalHalfHours = hour_code;
    const decimalHour = 7 + totalHalfHours * 0.5;
    return formatTime(decimalHour);
  } else {
    return "Invalid hour code";
  }
};

const formatTime = (decimalHour) => {
  const hours = Math.floor(decimalHour);
  const minutes = decimalHour % 1 === 0.5 ? "30" : "00";
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${minutes} ${suffix}`;
};

export const readableMWFTime = (time) => {
  return getReadableTime(time);
};

export const readableTThTime = (time) => {
  return getReadableTime(time);
};
