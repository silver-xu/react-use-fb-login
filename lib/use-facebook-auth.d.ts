export interface User {
    id?: string;
    name?: string;
    email?: string;
}
export interface FaceBookAuthState {
    isSdkLoaded: boolean;
    isProcessing: boolean;
    isLoggedIn: boolean;
    currentUser?: User;
    loaded: boolean;
}
declare type FacebookFields = 'name' | 'email' | 'gender';
export interface FaceBookAuthProps {
    appId: string;
    language: string;
    version: string;
    fields: FacebookFields[];
    onFailure?: () => void;
}
export declare const useFacebookAuth: (props: FaceBookAuthProps) => [FaceBookAuthState, () => void, () => void];
export {};
