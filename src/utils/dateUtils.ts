export const convertDate = (date : string | null | undefined, options: Intl.DateTimeFormatOptions) : string =>
{
    if(!date) return ""
    
    const dateObject = new Date(date);
    const dateFormatted = dateObject.toLocaleDateString("fr-FR", options);

    return dateFormatted
}
