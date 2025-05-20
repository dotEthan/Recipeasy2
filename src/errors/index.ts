import { CriticalErrorAction, ErrorDetails, FieldError } from "@/types/errors";

export class BaseError extends Error {
    public details: ErrorDetails;
    public timestamp: Date;

    constructor(message: string, details: ErrorDetails = {}) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
        this.timestamp = new Date();
    }
}

export class ValidationError extends BaseError {
    public errorCode: 'VALIDATION';
    constructor(message: string, fieldErrors:FieldError = {}) {
        super(message, { fieldErrors });
        this.errorCode = 'VALIDATION'
    }

    get fieldErrors(): FieldError {
        return this.details.fieldErrors || {};
    }
}

export class AuthError extends BaseError {
    public errorCode = 'AUTH_REQUIRED';
    constructor(message = 'Authentication required') {
        super(message);
    }
}

export class PermissionError extends BaseError {
    public errorCode = 'PERMISSION_FAILED';
    constructor(message = 'Resource not owned by user') {
        super(message);
    }
}

export class NonCriticalError extends BaseError {
    public errorCode = 'NON_CRITICAL';
    constructor(message: string) {
        super(message);
    }
}

export class CriticalError extends BaseError {
    public errorCode = 'CRITICAL';
    constructor(message: string, details: ErrorDetails = {}) {
        super(message, details);
    }
}