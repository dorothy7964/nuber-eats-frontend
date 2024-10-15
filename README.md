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

# 🚨 Trouble Shooting

- ⭕
- ❌

<br/><br/>

# 🚀 새로운 기능 아이디어

- 로그인 전에 remember me라는 체크리스트를 통해 체크 시 로그인을 유지시키고, 체크하지 않을 시 브라우저 종료시 로그인을 유지시키지 않는 기능도 고려해보기
