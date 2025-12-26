import { Auth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/auth', '') || 'http://localhost:5001/api';

export interface DashboardStats {
    monthlyUsage: number;
    monthlyLimit: number;
    totalConverted: number;
}

export interface ConversionHistoryItem {
    id: number;
    filename: string;
    fileSize: number;
    timestamp: string;
    status: string;
}

export const DashboardService = {
    async fetchStats(): Promise<DashboardStats> {
        const token = Auth.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        return response.json();
    },

    async fetchHistory(): Promise<ConversionHistoryItem[]> {
        const token = Auth.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/dashboard/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) return [];
        return response.json();
    },

    async trackSuccess(originalBlob: Blob | null, processedBlob: Blob | null): Promise<any> {
        const token = Auth.getToken();
        if (!token) return;

        let imageData: string | null = null;
        let originalImage: string | null = null;

        // Convert Processed Image
        if (processedBlob) {
            imageData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(processedBlob);
            });
        }

        // Convert Original Image
        if (originalBlob) {
            originalImage = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(originalBlob);
            });
        }

        const response = await fetch(`${API_BASE_URL}/user/track`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageData, originalImage })
        });

        if (!response.ok) throw new Error('Failed to track usage');
        return response.json();
    },

    async fetchImageBlob(logId: number, type: 'original' | 'processed'): Promise<Blob | null> {
        const token = Auth.getToken();
        if (!token) return null;

        const response = await fetch(`${API_BASE_URL}/dashboard/image/${logId}/${type}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) return null;
        return response.blob();
    }
};
