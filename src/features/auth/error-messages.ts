const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Email & password
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_NOT_FOUND: "No account found with that email.",
  ACCOUNT_NOT_FOUND: "No account found with that email.",
  USER_ALREADY_EXISTS: "An account with that email already exists. Try signing in.",
  EMAIL_ALREADY_EXISTS: "An account with that email already exists. Try signing in.",
  PASSWORD_TOO_SHORT: "Password is too short. Use at least 8 characters.",
  PASSWORD_MISMATCH: "Passwords do not match.",
  WEAK_PASSWORD: "Password is too weak. Use letters and numbers.",
  SIGNUP_DISABLED: "New accounts are currently disabled. Please try again later.",

  // OAuth
  INVALID_SOCIAL_TOKEN: "We couldn't sign you in with Google. Please try again.",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "This Google account is already linked to another account.",
  FAILED_TO_CREATE_USER: "We couldn't create your account. Please try again.",
  FAILED_TO_CREATE_SESSION: "We couldn't start a session. Please try again.",
  FAILED_TO_CREATE_ACCOUNT: "We couldn't link your Google account. Please try again.",
  EMAIL_VERIFICATION_NEEDED: "Please verify your email before signing in.",

  // Generic
  INVALID_REQUEST: "The request was invalid. Please try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
}

export function getAuthErrorMessage(code?: string): string {
  if (!code) return "Something went wrong. Please try again."
  return AUTH_ERROR_MESSAGES[code] ?? "Something went wrong. Please try again."
}

export function getAuthErrorMessageFromResponse(
  error: { code?: string; message?: string } | undefined,
): string {
  if (!error) return "Something went wrong. Please try again."
  return getAuthErrorMessage(error.code ?? error.message)
}
