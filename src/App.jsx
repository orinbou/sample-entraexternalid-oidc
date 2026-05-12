import { useAuth } from 'react-oidc-context';

function App() {
  const auth = useAuth();

  // JWT トークンをデコードする関数
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  switch (auth.activeNavigator) {
    case 'signinSilent':
      return <div>Signing you in silently...</div>;
    case 'signoutRedirect':
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    const accessTokenPayload = auth.user?.access_token
      ? decodeToken(auth.user.access_token)
      : null;

    return (
      <div style={{ padding: '20px' }}>
        <h1>Hello {auth.user?.profile.name || auth.user?.profile.sub}</h1>
        
        <h2>ID Token (Profile)</h2>
        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(auth.user?.profile, null, 2)}
        </pre>

        <h2>Access Token</h2>
        {accessTokenPayload ? (
          <pre style={{ backgroundColor: '#e8f4f8', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(accessTokenPayload, null, 2)}
          </pre>
        ) : (
          <p>Access token not available</p>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => auth.removeUser()} style={{ marginRight: '10px' }}>
            Clear Storage
          </button>
          <button onClick={() => auth.signoutRedirect()}>
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Entra ID OIDC Sample</h1>
      <p>Please log in to see your profile.</p>
      <button onClick={() => auth.signinRedirect()}>Log in</button>
    </div>
  );
}

export default App;
