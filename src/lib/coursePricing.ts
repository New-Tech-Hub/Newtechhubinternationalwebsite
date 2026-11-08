export const BEGINNER_COURSE_MIN_PRICE = 120000;

export const isCoursePriceValidForLevel = (level: string, price: number) =>
  level !== "beginner" || price >= BEGINNER_COURSE_MIN_PRICE;