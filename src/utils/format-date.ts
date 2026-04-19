export const formatDate = (inputDate: Date | string) => {
    const date = new Date(inputDate);          // accept a Date, timestamp, or ISO string

    // 1. Get the date part: "February 26"
    const datePart = date.toLocaleString('en-US', {
        month: 'long',   // "February"
        day: 'numeric' // "26"
    });

    // 2. Get the time part: "8:00 PM"
    const timePart = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // 3. Combine them
    return `${datePart} at ${timePart}`;
}

export const formatMonth = (inputDate: Date | string) => {
    const date = new Date(inputDate);
    return date.toLocaleString("en-US", { month: 'long' });
}