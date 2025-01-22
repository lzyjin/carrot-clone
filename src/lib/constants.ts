export const REQUIRED_ERROR = "필수 입력 항목입니다.";

export const PASSWORD_REGEX = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);
export const PASSWORD_REGEX_ERROR = "영문 대소문자, 숫자, 특수문자를 포함해야 합니다.";

export const PASSWORD_MIN_LENGTH = 5;
export const PASSWORD_MIN_LENGTH_ERROR = `${PASSWORD_MIN_LENGTH}자 이상 작성하세요.`;

export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_MAX_LENGTH_ERROR = `${USERNAME_MAX_LENGTH}자 이내로 작성하세요.`;

export const SMS_TOKEN_MIN = 100000;
export const SMS_TOKEN_MAX = 999999;