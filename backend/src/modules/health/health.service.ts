import { google } from 'googleapis';
import { ENV } from '../../config/env';

export class HealthService {
  private oauth2Client;

  constructor() {
    console.log('CLIENT_ID:', ENV.GOOGLE_CLIENT_ID);
    console.log('REDIRECT_URI:', ENV.GOOGLE_REDIRECT_URI);

    this.oauth2Client = new google.auth.OAuth2(
      ENV.GOOGLE_CLIENT_ID,
      ENV.GOOGLE_CLIENT_SECRET,
      ENV.GOOGLE_REDIRECT_URI
    );
  }

  generateGoogleAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.heart_rate.read',
        'https://www.googleapis.com/auth/fitness.location.read',
        'https://www.googleapis.com/auth/fitness.sleep.read',
      ],
    });
  }

  async exchangeCodeForTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }

  
  
  
  async getTodaySteps(accessToken: string) 
  {
    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const fitness = google.fitness({
      version: 'v1',
      auth: oauth2Client,
    });

    const now = new Date();

const startOfToday = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  0,
  0,
  0,
  0
);

const startTimeMillis = startOfToday.getTime();
const endTimeMillis = now.getTime();
    

    const response: any = await (fitness.users.dataset.aggregate as any)({
  userId: 'me',
  requestBody: {
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
          },
        ],
        bucketByTime: {
          durationMillis: 86400000,
        },
        startTimeMillis,
        endTimeMillis,
      },
    });

    console.log(
  JSON.stringify(response.data, null, 2)
);

return response.data;
  }
  async getCalories(accessToken: string) {
  return this.getMetric(
    accessToken,
    'com.google.calories.expended'
  );
}

async getDistance(accessToken: string) {
  return this.getMetric(
    accessToken,
    'com.google.distance.delta'
  );
}

async getHeartRate(accessToken: string) {
  return this.getMetric(
    accessToken,
    'com.google.heart_rate.bpm'
  );
}

async getSleepHours(accessToken: string) {
  return this.getMetric(
    accessToken,
    'com.google.sleep.segment'
  );
}

private async getMetric(
  accessToken: string,
  dataTypeName: string
) {
  const oauth2Client = new google.auth.OAuth2();

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const fitness = google.fitness({
    version: 'v1',
    auth: oauth2Client,
  });

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );

  const response: any =
    await (fitness.users.dataset.aggregate as any)({
      userId: 'me',
      requestBody: {
        aggregateBy: [
          {
            dataTypeName,
          },
        ],
        bucketByTime: {
          durationMillis: 86400000,
        },
        startTimeMillis: startOfToday.getTime(),
        endTimeMillis: now.getTime(),
      },
    });

  return response.data;
}
}

export const healthService = new HealthService();