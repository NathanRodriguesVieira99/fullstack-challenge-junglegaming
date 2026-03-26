// A IA me ajudou a achar essa solução pois o NestJs aparentemente nao consegue lidar muito bem com  BigInt
export const sanitizeBigInt = (obj: any): any => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
};
