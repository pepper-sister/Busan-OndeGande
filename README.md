
<div align="center">

![Busan's OndeGande Logo](./logo.png)
===

</div>

> **부산's 온데간데**는 사용자에게 특별한 부산 여행 경험을 제공하기 위해 만들어진 **웹 애플리케이션**입니다. 이 프로젝트는 **한국관광공사**에서 주최한 **2024 관광데이터 활용 공모전**을 통해 제작되었습니다. 한국관광공사 및 부산광역시의 Tour API, KaKao Map API 등 여러 외부 API를 활용하여 부산의 다양한 여행 코스, 관광지, 맛집, 숙소 등을 추천함으로써 ‘온데간데’라는 부산 사투리처럼, 부산의 다양한 명소를 **여기저기 어디든** 자유롭게 탐험할 수 있는 서비스를 제공합니다.

## 사이트
https://www.ondegande.site/

## 기능

- **축제 정보 제공** : 현재에 해당하는 달의 부산시 축제 정보를 제공하여 부산 여행 계획을 구성하는 데에 도움을 줍니다.
- **코스 짜보이소**: 사용자가 직접 Day(n박 m일)를 설정하고, 장소를 추가하여 자신의 코스를 생성할 수 있고, 외부로 복사·공유가 가능합니다.
- **인자 머하노?**: 설정한 위치(현재 위치 또는 직접 검색)를 바탕으로 주변 관광지, 맛집, 숙소를 추천하여 즉흥적인 여행을 더욱 편하게 돕습니다.
- **이래 가보이소**: 부산의 구/군과 다양한 테마(맛, 레저, 힐링 등)에 따른 다양한 추천 코스를 사용자의 설정에 맞춰 제공합니다.
- **유튜바 코스**: 실제 유튜버들이 부산을 방문한 영상을 기반으로 각 유튜버의 영상과 코스, 동선 정보를 나타냅니다.

## 기술 스택

- **프론트엔드**: React, JavaScript, CSS
- **Tour API**
  - 한국관광공사_국문 관광정보 서비스_GW
  - 부산광역시_부산축제정보 서비스
  - 부산광역시_부산테마여행정보 서비스
- **지도 API**: Kakao Map API
- **데이터 소스**
  - [한국관광공사_국문 관광정보 서비스_GW](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15101578)
  - [부산광역시_부산축제정보 서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15063500)
  - [부산광역시_부산테마여행정보 서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15063506)
  - [KaKao Map API](https://apis.map.kakao.com/web/)
