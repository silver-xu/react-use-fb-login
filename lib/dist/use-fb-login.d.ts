export interface User {
    id?: string;
    name?: string;
    email?: string;
}
export interface FaceBookLoginState {
    isSdkLoaded: boolean;
    isProcessing: boolean;
    isLoggedIn: boolean;
    currentUser?: User;
    loaded: boolean;
}
declare type FacebookFields = 'name' | 'email' | 'gender' | 'id';
export interface FaceBookLoginProps {
    appId: string;
    language: string;
    version: string;
    fields: FacebookFields[];
    onFailure?: (response: any) => void;
}
export declare const useFacebookLogin: (props: FaceBookLoginProps) => [FaceBookLoginState, () => void, () => void];
export {};
