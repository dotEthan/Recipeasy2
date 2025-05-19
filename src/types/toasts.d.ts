export type ToastQueue = {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
    remaining?: number;
    timeoutId?: number;
}

export const ToastType = {
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info'
} as const;

export type ToastType = typeof ToastType[keyof typeof ToastType];