export interface IUserData {
    username: string;
    email: string;
    password?: string;
    confirmPassword?: string;
  }

export interface IResetPass {
    token: string;
    password: string;
    confirm_password: string;
  }

