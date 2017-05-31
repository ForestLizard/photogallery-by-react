require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imagesData = require('../data/imagesData.json');

//利用匿名函数，将图片名字转为图片url路径(模块化，并且该函数只执行一次)

imagesData = ((imagesData) => {
  imagesData.forEach((item) => {
    item.imageURL = require('../images/'+item.fileName);
  });
  console.log(imagesData);
  return imagesData;

})(imagesData);


class AppComponent extends React.Component {
  render() {
    return (
      <section className = "stage">
        <nav className = "nav-control"></nav>
        <section className = "img-sec"></section>
      </section>

    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
