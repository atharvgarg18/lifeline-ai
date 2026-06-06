export interface GoogleOAuthResponse {
authUrl: string;
}

export interface GoogleTokenResponse {
accessToken: string;
refreshToken?: string;
}

export interface HealthApiResponse {
success: boolean;
message: string;
data?: unknown;
}
