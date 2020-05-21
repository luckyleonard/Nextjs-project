import App from 'next/app';

import 'antd/dist/antd.css';
import PageLayout from '../components/Layout';

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }
  //重写App的render方法
  render() {
    const { Component, pageProps } = this.props;
    //被渲染的页面组件
    return (
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    );
  }
}

export default MyApp;
