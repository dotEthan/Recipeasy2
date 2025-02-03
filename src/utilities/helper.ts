export const createSlug = (title: string, id: string, isPublic: boolean) => {

    const urlSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  // remove any special charaters
      .replace(/\s+/g, '-')          // spaces become dashes
      .slice(0, 15)
      .replace(/-+$/, '');           // remove trailing dashes
  
    const shortId = id.slice(-5);
  
    return (isPublic) ? `${urlSlug}-${shortId}--pub` : `${urlSlug}-${shortId}`;
}