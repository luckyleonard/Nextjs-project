import { memo, isValidElement } from 'react';
import Link from 'next/link';

const FilterLink = memo(
  ({ name, query, lang, sort, order, page, per_page }) => {
    // 拼接路由参数
    let queryString = `?query=${query}`;
    if (lang) queryString += `&lang=${lang}`;
    if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`;
    if (page) queryString += `&page=${page}`;
    queryString += `&per_page=${per_page}`;
    // const doSearch = () => {
    //   Router.push({
    //     pathname: '/search',
    //     query: {
    //       query,
    //       lang,
    //       sort,
    //       order
    //     }
    //   })
    // } 本用来绑定a组件，使用Link替换

    // isValidElement判断是否是个标签
    return (
      <Link href={`/search${queryString}`}>
        {isValidElement(name) ? name : <a>{name}</a>}
      </Link>
    );
  }
);

export default FilterLink;
