export interface SelectorOption<T = string> {
    label: string;
    value: T;
}

export const IsOrNot: SelectorOption<boolean>[] = [
    { label: '是', value: true },
    { label: '否', value: false },
];

export function mapToOptions<T = any>(dict: Indexable, isNumber = false) {
    const options: SelectorOption<T>[] = [];

    for (const key in dict) {
        options.push({
            label: dict[key].toString(),
            value: (isNumber ? Number(key) : key) as T,
        });
    }

    return options;
}

export function listToOptions<T = any>(list: Indexable[], value: string, text: string, isNumber = false) {
    const options: SelectorOption<T>[] = [];

    for (const item of list) {
        options.push({
            label: item[text].toString(),
            value: isNumber ? Number(item[value]) : item[value],
        });
    }

    return options;
}
