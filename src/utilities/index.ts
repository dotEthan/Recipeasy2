import { LocalUser } from "@/types/UserState";

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

export function createUser(userData: Partial<LocalUser>): LocalUser {
  const defaultValues: LocalUser = {
    _id: '',
    verified: false,
  };
  return {
    ...defaultValues,
    ...userData
  }
}

//TODO test other browsers to see if needed. Firefox already throttles
export function debounce(fn: Function, delay: number) {
  let timeoutId: number
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), delay)
  }
}