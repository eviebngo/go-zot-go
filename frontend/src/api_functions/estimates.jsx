export const estimate_fare = (dist, time, xl) => {
  let fare = dist * 1.1 + time * 0.18 + 4.15;
  if (xl) fare *= 1.6;
  return fare;
};
