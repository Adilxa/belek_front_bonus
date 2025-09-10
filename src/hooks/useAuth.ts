import $api from "@/lib/api"

const useAuth = () => {

  const onLogin = async (phone: string, name: string) => {
    try {
      const res = await $api.post('/auth/login/initiate', {
        phoneNumber: phone,
        name: name
      })
      return res.data
   } catch (e: unknown) {
  throw e;
}
  }

  const otpVerify = async (phoneNumber: string, otpCode: string) => {
    const phone = phoneNumber.trim()
    try {
      const res = await $api.post("/auth/verify-otp", {
        phoneNumber: `+${phone}`,
        otpCode
      })
      
      // Сохраняем пользователя в localStorage
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      return res
    } catch (e: unknown) {
      throw e;
    }
  }

  return {
    onLogin,
    otpVerify
  }
}

export default useAuth;