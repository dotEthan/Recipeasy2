type BooleanObject = { [key: string]: boolean }

interface RegisterResult {
  user: User;
  userData: {
    uid: string;
    email: string | undefined;
    displayName: string;
    createdAt: Date;
    recipes: any[];
    shoppingLists: any[];
  }
}

type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  message?: string;
  pattern?: RegExp;
  // add more as we go
}