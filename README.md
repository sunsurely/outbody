# Out Body

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## 🎯서비스 소개

Out Body는 체성분 측정기록 기반 SNS 웹어플리케이션으로써, 사용자가 자신의 키, 몸무게, 체지방량, 골격근량, 기초대사량 등을 일정 기간동안 기입함으로써 변화되는 그래프를 통해 신체상태 변화를 한 눈에 알아볼 수 있게 하고, 이를 통해 사용자가 건강한 피트니스 라이프 스타일을 추구할 수 있게 합니다.<br>
<br>
또한 소셜 미디어의 기능을 갖고 있어, 친구요청 및 수락을 통해 유저들이 어플리케이션 상의 친구를 만들 수 있도록 하였습니다. 유저가 "도전(Challenge) 방"을 생성해서 일정 기간동안 체중감량, 근육량 증가 등 동일한 목표를 가진 친구들을 초대하여 목표 달성시 포인트를 얻고, 목표 미달성시 포인트를 잃는 포인트 순위에 따른 랭킹시스템을 통해 경쟁적이면서도 흥미로운 요소를 한 층 높였습니다.<br>
<br>
이 프로젝트는 Nest.js, MySQL, TypeORM을 활용하여 제작되었으며, 사용자의 신체 변화 그래프를 기반으로 맞춤형 종합 평가를 제공하고 이를 통해 사용자에게 보다 다양하고 개인화된 경험을 제공합니다.<br>
<br>

## 🔎주요 기능

- 체성분 측정 결과를 토대로 기간 별 변화 그래프로 성과 확인
- 해당 측정 일자의 체성분 분석표 상세조회
- 체성분 기반 종합평가 제공 및 식단 및 운동법 피드백
- 다른 유저에게 친구요청, 수락 및 거절 기능, 유저조회 및 친구취소 기능
- 도전방 목표설정, 도전방 초대, 수락 및 거절 기능
- 도전방 내 유저 '오운완 (오늘 운동 완성)' 운동 인증 포스팅
- 도전방 목표 달성시 포인트 부여, 포인트 기준 전체랭킹순위 및 친구랭킹순위
- 오운완 좋아요 및 댓글 신고 기능
- Admin과 User를 분리, 관리자(Admin)권한 유저 블랙리스트 추가 및 조회기능
- 유저의 프로필 페이지에서 프로필 및 유저의 친구 목록, 도전 목록 확인
- 카카오 소셜 로그인 기능
<br>

## 😊팀원 소개

- **Team**

  - 팀명 : 와일드 바디 (Wild Body)
  - 김필선(팀장)([https://github.com/sunsurely](https://github.com/sunsurely))
  - 김재용(부팀장)([https://github.com/kme-developer](https://github.com/kme-developer))
  - 이상우([https://github.com/sangwoorhie](https://github.com/sangwoorhie))
  - 이연오([https://github.com/yeonoh0101](https://github.com/yeonoh0101))
<br>

## ⚒️Project Architecture

<p align="center">
<img width="766" alt="image" src="https://github.com/sunsurely/outbody_front/assets/131964697/abbcfb01-bcc7-4ca9-a50d-ac0ad2963fe4">
</p>
<br>

## 🖋️Tech Stack

|   components   |       Tech Stack        |
| :------------: | :---------------------: | 
|    Language    | Javascript (Typescript) |
|   FrameWork    |         Nest.js         |
|    DataBase    |     MySQL / typeORM     |
|    Protocol    |          HTTPS          |
|     Server     |    AWS - EC2/RDS/S3     |
|     Socket     |        Socket.io        |
| Authentication |        Passport         |
|    CI / CD     |     GITHUB, SWAGGER     |

<br>

## 📊ERD

- ERD : [https://drawsql.app/teams/jake-7/diagrams/outbody-erd](https://drawsql.app/teams/jake-7/diagrams/outbody-erd)

<p align="center">
<img width="1000" alt="image" src="https://github.com/sunsurely/outbody_front/assets/131964697/12e18ad1-5bcc-4f35-a042-f076cf2c87be">
</p>
<br>

## 💡API

- API : [https://outbody.gitbook.io/api/](https://outbody.gitbook.io/api/)

- 와이어프레임 초안: [https://www.figma.com/file/qAE9NkLOg2pumVLtpecMgw/Untitled?type=design&node-id=0-1&mode=design&t=wFHCpcB3j7KMbisg-0](https://www.figma.com/file/qAE9NkLOg2pumVLtpecMgw/Untitled?type=design&node-id=0-1&mode=design&t=wFHCpcB3j7KMbisg-0)
<br>

## ✍️GITHUB

- Front-End : [https://github.com/sunsurely/outbody_front](https://github.com/sunsurely/outbody_front)
- Back-End : [https://github.com/sunsurely/outbody](https://github.com/sunsurely/outbody)
