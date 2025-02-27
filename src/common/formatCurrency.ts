export const formatCurrency = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW", // "USD", "KRW", "EUR"
  minimumFractionDigits: 0 // 원화는 일반적으로 소수점이 없음
  // useGrouping: false //	천 단위 구분자 사용 여부 (기본값: true)
});
