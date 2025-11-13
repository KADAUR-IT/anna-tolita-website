export async function handleMail(stringContact: string)
{
    const res = await fetch(`/api/sendMail?${stringContact}`);
    const data = await res.json();

    return data
} 