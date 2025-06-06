export type RegistrationDTO = {
    name: string;
    username: string;
    email: string;
    password: string;
    avatar_url?: string;
    customization_options?: string;
    isUsernameValid: boolean;
    isEmailValid: boolean;
}

export type BadSignupRequest = {
    passwordValidationError?: [string],
    error: [string]
}