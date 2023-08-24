export enum Gender {
  MALE = '남자',
  FEMALE = '여자',
}

export enum Provider {
  LOCAL = 'local',
  KAKAO = 'kakao',
}

export enum Status {
  NORMAL = 'normal',
  ADMIN = 'admin',
}

export interface CurrentUser {
  id: number;
  name: string;
  birthday: Date;
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
