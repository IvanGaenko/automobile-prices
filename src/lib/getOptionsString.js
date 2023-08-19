import { params } from "./params";

export default function getOptionsString(search) {
  const optionsList = [];

  if (search.minPrice)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${
        params.price.min + search.minPrice
      }`
    );
  if (search.maxPrice)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${
        params.price.max + search.maxPrice
      }`
    );

  if (search.minYear)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${
        params.year.min + search.minYear
      }`
    );
  if (search.maxYear)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${
        params.year.max + search.maxYear
      }`
    );

  if (search.region)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${
        params.region.str + search.region
      }`
    );

  return optionsList.join("");
}
