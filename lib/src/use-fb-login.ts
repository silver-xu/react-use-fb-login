import { useState, useEffect } from 'react';

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

type FacebookFields = 'name' | 'email' | 'gender' | 'id';

export interface FaceBookLoginProps {
  appId: string;
  language: string;
  version: string;
  fields: FacebookFields[];
  onFailure?: (response: any) => void;
}

const getWindow = (): any => {
  return window as any;
};

const getUserInfo = (
  props: FaceBookLoginProps,
  state: FaceBookLoginState,
  setState: (state: FaceBookLoginState) => void
): void => {
  getWindow().FB.api('/me', { locale: props.language, fields: props.fields.join(',') }, (response: any) => {
    const currentUser: User = response;
    setState({
      ...state,
      isLoggedIn: true,
      currentUser,
      isProcessing: false,
      loaded: true,
    });
  });
};

const checkLoginCallback = (
  response: any,
  props: FaceBookLoginProps,
  state: FaceBookLoginState,
  setState: (state: FaceBookLoginState) => void
): void => {
  if (response.status === 'connected') {
    getUserInfo(props, state, setState);
  } else {
    setState({
      ...state,
      isLoggedIn: false,
      currentUser: undefined,
      isProcessing: false,
    });
  }
};

const setFacekbookAsyncInit = (
  props: FaceBookLoginProps,
  state: FaceBookLoginState,
  setState: (state: FaceBookLoginState) => void
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

const loadSdkAsynchronously = (props: FaceBookLoginProps, state: FaceBookLoginState): void => {
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
  props: FaceBookLoginProps,
  state: FaceBookLoginState,
  setState: (state: FaceBookLoginState) => void
): void => {
  if (response.authResponse) {
    getUserInfo(props, state, setState);
  } else {
    if (props.onFailure) {
      props.onFailure(response);
      setState({ ...state, isProcessing: false });
    }
  }
};

const logoutCallback = (
  response: any,
  props: FaceBookLoginProps,
  state: FaceBookLoginState,
  setState: (state: FaceBookLoginState) => void
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
      props.onFailure(response);
    }
  }
};

export const useFacebookLogin = (props: FaceBookLoginProps): [FaceBookLoginState, () => void, () => void] => {
  const [state, setState] = useState<FaceBookLoginState>({
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
  }, [props.appId, props.fields.join(','), props.language, props.version]);

  return [state, login, logout];
};
