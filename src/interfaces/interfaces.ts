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

export interface IAddNote {
    title: string;
    content: string;
    deadline: string;
  }

export interface IUpdateNote {
    id: number;
    newTitle?: string;
    newContent?: string;
    is_done?: boolean;
    is_archived?: boolean;
}