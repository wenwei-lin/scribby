"use server";

import { createClient } from "@/utils/supabase/server";

export async function loginOrRegister({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const supabase = await createClient();

    // 先尝试登录
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (!loginError && loginData.user) {
      return { success: true, message: "登录成功" };
    }

    console.log(loginError?.message);

    // 如果是账号不存在的错误，尝试注册
    if (loginError && loginError.message && loginError.message !== "aaa") {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });
      if (!signUpError && signUpData.user) {
        return { success: true, message: "注册成功，已自动登录" };
      } else {
        return { success: false, message: signUpError?.message || "注册失败" };
      }
    }

    // 其他登录错误
    return { success: false, message: loginError?.message || "登录失败" };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error?.message };
  }
}
