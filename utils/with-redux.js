import React, { Component } from 'react';

import createStore from '../store/store';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
  if (isServer) {
    return createStore(initialState);
  }

  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = createStore(initialState);
    //在客户端使用window对象挂载store对象
    //这样保证了客户端只有一个store, 不会每次路由跳转都重新初始化store
  }

  return window[__NEXT_REDUX_STORE__];
} //对于store在客户端和服务器端的不同操作

export default (Comp) => {
  //HOC来处理App组件 提供redux的初始对象给App
  class AppWithRedux extends Component {
    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
      //根据得到的store的State 去创造一个服务端的store
    }
    render() {
      const { Component, pageProps, ...rest } = this.props;
      //Component,pageProps都是来自APP组件原本应该接收的参数

      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          reduxStore={this.reduxStore}
        />
      ); //这里传递给APP组件 并在APP组件内执行注入
    }
  }

  AppWithRedux.getInitialProps = async (ctx) => {
    let reduxStore;
    if (isServer) {
      //服务端根据session里的用户信息进行store初始化
      const { req } = ctx.ctx;
      // console.log(ctx);
      const session = req.session;
      if (session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo,
        });
      } else {
        reduxStore = getOrCreateStore();
      }
    } else {
      reduxStore = getOrCreateStore();
    }

    ctx.reduxStore = reduxStore;
    //这样在App组件以及子组件上下文中就都已拿到reduxStore了

    let pageProps = {};
    if (typeof Comp.getInitialProps === 'function') {
      pageProps = await Comp.getInitialProps(ctx);
    }

    return {
      ...pageProps,
      initialReduxState: reduxStore.getState(),
      //返回给AppWithRedux组件，不能直接传store对象，因为上面绑定了很多方法
      //并且在客户端会接收到这个可序列化的字符串，再创建一个客户端的store
    };
  }; //这个方法属于App在服务器端渲染，和客户端页面跳转后都会被执行，
  // 里面的变量在执行完成后会被销毁，下次执行再重新创建

  return AppWithRedux;
};

// 在App中可以取得reduxStore 再传给Provider（react-redux);
