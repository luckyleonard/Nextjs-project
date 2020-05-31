import { withRouter } from 'next/router';
import { useEffect } from 'react';
import { Row, Col, List, Pagination } from 'antd';

import { api_request } from '../utils/apiHelper';
import Repo from '../components/Repo';
import FilterLink from '../components/FilterLink';

const LANGUAGE = ['Javascript', 'HTML', 'CSS', 'TypeScript', 'Python', 'Go'];
const SORT_TYPE = [
  { name: 'Best Match' },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc',
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc',
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc',
  },
  {
    name: 'Fewest Forks',
    value: 'forks',
    order: 'asc',
  },
];

const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 'bold',
};

function noop() {}
const per_page = 20;

/**
 * @param query
 * @param sort
 * @param order
 * @param lang
 * @param page
 */
function Search({ router, repos }) {
  const { lang, sort, order, page } = router.query;

  return (
    <div className='root'>
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className='list-header'>Sort Method</span>}
            dataSource={SORT_TYPE}
            renderItem={(item) => {
              let selected = false;
              if (item.name === 'Best Match' && !sort) {
                selected = true;
                //默认的best match没有sort参数
              } else if (item.value === sort && item.order === order) {
                selected = true;
              }

              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {selected ? (
                    <span>{item.name}</span>
                  ) : (
                    <FilterLink
                      {...router.query}
                      name={item.name}
                      sort={item.value}
                      order={item.order}
                      per_page={per_page}
                    />
                  )}
                  {/* 选中则显示span 未选中的显示next Link */}
                </List.Item>
              );
            }}
          />
          <List
            bordered
            header={<span className='list-header'>Program Language</span>}
            style={{ marginTop: 20 }}
            dataSource={LANGUAGE}
            renderItem={(item) => {
              const selected = lang === item;
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {selected ? (
                    <span>{item}</span>
                  ) : (
                    <FilterLink
                      {...router.query}
                      name={item}
                      lang={item}
                      per_page={per_page}
                      // 后面传入的参数可以覆盖query里传入的同名参数
                    />
                  )}
                </List.Item>
              );
            }}
          />
        </Col>
        <Col span={18}>
          <h2 className='repo-title'>{repos.total_count} repository results</h2>
          {repos.items.map((repo) => (
            <Repo repo={repo} key={repo.id} />
          ))}
          <div className='pagination'>
            <Pagination
              pageSize={per_page}
              current={Number(page) || 1}
              total={1000}
              // limitation from github for 1000 result
              showSizeChanger={false}
              responsive
              onChange={noop}
              itemRender={(page, type, originalElement) => {
                const pageNumber =
                  type === 'page'
                    ? page
                    : type === 'prev'
                    ? page - 1
                    : page + 1;
                const name = type === 'page' ? page : originalElement;
                return (
                  <FilterLink {...router.query} page={pageNumber} name={name} />
                );
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .root {
          padding: 20px 0;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 50px;
        }
        .pagination {
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query;

  if (!query) {
    return {
      repos: {
        total_count: 0,
      },
    };
  }

  // e.g: ?q=react+language:react&sort=stars&order=desc&page=2
  let queryString = `?q=${query}`;
  if (lang) queryString += `+language:${lang}`;
  if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`;
  if (page) queryString += `&page=${page}`;
  queryString += `&per_page=${per_page}`;

  const result = await api_request(
    { url: `/search/repositories${queryString}` },
    ctx.req,
    ctx.res
  );

  return {
    repos: result.data,
  };
};
export default withRouter(Search);
