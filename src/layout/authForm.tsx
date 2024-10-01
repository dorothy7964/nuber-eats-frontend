import React from "react";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { regexPatterns } from "../common/regexPatterns";

interface AuthFormProps {
  isRequire?: boolean;
  onSubmit: (data: any) => void;
  register: any;
  errors: any;
  isValid: boolean;
  loading: boolean;
  buttonText: string;
  children?: React.ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isRequire = true, // 기본은 true, 프로필 편집일 때 false
  onSubmit,
  register,
  errors,
  isValid,
  loading,
  buttonText,
  children
}) => (
  <form onSubmit={onSubmit} className="grid gap-3 mt-5 w-full mb-5">
    {/* 이메일 */}
    <input
      {...register("email", {
        required: isRequire ? "이메일을 입력해 주세요." : undefined,
        pattern: {
          value: regexPatterns["email"],
          message: "잘못된 이메일 형식입니다."
        }
      })}
      required={isRequire}
      type="email"
      placeholder="이메일"
      className="input mb-3"
    />
    {errors.email?.message && (
      <FormError errorMessage={errors.email?.message} />
    )}
    {/* 비밀번호 */}
    <input
      {...register("password", {
        required: isRequire ? "비밀번호를 입력해 주세요." : undefined,
        minLength: 5
      })}
      required={isRequire}
      type="password"
      placeholder="비밀번호"
      className="input"
    />
    {errors.password?.message && (
      <FormError errorMessage={errors.password?.message} />
    )}
    {errors.password?.type === "minLength" && (
      <FormError errorMessage="비밀번호는 5자 이상이어야 합니다." />
    )}
    {children}
    <Button canClick={isValid} loading={loading} actionText={buttonText} />
  </form>
);
