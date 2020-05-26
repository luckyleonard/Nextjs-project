import { api_request } from '../utils/apiHelper.js';

const Index = ({ data }) => {
  return (
    <div className='container'>
      <main>
        <h1 className='title'>
          Welcome to <a href='https://nextjs.org'>Next.js!</a>
        </h1>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }
      `}</style>
    </div>
  );
};

// getInitialProps在服务端渲染会执行一次(服务端执行),跳转到这个页面也会执行一次(客户端执行)
Index.getInitialProps = async ({ ctx }) => {
  // '/github/search/repositories?q=react'在服务端和客户端会读取成不同地址
  // 服务端请求axios是localhost的80端口
  // const result = await axios.get('/github/search/repositories?q=react');
  const result = await api_request(
    {
      url: '/search/repositories?q=react',
    },
    ctx.req,
    ctx.res
  );
  return {
    data: result.data,
  };
};

export default Index;
