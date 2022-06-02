// import city-timezones NPM package using esm.sh CDN
import cityTimezones from "https://esm.sh/city-timezones@v1.2.0";

function getLocalDate(utcDate, geoInfo) {
  // context.geo may not contain all keys (eg. city, subdivision, country)

  const locationString = ["city", "subdivision", "country"]
    .filter((locationKey) => locationKey in geoInfo)
    .map((locationKey) => geoInfo[locationKey].name)
    .join(" ");

  // lookup timezone based on location
  const timezones = cityTimezones.findFromCityStateProvince(locationString);

  if (timezones.length > 0) {
    // return local date string using the timezone
    const timezoneName = timezones[0].timezone;
    return utcDate.toLocaleString("en-AU", { timeZone: timezoneName });
  } else {
    // no timezone found
    return null;
  }
}

export default async (request, context) => {
  const utcDate = new Date();

  const localDate = getLocalDate(utcDate, context.geo);

  return context.json({
    utcDate,
    localDate,
  });
};
