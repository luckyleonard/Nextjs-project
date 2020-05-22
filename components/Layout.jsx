import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button, Layout, Input, Avatar } from 'antd';
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import Container from './Container';

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

const PageLayout = ({ children }) => {
  const [search, setSearch] = useState('');
  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);
  const handleOnSearch = useCallback(() => {}, []);
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
                <Avatar size={40} icon={<UserOutlined />} />
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

export default PageLayout;
