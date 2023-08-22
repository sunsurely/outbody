export enum Position {
  HOST = 'host', // 방장
  GUEST = 'guest', // 참여한 사람
  INVITED = 'invited', // 초대된 사람
}

export enum Point {
  ATTEND = 10, // 출석
  WEIGHT = 20, // 체중
  FAT = 40, // 체지방율
  MUSCLE = 60, // 골격근량
}

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

export enum Answer {
  YES = 'yes',
  NO = 'no',
}
