export type UserListDto = {
  id: number;
  name: string;
};

export type UserDetailDto = {
  id: number;
  name: string;
  email: string;
};

export type CreateUserDto = {
  name: string;
  email: string;
};
