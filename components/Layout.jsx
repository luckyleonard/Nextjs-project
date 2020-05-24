import { useState, useCallback } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { Layout, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd';
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import Container from './Container';
import { logout } from '../store/store';

const { Header, Content, Footer } = Layout;

const GithubIconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20,
};
const footerStyle = {
  textAlign: 'center',
};

const PageLayout = ({ children, user, logout, router }) => {
  const [search, setSearch] = useState('');

  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);
  const handleOnSearch = useCallback(() => {}, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const userDropDown = () => {
    return (
      <Menu>
        <Menu.Item>
          <a onClick={handleLogout}>Log out</a>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <>
      <Layout>
        <Header>
          <Container renderer={<div className='header-inner' />}>
            <div className='header-left'>
              <div className='logo'>
                <GithubOutlined style={GithubIconStyle} />
              </div>
              <div>
                <Input.Search
                  placeholder='Search Repositories'
                  value={search}
                  onChange={handleSearchChange}
                  onSearch={handleOnSearch}
                />
              </div>
            </div>
            <div className='header-right'>
              <div className='user'>
                {user && user.id ? (
                  <Dropdown overlay={userDropDown}>
                    <a href='/'>
                      <Avatar size={40} src={user.avatar_url} />
                    </a>
                  </Dropdown>
                ) : (
                  <Tooltip title='click to login'>
                    <a href={`/prepare-auth?url=${router.asPath}`}>
                      <Avatar size={40} icon={<UserOutlined />} />
                    </a>
                  </Tooltip>
                )}
              </div>
            </div>
          </Container>
        </Header>
        <Content>
          <Container>{children}</Container>
        </Content>
        <Footer style={footerStyle}>
          Develop by Leonard @
          <a href='mailto:dzhu31@hotmail.com'>dzhu31@hotmail.com</a>
        </Footer>
      </Layout>
      <style jsx>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
        }
      `}</style>
      <style jsx global>
        {`
          #__next {
            height: 100%;
          }
          .ant-layout {
            height: 100%;
          }
        `}
      </style>
    </>
  );
};

export default connect(
  function mapState(state) {
    return {
      user: state.user,
    };
  },
  function mapReducer(dispatch) {
    return {
      logout: () => dispatch(logout()),
    };
  }
)(withRouter(PageLayout));
//把path参数传给PageLayout
