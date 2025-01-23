import { Request, Response } from 'express';

export const testHealth = async (req: Request, res: Response) => {
    try {
        const healthData = {
            uptime: process.uptime(),
            timestamp: Date.now(),
            message: 'REST API is healthy',
            serverInfo: {
                nodeVersion: process.version,
                platform: process.platform,
                memoryUsage: process.memoryUsage()
            }
        };

        res.status(200).json(healthData);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};