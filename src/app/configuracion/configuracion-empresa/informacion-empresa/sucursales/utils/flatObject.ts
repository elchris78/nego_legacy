// utils/objectStructure.ts

export function flatObject(obj: any, parentKey = "", result: Record<string, any> = {}): Record<string, any> {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null && !(obj[key] instanceof File)) {
      flatObject(obj[key], newKey, result);
    } else {
      result[newKey] = obj[key];
    }
  }

  return result;
}
