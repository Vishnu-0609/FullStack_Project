import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@coreui/coreui/dist/css/coreui.min.css'
import { Auth0Provider } from '@auth0/auth0-react';
import "./style.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="vishnudev-3ow3vpnkd2gr8xlq.us.auth0.com"
    clientId="NDO2Nja6by2ewZXfFGE54pGvXfbp2d5I"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App/>
  </Auth0Provider>,
)
