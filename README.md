# The Front of Nuber Eats Clone: ReactJS. GraphQL. Typescript. Apollo. TailwindCSS

## 서비스 소개

- 음식 주문 서비스 프로젝트
  <br/><br/>

## Information, Nuber Eats의 Frontend

- 회원 가입시 Owner로 가입하면 음식점을 등록할 수 있다
- 회원 가입시 Client로 가입하면 등록된 음식점 리스트가 나오며 음식을 주문 할 수 있다.
- 회원 가입시 Delivery로 가입하면 Client의 음식주문시 배달을 수주 받을 수 있다.

<br/><br/>

# 기술스택

- React.js
- TailwindCSS
- Apollo
- React Hook Form
- apollo-tooling
- React Testing Library
- Jest
- Cypress

<br/><br/>

## 노드 버전

v 16.15.0

<br/><br/>

## 실행

```javascript
npm run start
```

<br/><br/>

## VSCode extensions

- Tailwind CSS intellSense : 클래스 이름 자동완성 기능

<br/><br/>

## react-router-dom

### v6 업그레이드 하기

- react-router-dom은 v6으로 업그레이드 되면서 useHistory가 navigation과 통합되어 사라졌다.

- useNavigate를 사용하여 동일한 기능을 수행 할 수 있다.

```javascript
npm install react-router-dom@6.2.2
```

<br/><br/>

### ~~버전 5.3.4~~~

```javascript
// npm i react-router-dom@5.3.4
```

<br/><br/>

## graphql-codegen

```javascript
npm run generate
```

Graphql 정의 타입스크립트 자동 생성

- codegen.ts에서 GraphQl 스키마를 HTTP URL에서 가져오는 경우 백엔드 서버가 실행되고 있어야 한다.

- 백엔드 실행 없이도 진행하려면, 로컬 스키마 파일을 사용할 것
  <br/><br/>

## react-helmet-async

```javascript
npm i react-helmet-async
```

https://www.npmjs.com/package/react-helmet-async

<br/><br/>

## Cypress

```javascript
// 프레임워크 열기
npx cypress open
```

E2E 테스팅 프레임워크<br/>

- 브라우저에서 사용자의 동작을 흉내 내어 실제 사용 환경에 가까운 테스트를 할 수 있게 해준다.

https://www.cypress.io/

<br/><br/>

## graphql-ws

- subscriptions-transport-ws는 GraphQL 구독(Subscriptions)을 WebSocket을 통해 처리할 수 있도록 도와주는 라이브러리다.
- 하지만 이 패키지는 더 이상 유지보수되지 않으며, 대신 @apollo/client와 graphql-ws를 사용하는 것이 권장된다.
- graphql-ws는 subscriptions-transport-ws의 대체 라이브러리이다.

<br/><br/>

# 🚨 Trouble Shooting

- ⭕
- ❌

<br/><br/>

# 🚀 추가할 기능

- 레스토랑 커버 이미지 업로드 파일 제한 두기 - add-restaurants

- 레스토랑 추가 버튼 - my-restaurants

- 레스토랑 정보 수정 - my-restaurant

- 요리 옵션 추가에서 choice 기능 추가 - add-dishss

- 프로필 편집에서 유저 좌표 받아 주소 작성하기 - google.maps.Geocoder 사용 /
  - driver/dashboard.tsx 참고

<br/><br/>

# 🚀 새로운 기능 아이디어

- 로그인 전에 remember me라는 체크리스트를 통해 체크 시 로그인을 유지시키고, 체크하지 않을 시 브라우저 종료시 로그인을 유지시키지 않는 기능도 고려해보기
