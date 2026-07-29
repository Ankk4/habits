export const getStartOfDay = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const getEndOfDay = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

export const getStartOfWeek = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
}

export const getEndOfWeek = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - date.getDay()));
}

export const getStartOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export const getEndOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}