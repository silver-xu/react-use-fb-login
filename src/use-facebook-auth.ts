import { useState, useEffect } from 'react';

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

type FacebookFields = 'name' | 'email' | 'gender';

export interface FaceBookAuthProps {
  appId: string;
  language: string;
  version: string;
  fields: FacebookFields[];
  onFailure?: () => void;
}

const getWindow = (): any => {
  return window as any;
};

const getUserInfo = (
  props: FaceBookAuthProps,
  state: FaceBookAuthState,
  setState: (state: FaceBookAuthState) => void
): void => {
  getWindow().FB.api('/me', { locale: props.language, fields: props.fields.join(',') }, (response: any) => {
    const currentUser: User = response;
    setState({ ...state, isLoggedIn: true, currentUser, isProcessing: false, loaded: true });
  });
};

const checkLoginCallback = (
  response: any,
  props: FaceBookAuthProps,
  state: FaceBookAuthState,
  setState: (state: FaceBookAuthState) => void
): void => {
  if (response.status === 'connected') {
    getUserInfo(props, state, setState);
  } else {
    setState({ ...state, isLoggedIn: false, currentUser: undefined, isProcessing: false });
  }
};

const setFacekbookAsyncInit = (
  props: FaceBookAuthProps,
  state: FaceBookAuthState,
  setState: (state: FaceBookAuthState) => void
): void => {
  getWindow().fbAsyncInit = () => {
    getWindow().FB.init({
      version: `v${props.version}`,
      appId: `${props.appId}`,
      xfbml: false,
      cookie: false,
    });

    setState({
      ...state,
      isSdkLoaded: true,
    });

    getWindow().FB.getLoginStatus((response: any) => checkLoginCallback(response, props, state, setState));
  };
};

const loadSdkAsynchronously = (props: FaceBookAuthProps, state: FaceBookAuthState): void => {
  ((doc: Document, script: string, sdkId: string) => {
    const newScriptElement = doc.createElement(script) as HTMLScriptElement;

    newScriptElement.id = sdkId;
    newScriptElement.src = `https://connect.facebook.net/${props.language}/sdk.js`;
    doc.head.appendChild(newScriptElement);

    let fbRoot = doc.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = doc.createElement('div');
      fbRoot.id = 'fb-root';
      doc.body.appendChild(fbRoot);
    }
  })(document, 'script', 'facebook-jssdk');
};

const loginCallback = (
  response: any,
  props: FaceBookAuthProps,
  state: FaceBookAuthState,
  setState: (state: FaceBookAuthState) => void
): void => {
  if (response.authResponse) {
    getUserInfo(props, state, setState);
  } else {
    if (props.onFailure) {
      props.onFailure();
      setState({ ...state, isProcessing: false });
    }
  }
};

const logoutCallback = (
  response: any,
  props: FaceBookAuthProps,
  state: FaceBookAuthState,
  setState: (state: FaceBookAuthState) => void
): void => {
  if (response.authResponse) {
    setState({
      ...state,
      isLoggedIn: false,
      currentUser: undefined,
      isProcessing: false,
    });
  } else {
    if (props.onFailure) {
      props.onFailure();
    }
  }
};

export const useFacebookAuth = (props: FaceBookAuthProps): [FaceBookAuthState, () => void, () => void] => {
  const [state, setState] = useState<FaceBookAuthState>({
    isSdkLoaded: false,
    isProcessing: false,
    isLoggedIn: false,
    loaded: false,
  });

  const login = (): void => {
    setState({ ...state, isProcessing: true });
    getWindow().FB.login((response: any) => loginCallback(response, props, state, setState));
  };

  const logout = (): void => {
    setState({ ...state, isProcessing: true });
    getWindow().FB.logout((response: any) => logoutCallback(response, props, state, setState));
  };

  useEffect(() => {
    setState({
      ...state,
      isProcessing: true,
    });

    setFacekbookAsyncInit(props, state, setState);
    loadSdkAsynchronously(props, state);
  }, [props]);

  return [state, login, logout];
};
