export enum Position {
  HOST = 'host', // 방장
  GUEST = 'guest', // 초대된사람
}

// 아직 미적용함
export interface CurrentUser {
  id: number;
  name: string;
  age: number;
  height: number;
  email: string;
  password: string;
  gender: string;
  comment: string;
  point: number;
  followers: {
    id: number;
    name: string;
    imgUrl: string;
  }[];
}
