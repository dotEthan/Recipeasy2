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