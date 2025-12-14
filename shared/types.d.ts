/**
 * Shared TypeScript Types
 * Types used across both frontend and backend
 */
export interface ApiResponse<T = any> {
    status: 'success' | 'error' | 'fail';
    message?: string;
    data?: T;
    timestamp?: string;
}
export interface HelloWorldResponse {
    message: string;
    timestamp: string;
    status: string;
    name?: string;
}
export interface GreetingRequest {
    name: string;
}
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
}
export interface ChatRequest {
    message: string;
    history?: ChatMessage[];
}
export interface ChatResponse {
    message: string;
    role: 'assistant';
    timestamp: string;
    model?: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
}
export interface AIHealthResponse {
    status: string;
    provider: string;
    configured: boolean;
    model?: string;
    note?: string;
}
export interface AIConfigResponse {
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
    configured: boolean;
}
export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
    environment: string;
}
export interface ErrorResponse {
    status: 'error' | 'fail';
    message: string;
    stack?: string;
}
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=types.d.ts.map