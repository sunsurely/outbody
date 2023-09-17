# Out Body

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## 🎯서비스 소개

OUTBODY는 체성분 측정기록 기반 SNS 서비스로써, 사용자가 자신의 키, 몸무게, 체지방률, 골격근량, 기초대사량 등을 일정 기간동안 기입함으로써 변화되는 그래프를 통해 자신의 신체상태를 한 눈에 알아볼 수 있게 하고, 이를 통해 사용자가 건강한 피트니스 라이프 스타일을 추구할 수 있게 도와줍니다.<br>
<br>
또한 SNS의 기능을 갖고 있어, 친구 요청 및 수락을 통해 사용자들이 서비스 상에서 친구를 만들 수 있도록 하였습니다. 사용자가 도전을 생성해서 일정 기간동안 동일한 목표를 가진 친구들을 초대하여 목표 달성시 점수를 얻고, 목표 미달성시 점수를 잃는 등 점수에 따른 순위 계산을 통해 경쟁적이면서도 흥미로운 요소를 한 층 높였습니다.<br>
<br>
이 프로젝트는 Nest.js, MySQL, TypeORM을 활용하여 제작되었으며, 사용자의 신체 변화 그래프를 기반으로 맞춤형 종합 평가를 제공하고 이를 통해 사용자에게 보다 다양하고 개인화된 경험을 제공합니다.<br>
<br>

## 🔎주요 기능

✅ **체성분 측정**

- 체성분 측정 결과를 토대로 기간 별 체성분 변화 그래프 제공
- 해당 측정 일자의 체성분 분석표 상세조회
- 체성분 기반 종합평가 제공 및 식단과 운동법에 대한 개인 맞춤형 피드백
- 연령과 성별을 기준으로 다른 사용자들의 평균 체성분 데이터 제공
 <br>
✅ **친구 요청, 도전 초대**

- 다른 사용자에게 친구 요청 및 수락, 거절
- 사용자가 현재 참여한 도전에 친구 초대 및 수락, 거절
<br>

✅ **도전, 오운완**

- 도전 기간, 인원, 공개 여부, 목표 설정 후 생성
- 도전 생성 후 생성일이 지났는데도 참여자가 없을 경우 자동 삭제 처리
- 도전 종료 시 성공, 실패 여부 자동 판단 후 점수 분배 및 차감 처리
- 도전방 내 사용자의 '오운완(출석 인증)' 게시물 작성
- 포스팅한 오운완 게시물은 사이드바의 오운완 탭에서 모든 사용자가 확인 가능
- 오운완 게시글 좋아요 및 댓글을 통한 소통, 악성댓글 신고 가능
<br>

✅ **점수, 순위**

- 도전 목표(출석, 체성분) 달성시 로직에 따라 점수 부여, 미달성시 점수 차감 기능
- 점수 기준 전체 순위 및 내 친구 순위 조회
- 2주간 도전 미참시 자동 점수 삭감으로 인한 도전 참여 동기 부여
<br>

✅ **관리자**

- 관리자 계정 인증 시 직접 사용자 조회 후 영구 정지 회원 처리 가능
- 관리자 계정 인증 시 신고받은 댓글 조회 및 영구 정지 회원 처리 가능
  <br>

## 😊팀원 소개

- **Team**

  - 팀명 : 와일드 바디 (Wild Body)
  - 김필선(팀장)([https://github.com/sunsurely](https://github.com/sunsurely)) 
  - 김재용(부팀장)([https://github.com/mr-olympia-jay](https://github.com/mr-olympia-jay)) 
  - 이상우([https://github.com/sangwoorhie](https://github.com/sangwoorhie)) 
  - 이연오([https://github.com/yeonoh0101](https://github.com/yeonoh0101))
    <br>

## ⚒️Project Architecture

<p align="center">
<img width="766" alt="image" src="https://github.com/sunsurely/outbody/assets/131964697/d4ec39d4-50c3-426f-baff-b4502d056569">
</p>
<br>

## 🖋️Tech Stack

|   사용 기술              |      도입 이유                                                                                             |
| :------------:           | :---------------------:                                                                                     |
|    Nest.js               | TypeScript를 지원하며, 기능별로 모듈화가 용이하므로 협업의 편의성과 유지보수성을 향상하기 위해 채택            |
|   MySQL / typeORM        |        TypeScript를 지원하며,  Nest.JS와 연계가 좋음. 또한 좀 더 직관적이고 유연한 query builder 사용 가능    |
|    HTTPS                 |    SSL 인증서를 사용하여 브라우저와 서버 간 연결이 암호화되어 안전한 데이터 통신이 가능                        |
|    AWS-EC2 / RDS / S3    |       편리하고 저렴하게 서버 가동, 데이터베이스, 사진 저장이 가능                                             |
|     Bcrypt               |   비밀번호를 해싱처리하여 사용자의 비밀번호를 안전하게 보관이 가능                                            |
|     JWT                  |       상태 저장 없이 인증정보를 전달하여 서버의 부하를 감소시키고 높은 확장성을 지님                           |
| Node Mailer              |     회원가입시 이메일 인증을 통해 무분별한 회원가입을 방지하고 사용자를 특정하기 위해 도입                     |

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
