import React, { useEffect } from 'react';
// import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import CheckAuthenticated from './components/checkAuthenticated';
import LoginOut from './components/logInOut';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

const App = () => {
    return (
        <Provider store={store}>
            <CheckAuthenticated />
            <Container>
                <Header>
                    <Left>
                        <Button transparent>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Header</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <LoginOut />
                </Content>
                <Footer>
                    <FooterTab>
                        <Button>
                            <Icon name="apps" />
                        </Button>
                        <Button>
                            <Icon name="camera" />
                        </Button>
                        <Button active>
                            <Icon active name="navigate" />
                        </Button>
                        <Button>
                            <Icon name="person" />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        </Provider>
    );
};

export default App;