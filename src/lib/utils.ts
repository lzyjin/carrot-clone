export function formatToTimeAgo(date: Date) {
  const today = new Date();
  const diff = today.getTime() - date.getTime();

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diff > year) {
    return `${Math.floor(diff / year)}년 전`;
  }

  if (diff > month) {
    return `${Math.floor(diff / month)}달 전`;
  }

  if (diff > week) {
    return `${Math.floor(diff / week)}주 전`;
  }

  if (diff > day) {
    return `${Math.floor(diff / day)}일 전`;
  }

  if (diff > hour) {
    return `${Math.floor(diff / hour)}시간 전`;
  }

  if (diff > minute) {
    return `${Math.floor(diff / minute)}분 전`;
  } else {
    return `방금 전`;
  }

  // 혹은 (이 방법은 며칠 전인지만 나타냄)
  // const diff = date.getTime() - today.getTime() ;
  // const rtf = new Intl.RelativeTimeFormat("ko", {
  //   style: "long",
  // });
  //
  // return rtf.format(Math.floor(diff / (1000 * 60 * 60 * 24)), "day");
}

export function formattedPrice(price: number) {
  return new Intl.NumberFormat("ko-KR", {
    // style: "currency",
    currency: "KRW",

  }).format(price);

  // 혹은
  // return price.toLocaleString("ko-KR");
}