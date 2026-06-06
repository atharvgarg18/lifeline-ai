import { Request, Response } from 'express';
import { healthService } from './health.service';

let latestAccessToken = '';

export const connectGoogleHealth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authUrl = healthService.generateGoogleAuthUrl();

    res.status(200).json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to generate OAuth URL',
    });
  }
};

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const code = req.query.code as string;

    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Authorization code missing',
      });
      return;
    }

    const tokens = await healthService.exchangeCodeForTokens(code);

    latestAccessToken = tokens.accessToken || '';

    res.status(200).json({
      success: true,
      message: 'Google account connected successfully',
      tokens,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to exchange authorization code',
    });
  }
};

export const getTodaySteps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!latestAccessToken) {
      res.status(400).json({
        success: false,
        message: 'Google account not connected',
      });
      return;
    }

    const data = await healthService.getTodaySteps(
      latestAccessToken
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch fitness data',
    });
  }
};
export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!latestAccessToken) {
      res.status(400).json({
        success: false,
        message: 'Google account not connected',
      });
      return;
    }

    const stepsData = await healthService.getTodaySteps(
  latestAccessToken
);

const caloriesData = await healthService.getCalories(
  latestAccessToken
);

const distanceData = await healthService.getDistance(
  latestAccessToken
);

const heartRateData = await healthService.getHeartRate(
  latestAccessToken
);

const sleepData = await healthService.getSleepHours(
  latestAccessToken
);

res.status(200).json({
  success: true,
  data: {
    steps: stepsData,
    calories: caloriesData,
    distance: distanceData,
    heartRate: heartRateData,
    sleepHours: sleepData,
  },
});
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard metrics',
    });
  }
};