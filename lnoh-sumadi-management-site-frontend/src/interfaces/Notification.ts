// eslint-disable-next-line no-shadow
export enum NotificationType {
    Success = 'success',
    Error = 'error',
    Empty = ''
}

export interface Notification {
    show: boolean,
    message: string,
    type: NotificationType
}
