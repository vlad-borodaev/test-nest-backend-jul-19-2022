export const capitalizeFirstLetter = (content: string) => {
    if (!content?.trim()) {
        return "";
    }
    return content.charAt(0).toUpperCase() + content.slice(1);
}