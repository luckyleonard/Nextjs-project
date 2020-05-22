import App from 'next/app';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import withRedux from '../utils/with-redux';
import PageLayout from '../components/Layout';

class MyApp extends App {
  //方法每次页面切换都会被执行
  static async getInitialProps(ctx) {
    const { Component } = ctx;
    let pageProps = {};
    // 自义定app后,如果页面有用到getInitialProps,则需要手动从这里传过去
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }
  //重写App的render方法
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    //被渲染的页面组件
    return (
      <Provider store={reduxStore}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Provider>
    );
  }
}

export default withRedux(MyApp);
