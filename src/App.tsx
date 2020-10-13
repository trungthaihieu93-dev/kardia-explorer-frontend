import React, { Component } from 'react';
import 'rsuite/lib/styles/index.less';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import KAIHeader from './common/components/Header';
import KAIFooter from './common/components/Footer';
import Home from './pages/Home';
import TxDetail from './pages/TxDetail';
import Network from './pages/Network';
import { Container, Header, Content, Footer } from 'rsuite';
import Wallet from './pages/Wallet';
import CreateNewWallet from './pages/Wallet/CreateNewWallet';
import AccessMyWallet from './pages/Wallet/AccessMyWallet';
import Faucet from './pages/Faucet';
import { ViewportProvider } from './context/ViewportContext';
import DashboardWallet from './pages/Wallet/Dashboard';
import Staking from './pages/Staking';

  class App extends Component {
    render() {
      return (
        <ViewportProvider>
          <Router>
            <Container className="kai-explorer-app">
              <Header>
                <KAIHeader />
              </Header>
              <Content>
                <Switch>
                  <Route path="/network">
                    <Network />
                  </Route>
                  <Route path="/tx">
                    <TxDetail />
                  </Route>
                  <Route path="/staking">
                    <Staking />
                  </Route>
                  <Route path="/wallet">
                    <Wallet />
                  </Route>
                  <Route path="/create-wallet">
                    <CreateNewWallet />
                  </Route>
                  <Route path="/access-wallet">
                    <AccessMyWallet />
                  </Route>
                  <Route path="/dashboard">
                    <DashboardWallet />
                  </Route>
                  <Route path="/faucet">
                    <Faucet />
                  </Route>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
              </Content>
              <Footer><KAIFooter /></Footer>
            </Container>
          </Router>
        </ViewportProvider>
      );
    }
  }

  export default App;