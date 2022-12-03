export const getDateInSecs = (date: Date): number => {
    if (!date || !("getTime" in date)) {
        throw new Error("Invalid date");
    }

    return date.getTime() / 1000;
}