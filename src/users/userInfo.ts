export enum Gender {
  MALE = '남자',
  FEMALE = '여자',
}

export enum Provider {
  LOCAL = 'local',
  KAKAO = 'kakao',
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
