export interface StringKeyDict<T = any> {
    [key: string]: T;
}

export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function listToDict(list: Indexable[], value: string, text: string, isNumber = false) {
    const dict = {};

    for (const item of list) {
        dict[isNumber ? Number(item[value]) : item[value]] = item[text].toString();
    }

    return dict;
}
