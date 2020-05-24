import React from 'react';

const Detail = () => {
  return <span>Detail Page</span>;
};

Detail.getInitialProps = () => {
  return new Promise((resovle) => {
    setTimeout(() => {
      resovle({});
    }, 10000);
  });
};

export default Detail;
