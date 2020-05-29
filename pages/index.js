import { Button } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';

import { api_request } from '../utils/apiHelper.js';
import Repo from '../components/Repo';

function Index({ userRepos, userStaredRepos, user, router }) {
  if (!user || !user.id) {
    return (
      <div className='root'>
        <p>Please login to view your repositories!</p>
        <Button type='primary' href={`/prepare-auth?url=${router.asPath}`}>
          Login now
        </Button>
        <style jsx>{`
          .root {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }
  // console.log(user);
  return (
    <div className='root'>
      <div className='user-info'>
        <img src={user.avatar_url} alt='avatar picture' className='avatar' />
        <span className='login'>{user.login}</span>
        <span className='name'>{user.name}</span>
        <span className='bio'>{user.bio}</span>
        <p className='email'>
          <a href={`${user.blog}`}>
            <LinkedinOutlined style={{ marginRight: 10 }} />
            {user.blog ? 'My Linkedin' : 'https://github.com'}
          </a>
        </p>
      </div>
      <div className='user-repos'>
        {userRepos.map((repo) => (
          <Repo repo={repo} key={repo.id} />
        ))}
        {userStaredRepos.map((repo) => (
          <Repo repo={repo} key={repo.id} />
        ))}
      </div>
      <style jsx>{`
        .root {
          display: flex;
          padding: 20px 0;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;//不能被压缩
          display: flex;
          flex-direction: column;
        }
        .avatar {
          width: 100%;
          border-radius
        }
        .login {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .user-repos {
          flex-grow: 1;//伸展开
        }
      `}</style>
    </div>
  );
}

// getInitialProps在服务端渲染会执行一次(服务端执行),跳转到这个页面也会执行一次(客户端执行)
Index.getInitialProps = async ({ ctx, reduxStore }) => {
  // '/github/search/repositories?q=react'在服务端和客户端会读取成不同地址
  // 服务端请求axios是localhost的80端口
  // const result = await axios.get('/github/search/repositories?q=react');
  // const result = await api_request(
  //   {
  //     url: '/search/repositories?q=react',
  //   },
  //   ctx.req,
  //   ctx.res
  // );
  // return {
  //   data: result.data,
  // };
  const user = reduxStore.getState().user;
  if (!user || !user.id) {
    return;
  } //从withRedux里面拿到传给app的初始化reduxStore对象
  const userRepos = await api_request({ url: '/user/repos' }, ctx.req, ctx.res);
  const userStaredRepos = await api_request(
    { url: '/user/starred' },
    ctx.req,
    ctx.res
  );
  //get data from the authorized user from Github

  return {
    userRepos: userRepos.data,
    userStaredRepos: userStaredRepos.data,
  };
};

export default withRouter(
  connect(function mapStateToProps(state) {
    return {
      user: state.user,
    };
  })(Index)
);
