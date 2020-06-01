import Link from 'next/link';
import { withRouter } from 'next/router';
import { useEffect } from 'react';

import { api_request } from '../utils/apiHelper';
import { cache, get } from '../utils/with-repo-cache';
import Repo from '../components/Repo';

const isServer = typeof window === 'undefined';

function searchQuery(queryObject) {
  //.entries change {key1：value1,key2：value2} to [[key1,value1],[key2,value2],...]
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join('='));
      return result;
      //entry:[owner,value1] to ['owner=value1','name=value2']
    }, [])
    .join('&');
  // to 'owner=value1&name=value2
  return `?${query}`;
}

export default (Comp, type = 'index') => {
  function withDetail({ repo, router, ...rest }) {
    const query = searchQuery(router.query);

    useEffect(() => {
      !isServer && cache(repo);
    }, []); //在客户端缓存这条repo数据，如果已经有了会被覆盖

    return (
      <div className='root'>
        <div className='repo-basic'>
          <Repo repo={repo} />
          <div className='tabs'>
            {type === 'index' ? (
              <span className='tab index'>Readme</span>
            ) : (
              <Link href={`/detail${query}`}>
                <a className='tab index'>Readme</a>
              </Link>
            )}
            {type === 'issues' ? (
              <span className='tab issues'>Issues</span>
            ) : (
              <Link href={`/detail/issues${query}`}>
                <a className='tab issues'>Issues</a>
              </Link>
            )}
          </div>
          <div>
            <Comp {...rest} />
          </div>
          <style jsx>{`
            .root {
              padding-top: 20px;
            }
            .repo-basic {
              padding: 20px;
              border: 1px solid #eee;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            .tab + .tab {
              margin-left: 20px;
            }
          `}</style>
        </div>
      </div>
    );
  }

  withDetail.getInitialProps = async (context) => {
    const { ctx } = context;
    const { owner, name } = ctx.query; //使用ctx 不能使用router

    const full_name = `${owner}${name}`;

    let pageData = {};
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context);
    } //接收Comp的getInit函数并运行返回参数 传给HOC并最终传给Comp

    if (get(full_name)) {
      return {
        repo: get(full_name),
        ...pageData,
      };
    }

    const repo = await api_request(
      { url: `/repos/${owner}/${name}` },
      ctx.req,
      ctx.res
    );

    return {
      repo: repo.data,
      ...pageData,
    };
  };
  return withRouter(withDetail);
};
